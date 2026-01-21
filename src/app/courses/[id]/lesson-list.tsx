'use client'

import { motion } from 'framer-motion'
import { Play, CheckCircle2, Circle, Lock } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
    id: string
    title: string
    duration: number
    order_index: number
    module_id?: string | null
    progress?: {
        status: string
    }
}

interface Module {
    id: string
    title: string
    description: string | null
    order_index: number
}

interface LessonListProps {
    modules: Module[] | null
    lessons: Lesson[]
}

export function LessonList({ modules, lessons }: LessonListProps) {
    // Group lessons by module
    const lessonsWithoutModule = lessons.filter(l => !l.module_id)
    const lessonsByModule = lessons.reduce((acc, lesson) => {
        if (lesson.module_id) {
            if (!acc[lesson.module_id]) {
                acc[lesson.module_id] = []
            }
            acc[lesson.module_id].push(lesson)
        }
        return acc
    }, {} as Record<string, Lesson[]>)

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} phút`
    }

    const renderLesson = (lesson: Lesson, index: number) => {
        const isCompleted = lesson.progress?.status === 'completed'
        const isStarted = lesson.progress?.status === 'started'

        return (
            <Link href={`/learn/${lesson.id}`} key={lesson.id}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${isCompleted
                        ? 'bg-green-50 border-2 border-green-200'
                        : isStarted
                            ? 'bg-indigo-50 border-2 border-indigo-200'
                            : 'bg-white border-2 border-slate-200 hover:border-indigo-300'
                        }`}
                >
                    {/* Status Icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                        ? 'bg-green-500'
                        : isStarted
                            ? 'bg-indigo-500'
                            : 'bg-slate-200 group-hover:bg-indigo-200'
                        }`}>
                        {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : isStarted ? (
                            <Play className="w-5 h-5 text-white fill-white" />
                        ) : (
                            <Circle className="w-5 h-5 text-slate-500 group-hover:text-indigo-500" />
                        )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {lesson.title}
                        </h4>
                        {lesson.duration && (
                            <p className="text-sm text-slate-500 font-medium">
                                {formatDuration(lesson.duration)}
                            </p>
                        )}
                    </div>

                    {/* Play Button */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-green-100'
                        : 'bg-indigo-100 group-hover:bg-indigo-200 group-hover:scale-110'
                        }`}>
                        <Play className={`w-4 h-4 ${isCompleted ? 'text-green-600' : 'text-indigo-600'} fill-current`} />
                    </div>
                </motion.div>
            </Link>
        )
    }

    return (
        <div className="space-y-6">
            {/* Modules with their lessons */}
            {modules && modules.map((module) => {
                const moduleLessons = lessonsByModule[module.id] || []
                if (moduleLessons.length === 0) return null

                return (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-lg shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50"
                    >
                        <h3 className="text-2xl font-adaptive-display font-bold text-slate-900 mb-2">
                            {module.title}
                        </h3>
                        {module.description && (
                            <p className="text-slate-600 font-medium mb-6">
                                {module.description}
                            </p>
                        )}
                        <div className="space-y-3">
                            {moduleLessons.map((lesson, index) => renderLesson(lesson, index))}
                        </div>
                    </motion.div>
                )
            })}

            {/* Lessons without module */}
            {lessonsWithoutModule.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-lg shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50"
                >
                    <h3 className="text-2xl font-adaptive-display font-bold text-slate-900 mb-6">
                        Danh sách bài học
                    </h3>
                    <div className="space-y-3">
                        {lessonsWithoutModule.map((lesson, index) => renderLesson(lesson, index))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
