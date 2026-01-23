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

    // --- Knowledge Engine Hook ---
    // If completed, verify if this triggers any node mastery
    if (status === 'completed') {
        try {
            const { GraphEngine } = await import('@/lib/graph-engine');
            const engine = new GraphEngine(supabase);

            // Find which node(s) this lesson belongs to
            const { data: mappings } = await supabase
                .from('lesson_to_node')
                .select('node_id')
                .eq('lesson_id', lessonId);

            if (mappings) {
                for (const m of mappings) {
                    await engine.checkNodeMastery(user.id, m.node_id);
                }
            }
        } catch (e) {
            console.error('GraphEngine Check Failed:', e);
            // Don't fail the request request just because graph update failed
        }
    }

    revalidatePath('/courses')
    revalidatePath('/learn')

    return { success: true }
}

// --- Quiz Actions ---

export async function getQuizForLesson(lessonId: string) {
    const supabase = await createClient()

    // Fetch Quiz
    const { data: quiz, error } = await supabase
        .from('quizzes')
        .select(`
            *,
            questions:quiz_questions(*)
        `)
        .eq('lesson_id', lessonId)
        .single()

    if (error || !quiz) return null

    // Sort questions by order_index
    if (quiz.questions) {
        quiz.questions.sort((a: any, b: any) => a.order_index - b.order_index)
    }

    return quiz
}

export async function submitQuizAttempt(
    quizId: string,
    score: number,
    passed: boolean,
    answers: any
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // Record Attempt
    const { data: attempt, error } = await supabase
        .from('user_quiz_attempts')
        .insert({
            user_id: user.id,
            quiz_id: quizId,
            score,
            passed,
            answers
        })
        .select()
        .single()

    if (error) {
        console.error('Error submitting quiz:', error)
        return { error: error.message }
    }

    // Award XP if passed
    if (passed) {
        // Fetch quiz reward
        const { data: quiz } = await supabase
            .from('quizzes')
            .select('xp_reward, lesson_id')
            .eq('id', quizId)
            .single()

        if (quiz) {
            // Check if already passed before? (Prevent XP farming)
            // Implementation: Check previous attempts. For now, let's just award it once per lesson completion? 
            // Or just award it.

            // Increment Profile XP
            await supabase.rpc('increment_xp', {
                user_id: user.id,
                amount: quiz.xp_reward
            })

            // Mark Lesson as Completed
            await updateLessonProgress(quiz.lesson_id, 'completed')
        }
    }

    revalidatePath('/learn')
    return { success: true, attempt }
}
