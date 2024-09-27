import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; 
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// Handle the POST request for Stripe onboarding
export async function POST() {
  try {
    const { userId } = auth();
    console.log("Clerk userId:", userId);
    
    // Fetch the user from the DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    console.log("Database user:", user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user already has a Stripe connected account
    if (user.connectedAccountId) {
      return NextResponse.json({ message: 'Already connected to Stripe' });
    }

    // Create a Stripe connected account
    const stripeAccount = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save the connectedAccountId and mark stripeConnectedLinked as true
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { 
        connectedAccountId: stripeAccount.id,
        stripeConnectedLinked: true, // Mark as connected
      },
    });

    // Generate the Stripe onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccount.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/return/${stripeAccount.id}`, // Use env variables for dynamic URLs
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/return/${stripeAccount.id}`,  // Use env variables for dynamic URLs
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating Stripe account link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
