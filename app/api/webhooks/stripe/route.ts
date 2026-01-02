import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new Response('Webhook Error', { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const orgId = session.metadata.orgId;
    // Update Supabase with new subscription
    await supabaseAdmin.from('subscriptions').upsert({
      org_id: orgId,
      stripe_subscription_id: session.subscription,
      status: 'active',
      plan: 'pro'
    });
  }

  return new Response(null, { status: 200 });
}
