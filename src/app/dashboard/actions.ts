'use server'

import { createClient } from '@/utils/supabase/server'

export async function getRecentCourses(limit: number = 3) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    // Get user's recent progress
    const { data: recentProgress } = await supabase
        .from('user_progress')
        .select('lesson_id, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10)

    if (!recentProgress || recentProgress.length === 0) {
        return []
    }

    // Get lesson details and course info
    const lessonIds = recentProgress.map(p => p.lesson_id)
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id, course_id')
        .in('id', lessonIds)

    if (!lessons) {
        return []
    }

    // Get unique course IDs
    const courseIds = [...new Set(lessons.map(l => l.course_id))]

    // Get course details with progress
    const coursesWithProgress = await Promise.all(
        courseIds.slice(0, limit).map(async (courseId) => {
            const { data: course } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .eq('published', true)
                .single()

            if (!course) return null

            // Get all lessons for this course
            const { data: allLessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('course_id', courseId)

            const totalLessons = allLessons?.length || 0

            // Get completed lessons for this user
            const { data: progress } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .in('lesson_id', allLessons?.map(l => l.id) || [])
                .eq('status', 'completed')

            const completedLessons = progress?.length || 0
            const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

            // Get the most recent lesson for this course
            const recentLesson = lessons.find(l => l.course_id === courseId)

            return {
                ...course,
                progress: progressPercentage,
                total_lessons: totalLessons,
                completed_lessons: completedLessons,
                last_lesson_id: recentLesson?.id
            }
        })
    )

    return coursesWithProgress.filter(Boolean)
}

export async function getUserStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Get total completed lessons
    const { data: completedProgress, count: completedCount } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')

    // Get total courses started
    const { data: allProgress } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)

    if (!allProgress) {
        return {
            completed_lessons: 0,
            courses_started: 0,
            total_study_time: 0
        }
    }

    // Get unique course IDs
    const { data: lessons } = await supabase
        .from('lessons')
        .select('course_id, duration')
        .in('id', allProgress.map(p => p.lesson_id))

    const uniqueCourses = lessons ? [...new Set(lessons.map(l => l.course_id))].length : 0

    // Calculate total study time (sum of completed lesson durations)
    const { data: completedLessons } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')

    let totalDuration = 0
    if (completedLessons) {
        const { data: lessonDetails } = await supabase
            .from('lessons')
            .select('duration')
            .in('id', completedLessons.map(p => p.lesson_id))

        totalDuration = lessonDetails?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
    }

    return {
        completed_lessons: completedCount || 0,
        courses_started: uniqueCourses,
        total_study_time: Math.floor(totalDuration / 60) // Convert to minutes
    }
}
