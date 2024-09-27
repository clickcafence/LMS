"use client";

import * as React from "react"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { useAuth } from "@clerk/nextjs";
import Modal from "./_components/Modal";



const formSchema = z.object({
  firstName: z.string().min(1, { message: "FirstName is required" }),
  lastName: z.string().min(1, { message: "LastName is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phoneNumber: z.string().min(1, { message: "Phonenumber is required" }),
  bornDate: z.date().optional(),
  aboutMe: z.string().min(1, { message: "About me is required" }),
  education: z.string().min(1, { message: "Education is required" }),
  website: z.string().optional(),
  facebook: z.string().optional(),
  image: z.string().min(1, { message: "Image are required" }),
})

const CreateTeacherPage = () => {
const {userId} = useAuth();
const [isAgreementModalOpen, setAgreementModalOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>()
  const [images, setImages] = React.useState<null | string>(null);
  const router = useRouter();
  const cities = [
    "Sofia",
    "Plovdiv",
    "Varna",
    "Burgas",
    "Ruse",
    "Stara Zagora",
    "Pleven",
    "Sliven",
    "Dobrich",
    "Shumen",
    "Haskovo"
  ];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      phoneNumber: "",
      bornDate: new Date(),
      aboutMe: "",
      education: "",
      website: "",
      facebook: "",
      image: "",

    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAgreementModalOpen(true);
  
      const adjustedBornDate = values.bornDate
        ? new Date(
            Date.UTC(
              values.bornDate.getFullYear(),
              values.bornDate.getMonth(),
              values.bornDate.getDate()
            )
          )
        : undefined;
  
      await axios.post("/api/teacher", {
        ...values,
        bornDate: adjustedBornDate,
      });
  
      toast.success("Teacher request is created");
    } catch (error: any) {
      setAgreementModalOpen(false);
      if (error.response) {
        toast.error(`Server responded with ${error.response.status} error`);
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  
  
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Please fiil all fields ...
        </h1>
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="First Name"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Last Name"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="address"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City
                  </FormLabel>
                  <FormControl>
                  <select
          className="border border-gray-300 rounded p-2 w-full"
          disabled={isSubmitting}
          {...field} // spread the field props
        >
          <option value="" disabled>Select your city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Phonenumber"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="bornDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Born Date:</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            field.onChange(selectedDate); // Update the form state
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    About Me
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="about me"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Education
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="education"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Web Site
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Web Site"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Facebook
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Facebook"
                      {...field} // spread the field props
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
              }
            />
<FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Picture</FormLabel>
      <FormControl>
        <div>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              const imageUrl = res[0].url;
              setImages(imageUrl); // Save the uploaded image URL in state
              form.setValue("image", imageUrl); // Update the form's image field with the URL
              toast.success("Your image has been uploaded");
            }}
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {images && (
            <div className="mt-4">
              <p>Uploaded Image:</p>
              <img src={images} alt="Uploaded" className="w-48 h-48 object-cover rounded-md" />
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
            <div className="flex items-center gap-x-2" >
              <Link href="/teacher/courses">
                <Button
                  variant="ghost"
                  type="button"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                //disabled={!isValid || isSubmitting}
                variant="ghost"
              >
                Save Data
              </Button>
            </div>

          </form>
        </Form>
        <Modal 
  userId={userId} 
  isOpen={isAgreementModalOpen} 
  onClose={() => setAgreementModalOpen(false)} 
/>
      </div>

    </div>
  )


}

export default CreateTeacherPage;