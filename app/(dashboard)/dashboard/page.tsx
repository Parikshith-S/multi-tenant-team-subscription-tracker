import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { redirect } from 'next/navigation';
import DashboardClient from './_components/DashboardClient';
import type { Service } from './_components/types';

export default async function DashboardPage() {
    const { orgId } = await auth();
    if (!orgId) redirect('/onboarding');

    const [{ data: services }, { data: orgPlan }] = await Promise.all([
        supabaseAdmin
            .from('services')
            .select('*')
            .eq('org_id', orgId)
            .order('renewal_date', { ascending: true }),
        supabaseAdmin
            .from('subscriptions')
            .select('plan')
            .eq('org_id', orgId)
            .eq('status', 'active')
            .single(),
    ]);

    const isPro = orgPlan?.plan === 'pro';

    return (
        <div className="flex max-w-5xl flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                {!isPro && (
                    <a
                        href="/api/checkout"
                        className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Upgrade to Pro
                    </a>
                )}
            </div>

            <DashboardClient services={(services ?? []) as Service[]} isPro={isPro ?? false} />
        </div>
    );
}
