"use server";

import { auth } from "@clerk/nextjs/server";
import { ZodStringDef, z } from "zod";

const teacherSchema = z.object({
    firstName: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    lastName: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    address: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    city: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    phonenumber: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    borndate: z.date(),
    aboutMe: z
      .string()
      .min(10, { message: "Please summerize about your more" }),
      education: z.string().min(10, { message: "Description is required" }),
      website: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
      facebook: z.string().min(3, { message: "The name has to be a min charackter length of 5" }),
    picture: z.string().min(3, { message: "Images are required" }),
    certificate: z.string().min(3, { message: "Images are required" })
  });


  export async function AddTeacher(formData: FormData) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Something went wrong");
      }
    
      const validateFields = teacherSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        address: formData.get("address"),
        city: formData.get("city"),
        phonenumber: formData.get("phonenumber"),
        borndate: formData.get("borndate"),
        aboutMe: formData.get("aboutme"),
        education: formData.get("education"),
        website: formData.get("website"),
        facebook: formData.get("facebook"),
        picture: formData.get("firstName"),
        certificate: formData.get("firstName"),

      })
  }