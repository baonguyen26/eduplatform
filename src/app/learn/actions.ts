'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Lesson {
    id: string
    course_id: string
    module_id: string | null
    title: string
    content: string | null
    video_url: string | null
    duration: number | null
    order_index: number
}

export interface LessonWithProgress extends Lesson {
    progress?: {
        status: 'not_started' | 'started' | 'completed'
        last_watched_position: number
    }
}

export async function getLessonById(lessonId: string): Promise<LessonWithProgress | null> {
    const supabase = await createClient()

    const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (error || !lesson) {
        console.error('Error fetching lesson:', error)
        return null
    }

    // Get user progress
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single()

        return {
            ...lesson,
            progress: progress || undefined
        }
    }

    return lesson
}

export async function getCourseLessonsForPlayer(courseId: string) {
    const supabase = await createClient()

    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    // Get user progress
    const { data: { user } } = await supabase.auth.getUser()
    let progressMap: Record<string, any> = {}

    if (user && lessons) {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessons.map(l => l.id))

        progressMap = progress?.reduce((acc, p) => {
            acc[p.lesson_id] = p
            return acc
        }, {} as Record<string, any>) || {}
    }

    return lessons?.map(lesson => ({
        ...lesson,
        progress: progressMap[lesson.id]
    })) || []
}

export async function updateLessonProgress(
    lessonId: string,
    status: 'not_started' | 'started' | 'completed',
    lastWatchedPosition?: number
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const updateData: any = {
        user_id: user.id,
        lesson_id: lessonId,
        status,
        updated_at: new Date().toISOString()
    }

    if (lastWatchedPosition !== undefined) {
        updateData.last_watched_position = lastWatchedPosition
    }

    if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('user_progress')
        .upsert(updateData, {
            onConflict: 'user_id,lesson_id'
        })

    if (error) {
        console.error('Error updating progress:', error)
        return { error: error.message }
    }

    revalidatePath('/courses')
    revalidatePath('/learn')

    return { success: true }
}
