// api/user/stripe-status.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();

    // Fetch the user's stripeConnectedLinked status
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { stripeConnectedLinked: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ stripeConnectedLinked: user.stripeConnectedLinked });
  } catch (error) {
    console.error('Error fetching user Stripe status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
