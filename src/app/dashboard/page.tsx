'use client'

import { useEffect, useState } from 'react'
import { getRecentCourses, getUserStats } from './actions'
import { motion } from 'framer-motion'
import { BookOpen, Award, Clock, TrendingUp, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Course {
    id: string
    title: string
    thumbnail_url: string | null
    progress: number
    total_lessons: number
    completed_lessons: number
    last_lesson_id?: string
}

interface UserStats {
    completed_lessons: number
    courses_started: number
    total_study_time: number
}

export default function DashboardPage() {
    const [recentCourses, setRecentCourses] = useState<Course[]>([])
    const [stats, setStats] = useState<UserStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getRecentCourses(3),
            getUserStats()
        ]).then(([courses, userStats]) => {
            setRecentCourses(courses as any)
            setStats(userStats)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Decorative Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl lg:text-6xl font-adaptive-display font-extrabold text-slate-900 mb-4">
                        Chào mừng trở lại! 👋
                    </h1>
                    <p className="text-xl text-slate-600 font-medium font-sans">
                        Sẵn sàng tiếp tục hành trình học tập của bạn?
                    </p>
                </motion.div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] p-6 shadow-lg shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{stats.completed_lessons}</p>
                                    <p className="text-sm text-slate-600 font-medium">Bài học hoàn thành</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] p-6 shadow-lg shadow-green-500/10 border-4 border-white ring-4 ring-green-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="w-7 h-7 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{stats.courses_started}</p>
                                    <p className="text-sm text-slate-600 font-medium">Khóa học đang học</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] p-6 shadow-lg shadow-indigo-500/10 border-4 border-white ring-4 ring-indigo-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Clock className="w-7 h-7 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{stats.total_study_time}</p>
                                    <p className="text-sm text-slate-600 font-medium">Phút học tập</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Recent Courses */}
                {recentCourses.length > 0 ? (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-adaptive-display font-bold text-slate-900">
                                Tiếp tục học
                            </h2>
                            <Link href="/courses" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold">
                                Xem tất cả
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50 cursor-pointer"
                                >
                                    <Link href={`/learn/${course.last_lesson_id || ''}`}>
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100">
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
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-indigo-600 fill-indigo-600 ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                                                {course.title}
                                            </h3>

                                            {/* Progress */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-slate-600">Tiến độ</span>
                                                    <span className="text-xs font-bold text-indigo-600">{Math.round(course.progress)}%</span>
                                                </div>
                                                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mt-1">
                                                    {course.completed_lessons} / {course.total_lessons} bài học
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                                                <Play className="w-4 h-4 fill-current" />
                                                Tiếp tục học
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
                            <BookOpen className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-adaptive-display font-bold text-slate-900 mb-2">
                            Bắt đầu học ngay!
                        </h3>
                        <p className="text-slate-600 font-medium mb-6">
                            Khám phá các khóa học và bắt đầu hành trình học tập của bạn.
                        </p>
                        <Link href="/courses">
                            <button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all">
                                Khám phá khóa học
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
