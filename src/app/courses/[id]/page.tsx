'use client'

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { getCourseById, getCourseLessons } from '../actions'
import type { Course } from '../actions'
import { LessonList } from './lesson-list'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [course, setCourse] = useState<Course | null>(null)
    const [modules, setModules] = useState<any[] | null>(null)
    const [lessons, setLessons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getCourseById(id),
            getCourseLessons(id)
        ]).then(([courseData, lessonsData]) => {
            if (!courseData) {
                notFound()
            }
            setCourse(courseData)
            setModules(lessonsData.modules)
            setLessons(lessonsData.lessons || [])
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!course) {
        notFound()
    }

    const totalLessons = lessons?.length || 0
    const completedLessons = lessons?.filter(l => l.progress?.status === 'completed').length || 0
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Decorative Soft Cloud Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/40 via-indigo-50/20 to-transparent" />
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="relative z-10">
                {/* Back Button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại khóa học
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
                                <BookOpen className="w-5 h-5 text-indigo-500" />
                                <span className="font-bold text-slate-700 text-sm">
                                    {totalLessons} bài học
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-adaptive-display font-extrabold text-slate-900 leading-tight mb-6">
                                {course.title}
                            </h1>

                            <p className="text-xl text-slate-600 font-medium font-sans leading-relaxed mb-8">
                                {course.description}
                            </p>

                            {/* Progress Section */}
                            {progressPercentage > 0 && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-slate-700">Tiến độ của bạn</span>
                                        <span className="text-2xl font-bold text-indigo-600">{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium mt-3">
                                        {completedLessons} / {totalLessons} bài học đã hoàn thành
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 bg-white rounded-[2rem] shadow-2xl shadow-blue-500/20 overflow-hidden border-4 border-white ring-4 ring-blue-50">
                                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-20 h-20 text-indigo-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Continue/Start Button */}
                                <div className="p-6">
                                    <Link
                                        href={`/learn/${lessons?.[0]?.id || ''}`}
                                        className="block w-full"
                                    >
                                        <button className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all">
                                            {progressPercentage > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div>
                        <h2 className="text-3xl font-adaptive-display font-bold text-slate-900 mb-6">
                            Nội dung khóa học
                        </h2>
                        <LessonList modules={modules} lessons={lessons || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
