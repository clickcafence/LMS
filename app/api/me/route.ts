import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db';

export async function GET() {
  const { userId } = auth()
  const user = await currentUser();

  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong...");
  }

 let dbUser = await db.profile.findUnique({
    where: {
      id: user.id,
    },
  });
  
  let firstName = user.firstName || "";
  let lastName = user.lastName || "";
  if (!firstName && !lastName) {
    const emailParts = user.emailAddresses[0].emailAddress.split("@");
    firstName = emailParts[0].trim();
    lastName = "";
}
  if (!dbUser) {
    dbUser = await db.profile.create({
      data: { 
        userId: user.id,
        name: `${firstName} ${lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
    }
    });

  }
  return NextResponse.redirect("http://localhost:3000");
}
