import { db } from "@/lib/db";
import { Attachment, Chapter, User } from "@prisma/client";

interface getChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

export const getChapter = async ({ 
    userId, 
    courseId, 
    chapterId 
}: getChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: { 
                    userId,
                    courseId,
                },
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            select: {
                price: true,
                userId: true, // Fetch the userId (teacher)
            }
        });

        if (!course) {
            throw new Error("Course not found");
        } 

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter) {
            throw new Error("Chapter not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        // Fetch the course owner's information using userId from the course
        const owner = await db.user.findUnique({
            where: {
                clerkUserId: course.userId,
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,  // Add email for the letter icon link
              },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
            owner, // Include the owner
        
        };

    } catch (error) {
        console.log(error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: null,
            nextChapter: null,
            userProgress: null,
            purchase: null,
            owner: null,
             
        }
    }
}
