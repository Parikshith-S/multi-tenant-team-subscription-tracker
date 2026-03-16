'use client';
import { useEffect, useState } from 'react';
import type { Service } from './types';

interface Props {
    open: boolean;
    service?: Service | null; // null/undefined = add mode
    onClose: () => void;
    onSaved: () => void;
}

const EMPTY = {
    name: '',
    category: '',
    cost: '',
    billing_cycle: 'monthly',
    renewal_date: '',
    status: 'active',
} as const;

export default function ServiceFormModal({ open, service, onClose, onSaved }: Props) {
    const [form, setForm] = useState({ ...EMPTY });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (service) {
            setForm({
                name: service.name,
                category: service.category,
                cost: String(service.cost),
                billing_cycle: service.billing_cycle,
                renewal_date: service.renewal_date.slice(0, 10),
                status: service.status,
            });
        } else {
            setForm({ ...EMPTY });
        }
        setError('');
    }, [service, open]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = { ...form, cost: parseFloat(form.cost) };
        const url = service ? `/api/services/${service.id}` : '/api/services';
        const method = service ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError(json.error ?? 'Something went wrong');
            setSaving(false);
            return;
        }

        onSaved();
        onClose();
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    {service ? 'Edit service' : 'Add service'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Field label="Name">
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className={input}
                        />
                    </Field>
                    <Field label="Category">
                        <input
                            required
                            placeholder="e.g. Dev Tools, Marketing, Infrastructure"
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className={input}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Cost ($)">
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.cost}
                                onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                                className={input}
                            />
                        </Field>
                        <Field label="Billing cycle">
                            <select
                                value={form.billing_cycle}
                                onChange={e => setForm(f => ({ ...f, billing_cycle: e.target.value as 'monthly' | 'annual' }))}
                                className={input}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="annual">Annual</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Renewal date">
                        <input
                            required
                            type="date"
                            value={form.renewal_date}
                            onChange={e => setForm(f => ({ ...f, renewal_date: e.target.value }))}
                            className={input}
                        />
                    </Field>
                    <Field label="Status">
                        <select
                            value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'canceled' | 'paused' }))}
                            className={input}
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </Field>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-600">{label}</span>
            {children}
        </label>
    );
}

const input =
    'rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black w-full';
