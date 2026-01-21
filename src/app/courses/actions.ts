'use server'

import { createClient } from '@/utils/supabase/server'

export interface Course {
    id: string
    title: string
    description: string | null
    thumbnail_url: string | null
    subject: string
    grade_level: string
    published: boolean
    created_at: string
}

export interface CourseWithProgress extends Course {
    progress?: number
    total_lessons?: number
    completed_lessons?: number
}

export async function getCourses(filters?: {
    subject?: string
    gradeLevel?: string
}): Promise<CourseWithProgress[]> {
    const supabase = await createClient()

    let query = supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

    if (filters?.subject) {
        query = query.eq('subject', filters.subject)
    }

    if (filters?.gradeLevel) {
        query = query.eq('grade_level', filters.gradeLevel)
    }

    const { data: courses, error } = await query

    if (error) {
        console.error('Error fetching courses:', error)
        return []
    }

    // Get user progress for each course
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return courses as CourseWithProgress[]
    }

    // Fetch progress data for authenticated users
    const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
            // Get all lessons for this course
            const { data: lessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('course_id', course.id)

            const totalLessons = lessons?.length || 0

            // Get completed lessons for this user
            const { data: progress } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .in('lesson_id', lessons?.map(l => l.id) || [])
                .eq('status', 'completed')

            const completedLessons = progress?.length || 0
            const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

            return {
                ...course,
                progress: progressPercentage,
                total_lessons: totalLessons,
                completed_lessons: completedLessons
            }
        })
    )

    return coursesWithProgress
}

export async function getCourseById(courseId: string) {
    const supabase = await createClient()

    const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('published', true)
        .single()

    if (error) {
        console.error('Error fetching course:', error)
        return null
    }

    return course
}

export async function getCourseLessons(courseId: string) {
    const supabase = await createClient()

    // Get modules and lessons
    const { data: modules } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    // Get user progress
    const { data: { user } } = await supabase.auth.getUser()
    let progressMap: Record<string, any> = {}

    if (user) {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessons?.map(l => l.id) || [])

        progressMap = progress?.reduce((acc, p) => {
            acc[p.lesson_id] = p
            return acc
        }, {} as Record<string, any>) || {}
    }

    return {
        modules,
        lessons: lessons?.map(lesson => ({
            ...lesson,
            progress: progressMap[lesson.id]
        })),
    }
}
