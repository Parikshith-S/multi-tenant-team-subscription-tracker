import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json().catch(() => ({}));
    const priceId = body.priceId ?? process.env.STRIPE_DEFAULT_PRICE_ID;

    if (!priceId) return new NextResponse('Missing priceId', { status: 400 });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        metadata: { orgId },
        subscription_data: {
            metadata: { orgId },
        },
    });

    return NextResponse.json({ url: session.url });
}
