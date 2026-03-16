import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { orgId, name } = await req.json();
    if (!orgId || !name) return new NextResponse('Missing orgId or name', { status: 400 });

    const { error } = await supabaseAdmin
        .from('organizations')
        .upsert({ id: orgId, name });

    if (error) {
        console.error('Supabase upsert error:', error);
        return new NextResponse('Database error', { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
