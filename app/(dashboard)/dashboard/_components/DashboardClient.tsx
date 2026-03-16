'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpendSummary from './SpendSummary';
import ServiceTable from './ServiceTable';
import ServiceFormModal from './ServiceFormModal';
import type { Service } from './types';

interface Props {
    services: Service[];
    isPro: boolean;
}

export default function DashboardClient({ services, isPro }: Props) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);

    function openAdd() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(s: Service) {
        setEditing(s);
        setModalOpen(true);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this service?')) return;
        await fetch(`/api/services/${id}`, { method: 'DELETE' });
        router.refresh();
    }

    function handleSaved() {
        router.refresh();
    }

    const renewingSoon = services.filter(s => {
        if (s.status !== 'active') return false;
        const diff =
            (new Date(s.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30;
    });

    return (
        <>
            <SpendSummary services={services} />

            {renewingSoon.length > 0 && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-medium text-orange-800">
                        {renewingSoon.length} service{renewingSoon.length > 1 ? 's' : ''} renewing in the next 30 days:
                    </p>
                    <ul className="mt-1 space-y-0.5">
                        {renewingSoon.map(s => (
                            <li key={s.id} className="text-sm text-orange-700">
                                {s.name} — {new Date(s.renewal_date).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                    Services
                    {!isPro && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                            ({services.length}/5 free)
                        </span>
                    )}
                </h2>
                <button
                    onClick={openAdd}
                    className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                    + Add service
                </button>
            </div>

            <ServiceTable services={services} onEdit={openEdit} onDelete={handleDelete} />

            <ServiceFormModal
                open={modalOpen}
                service={editing}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
            />
        </>
    );
}
