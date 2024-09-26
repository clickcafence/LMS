//това ми е екшън файла с който селектирам потребителите които са поръчали курс от учител. т.е виждам само потребиелите които са поръчали моите курсове ако съм учител. 
// app/actions/getTeacherUsers.ts
import { db } from "@/lib/db";

// Function to fetch users who have purchased the teacher's courses
export async function getTeacherUsers(userId: string) {
  const courses = await db.course.findMany({
    where: {
      userId: userId, // Filter courses by teacher's userId
    },
    select: {
      id: true, // We only need the course IDs
    },
  });

  const courseIds = courses.map(course => course.id);

  if (courseIds.length === 0) {
    return []; // If no courses exist for the teacher, return an empty array
  }

  // Fetch clerkUserIds of users who purchased any of the teacher's courses
  const purchases = await db.purchase.findMany({
    where: {
      courseId: {
        in: courseIds, // Filter by the teacher's course IDs
      },
    },
    select: {
      userId: true, // We only need the userId (which is clerkUserId) from the Purchase model
    },
  });

  const clerkUserIds = Array.from(new Set(purchases.map(purchase => purchase.userId))); // Ensure unique clerkUserIds

  if (clerkUserIds.length === 0) {
    return []; // If no users have purchased, return an empty array
  }

  // Fetch detailed user information from the User model using clerkUserIds
  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: clerkUserIds, // Filter users by the collected clerkUserIds
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return users;
}
