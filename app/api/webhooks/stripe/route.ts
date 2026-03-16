import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
        return new Response('Webhook Error: invalid signature', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        const subId = session.subscription as string;

        if (orgId && subId) {
            await supabaseAdmin.from('subscriptions').upsert({
                org_id: orgId,
                stripe_subscription_id: subId,
                status: 'active',
                plan: 'pro',
                updated_at: new Date().toISOString(),
            });
        }
    }

    if (event.type === 'customer.subscription.updated') {
        const sub = event.data.object as Stripe.Subscription;
        const orgId = sub.metadata?.orgId;

        if (orgId) {
            await supabaseAdmin
                .from('subscriptions')
                .update({ status: sub.status, updated_at: new Date().toISOString() })
                .eq('org_id', orgId);
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const sub = event.data.object as Stripe.Subscription;
        const orgId = sub.metadata?.orgId;

        if (orgId) {
            await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'canceled', updated_at: new Date().toISOString() })
                .eq('org_id', orgId);
        }
    }

    return new Response(null, { status: 200 });
}
