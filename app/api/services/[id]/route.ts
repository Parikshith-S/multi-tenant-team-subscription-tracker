import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabaseAdmin
        .from('services')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('org_id', orgId) // prevents cross-tenant writes
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const { error } = await supabaseAdmin
        .from('services')
        .delete()
        .eq('id', id)
        .eq('org_id', orgId); // prevents cross-tenant deletes

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return new Response(null, { status: 204 });
}
