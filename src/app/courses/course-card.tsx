'use client'

import { motion } from 'framer-motion'
import { Play, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { CourseWithProgress } from './actions'

interface CourseCardProps {
    course: CourseWithProgress
    index: number
}

const subjectColors = {
    math: 'bg-blue-500',
    science: 'bg-green-500',
    english: 'bg-yellow-500',
    vietnamese: 'bg-purple-500',
    history: 'bg-orange-500',
    geography: 'bg-teal-500',
}

const subjectLabels = {
    math: 'Toán học',
    science: 'Khoa học',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    history: 'Lịch sử',
    geography: 'Địa lý',
}

export function CourseCard({ course, index }: CourseCardProps) {
    const hasProgress = course.progress !== undefined && course.progress > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer"
        >
            <Link href={`/courses/${course.id}`}>
                <div className="bg-white rounded-[2rem] shadow-lg shadow-blue-500/10 overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border-4 border-white ring-4 ring-blue-50">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                        {course.thumbnail_url ? (
                            <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-16 h-16 text-indigo-300" />
                            </div>
                        )}

                        {/* Play Overlay */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl">
                                <Play className="w-8 h-8 text-indigo-600 fill-indigo-600 ml-1" />
                            </div>
                        </motion.div>

                        {/* Subject Badge */}
                        <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg ${subjectColors[course.subject as keyof typeof subjectColors] || 'bg-gray-500'}`}>
                                {subjectLabels[course.subject as keyof typeof subjectLabels] || course.subject}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-xl font-adaptive-display font-bold text-slate-900 mb-2 line-clamp-2">
                            {course.title}
                        </h3>
                        <p className="text-slate-600 text-sm font-medium font-sans line-clamp-2 mb-4">
                            {course.description || 'Khám phá kiến thức mới với khóa học này!'}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                            {course.total_lessons && (
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-bold">{course.total_lessons} bài học</span>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {hasProgress && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-600">Tiến độ</span>
                                    <span className="text-xs font-bold text-indigo-600">{Math.round(course.progress!)}%</span>
                                </div>
                                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.progress}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        )}

                        {!hasProgress && (
                            <div className="mt-4 text-center">
                                <span className="text-xs font-bold text-indigo-600">Bắt đầu học ngay! →</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
