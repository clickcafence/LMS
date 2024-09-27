import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const user = await currentUser();
      if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          isPublished: true,
        },
      });
  
      if (!course) {
        console.error("Course not found or unpublished");
        return new NextResponse("Not Found", { status: 404 });
      }
      // Ensure the course price is valid
      if (course.price === null || course.price === undefined) {
        console.error("Course price is missing");
        return new NextResponse("Course price is missing", { status: 400 });
      }
  
      const purchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: params.courseId,
          },
        },
      });
  
      if (purchase) {
        console.error("Course already purchased by the user");
        return new NextResponse("Already Purchased", { status: 400 });
      }
  
      const teacher = await db.user.findUnique({
        where: { clerkUserId: course.userId }, 
      });
  
      if (!teacher || !teacher.connectedAccountId || !teacher.stripeConnectedLinked) {
        console.error("Course owner has no connected Stripe account");
        return new NextResponse("Course owner has no connected Stripe account", { status: 400 });
      }
  
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
            },
            unit_amount: Math.round(course.price! * 100),
          },
          quantity: 1,
        },
      ];
  
      let stripeCustomer = await db.stripeCustomer.findUnique({
        where: { userId: user.id },
        select: { stripeCustomerId: true },
      });
  
      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: user.emailAddresses?.[0]?.emailAddress,
        });
  
        stripeCustomer = await db.stripeCustomer.create({
          data: {
            userId: user.id,
            stripeCustomerId: customer.id,
          },
        });
      }
  
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata: {
          courseId: course.id,
          userId: user.id,
        },
        payment_intent_data: {
          application_fee_amount: Math.round(course.price * 0.20 * 100),
          transfer_data: {
            destination: teacher.connectedAccountId,
          },
        },
      });
  
      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  