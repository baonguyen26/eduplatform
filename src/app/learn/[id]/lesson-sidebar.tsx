'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Play } from 'lucide-react'
import Link from 'next/link'
import type { LessonWithProgress } from '../actions'

interface LessonSidebarProps {
    lessons: LessonWithProgress[]
    currentLessonId: string
}

export function LessonSidebar({ lessons, currentLessonId }: LessonSidebarProps) {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-2">
            <div className="p-6">
                <h3 className="text-xl font-adaptive-display font-bold text-slate-900 mb-4">
                    Danh sách bài học
                </h3>

                <div className="space-y-2">
                    {lessons.map((lesson, index) => {
                        const isActive = lesson.id === currentLessonId
                        const isCompleted = lesson.progress?.status === 'completed'

                        return (
                            <Link href={`/learn/${lesson.id}`} key={lesson.id}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`
                                        group p-4 rounded-2xl transition-all cursor-pointer mb-3 mx-2
                                        shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff]
                                        ${isActive
                                            ? 'bg-indigo-50 border border-white/50 translate-x-1'
                                            : isCompleted
                                                ? 'bg-green-50 border border-white/50'
                                                : 'bg-white border border-white/50 hover:-translate-y-1 hover:shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Status Icon */}
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                            ? 'bg-green-500'
                                            : isActive
                                                ? 'bg-indigo-500'
                                                : 'bg-slate-300 group-hover:bg-indigo-200'
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            ) : isActive ? (
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-slate-500 group-hover:text-indigo-500" />
                                            )}
                                        </div>

                                        {/* Lesson Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isActive
                                                ? 'text-indigo-700'
                                                : isCompleted
                                                    ? 'text-green-700'
                                                    : 'text-slate-700 group-hover:text-indigo-600'
                                                }`}>
                                                {lesson.title}
                                            </p>
                                            {lesson.duration && (
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {Math.floor(lesson.duration / 60)} phút
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
