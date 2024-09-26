import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { userId } = await req.json();
    
    // Sending a simple notification email
    await sendgrid.send({
      to: "gabimaxipoli@gmail.com",
      from: "skravaykov@gmail.com", // Update this to your verified sender email
      subject: "New Agreement Request",
      text: `User with ID ${userId} has agreed to the terms.`,
      html: `<p>User with ID ${userId} has agreed to the terms.</p>`,
    });

    return NextResponse.json({ message: "Agreement email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

