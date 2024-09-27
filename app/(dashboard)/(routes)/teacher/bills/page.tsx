"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Submitbutton } from './_components/SubmitButtons';

const OnboardStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeConnected, setStripeConnected] = useState(false); // Track if connected
  const router = useRouter();

  
  // Fetch user's stripe connection status on component mount
  useEffect(() => {
    const fetchStripeStatus = async () => {
      try {
        const res = await fetch('/api/user'); // API to get stripeConnectedLinked status
        const data = await res.json();
        setStripeConnected(data.stripeConnectedLinked);
      } catch (err) {
        setError('Failed to fetch user Stripe status.');
      }
    };

    fetchStripeStatus();
  }, []);

  const handleStripeOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe onboarding
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('Failed to create Stripe onboarding link.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/stripedashboard');
  
      const data = await response.json();
  
      if (response.ok && data.url) {
        // Redirect to Stripe dashboard
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to fetch Stripe dashboard link');
      }
    } catch (err) {
      setError('Error fetching Stripe dashboard link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Find all your details regarding your payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stripeConnected === false && (
          <form action={handleStripeOnboarding}>
            <Submitbutton title="Link your Accout to stripe" />
          </form>
        )}

        {stripeConnected === true && (
          <form action={handleViewDashboard}>
            <Submitbutton title="View Dashboard" />
          </form>
        )}
      </CardContent>
    </Card>
  </section>
  );
};

export default OnboardStripe;
