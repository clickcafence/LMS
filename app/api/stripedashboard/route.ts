// api/stripe/dashboard-link.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; // Make sure the path is correct
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Missing user ID' }, { status: 401 });
    }
    // Fetch the user from the DB
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || !user.connectedAccountId) {
      return NextResponse.json({ error: 'Stripe account not found' }, { status: 404 });
    }

    // Create the dashboard link using the user's Stripe connected account ID
    const link = await stripe.accounts.createLoginLink(user.connectedAccountId);

    return NextResponse.json({ url: link.url });
  } catch (error) {
    console.error('Error fetching Stripe dashboard link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
