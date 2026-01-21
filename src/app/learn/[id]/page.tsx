'use client'

import { use, useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { getLessonById, getCourseLessonsForPlayer, updateLessonProgress } from '../actions'
import type { LessonWithProgress } from '../actions'
import { LessonSidebar } from './lesson-sidebar'
import { ArrowLeft, CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import ReactMarkdown from 'react-markdown'

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [lesson, setLesson] = useState<LessonWithProgress | null>(null)
    const [courseLessons, setCourseLessons] = useState<LessonWithProgress[]>([])
    const [loading, setLoading] = useState(true)
    const [completing, setCompleting] = useState(false)

    useEffect(() => {
        Promise.all([
            getLessonById(id),
        ]).then(async ([lessonData]) => {
            if (!lessonData) {
                notFound()
            }
            setLesson(lessonData)

            // Mark as started if not already
            if (!lessonData.progress || lessonData.progress.status === 'not_started') {
                await updateLessonProgress(id, 'started')
            }

            // Get all lessons for this course
            const lessons = await getCourseLessonsForPlayer(lessonData.course_id)
            setCourseLessons(lessons)

            setLoading(false)
        })
    }, [id])

    const handleComplete = async () => {
        if (!lesson) return

        setCompleting(true)
        await updateLessonProgress(id, 'completed')

        // Confetti celebration!
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)

        // Update local state
        setLesson({
            ...lesson,
            progress: {
                status: 'completed',
                last_watched_position: 0
            }
        })

        setCompleting(false)

        // Navigate to next lesson after 2 seconds
        const currentIndex = courseLessons.findIndex(l => l.id === id)
        if (currentIndex >= 0 && currentIndex < courseLessons.length - 1) {
            const nextLesson = courseLessons[currentIndex + 1]
            setTimeout(() => {
                router.push(`/learn/${nextLesson.id}`)
            }, 2000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!lesson) {
        notFound()
    }

    const isCompleted = lesson.progress?.status === 'completed'

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            {/* Top Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <Link
                        href={`/courses/${lesson.course_id}`}
                        className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại khóa học
                    </Link>

                    {!isCompleted && (
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-50"
                        >
                            {completing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Hoàn thành bài học
                                </>
                            )}
                        </button>
                    )}

                    {isCompleted && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-2xl border-2 border-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                            Đã hoàn thành
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Video/Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="w-full max-w-6xl">
                            {/* Video Player */}
                            {lesson.video_url && (
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-8">
                                    <iframe
                                        src={lesson.video_url.replace('watch?v=', 'embed/')}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {/* Lesson Title */}
                            <h1 className="text-4xl font-adaptive-display font-extrabold text-white mb-6">
                                {lesson.title}
                            </h1>

                            {/* Lesson Content */}
                            {lesson.content && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-slate-100 prose prose-invert max-w-none">
                                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-96 hidden lg:block">
                    <LessonSidebar lessons={courseLessons} currentLessonId={id} />
                </div>
            </div>
        </div>
    )
}
