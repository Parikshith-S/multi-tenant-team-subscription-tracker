'use client';
import type { Service } from './types';

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-gray-100 text-gray-600',
};

function isRenewingSoon(dateStr: string) {
    const renewal = new Date(dateStr);
    const now = new Date();
    const diff = (renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
}

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

interface Props {
    services: Service[];
    onEdit: (s: Service) => void;
    onDelete: (id: string) => void;
}

export default function ServiceTable({ services, onEdit, onDelete }: Props) {
    if (services.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-gray-500">
                No services yet. Add one to get started.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Cycle</th>
                        <th className="px-4 py-3">Renewal</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {services.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                            <td className="px-4 py-3 text-gray-500">{s.category}</td>
                            <td className="px-4 py-3 text-gray-900">{fmt(s.cost)}</td>
                            <td className="px-4 py-3 capitalize text-gray-500">{s.billing_cycle}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        isRenewingSoon(s.renewal_date) && s.status === 'active'
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-500'
                                    }
                                >
                                    {new Date(s.renewal_date).toLocaleDateString()}
                                    {isRenewingSoon(s.renewal_date) && s.status === 'active' && (
                                        <span className="ml-1 text-xs">⚠</span>
                                    )}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[s.status] ?? ''}`}
                                >
                                    {s.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onEdit(s)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(s.id)}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
