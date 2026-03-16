import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

const FREE_LIMIT = 5;

export async function GET() {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('org_id', orgId)
        .order('renewal_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Plan gating: check current count and subscription
    const [{ count }, { data: orgPlan }] = await Promise.all([
        supabaseAdmin
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('org_id', orgId),
        supabaseAdmin
            .from('subscriptions')
            .select('plan')
            .eq('org_id', orgId)
            .eq('status', 'active')
            .single(),
    ]);

    const isPro = orgPlan?.plan === 'pro';

    if (!isPro && (count ?? 0) >= FREE_LIMIT) {
        return NextResponse.json(
            { error: `Upgrade to Pro to track more than ${FREE_LIMIT} services` },
            { status: 403 }
        );
    }

    const body = await req.json();
    const { data, error } = await supabaseAdmin
        .from('services')
        .insert({ ...body, org_id: orgId })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
