import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { firstName, lastName, address, city, phoneNumber, bornDate, aboutMe, education, website, facebook, image } = await req.json();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }   

        const teacher = await db.teacher.create({
            data: {
                userId,
                firstName,
                lastName,
                address,
                city,
                phoneNumber,
                bornDate,
                aboutMe,
                education,
                website,
                facebook,
                image
            },
        });

        return NextResponse.json(teacher);

    } catch (error) {
        console.log("[TEACHER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

