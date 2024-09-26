export const isTeacher = (userId?: string | null) => {
    const teacherIds = process.env.NEXT_PUBLIC_TEACHER_IDS?.split(',').map(id => id.trim()) || [];
    console.log('Teacher IDs:', teacherIds);
    return teacherIds.includes(userId || '');
};