import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req: Request) {
  try {
    const { ownerEmail, senderName, senderEmail, message } = await req.json();

    const msg = {
      to: ownerEmail,
      from: senderEmail, // From the student's email
      subject: `New feedback from ${senderName}`,
      text: message,
      html: `<p>${message}</p>`,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
