import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: 'price_YOUR_TEST_PRICE_ID', quantity: 1 }], // Create a price in Stripe Dashboard
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    metadata: { orgId: orgId }, // CRITICAL: Links payment to Org
  });

  return NextResponse.json({ url: session.url });
}
