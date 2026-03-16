import type { Service } from './types';

function toMonthly(s: Service) {
    return s.billing_cycle === 'monthly' ? s.cost : s.cost / 12;
}

function toAnnual(s: Service) {
    return s.billing_cycle === 'annual' ? s.cost : s.cost * 12;
}

export default function SpendSummary({ services }: { services: Service[] }) {
    const active = services.filter(s => s.status === 'active');
    const monthly = active.reduce((sum, s) => sum + toMonthly(s), 0);
    const annual = active.reduce((sum, s) => sum + toAnnual(s), 0);

    const fmt = (n: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

    const cards = [
        { label: 'Monthly spend', value: fmt(monthly) },
        { label: 'Annual spend', value: fmt(annual) },
        { label: 'Active services', value: String(active.length) },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map(c => (
                <div key={c.label} className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">{c.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{c.value}</p>
                </div>
            ))}
        </div>
    );
}
