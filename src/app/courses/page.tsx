'use client'

import { getCourses } from './actions'
import { CourseCard } from './course-card'
import { useEffect, useState } from 'react'
import type { CourseWithProgress } from './actions'

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseWithProgress[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCourses().then((data) => {
            setCourses(data)
            setLoading(false)
        })
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Decorative Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute top-[20%] left-[-5%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
                <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl lg:text-6xl font-adaptive-display font-extrabold text-slate-900 mb-4">
                        Khám phá <span className="text-indigo-500">Khóa học</span>
                    </h1>
                    <p className="text-xl text-slate-600 font-medium font-sans max-w-2xl">
                        Hành trình học tập của bạn bắt đầu từ đây. Chọn khóa học và bắt đầu ngay hôm nay!
                    </p>
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
                            <span className="text-4xl">📚</span>
                        </div>
                        <h3 className="text-2xl font-adaptive-display font-bold text-slate-900 mb-2">
                            Chưa có khóa học nào
                        </h3>
                        <p className="text-slate-600 font-medium">
                            Các khóa học sẽ sớm được cập nhật!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
