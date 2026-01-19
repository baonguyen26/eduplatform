"use client";

import React from "react";
import {
    Heart,
    Target,
    Clock,
    MessageSquare,
    Activity,
    Award,
    BookOpen
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ParentView() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-indigo-900 text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-adaptive-display">Chào buổi sáng, Phụ huynh!</h2>
                    <p className="text-indigo-100 max-w-md">
                        Lê đang có những tiến bộ tuyệt vời môn Hình học hôm nay. Bạn ấy đã dành 25 phút khám phá chủ đề "Góc trên đường thẳng".
                    </p>
                    <div className="flex gap-4 pt-2">
                        <button className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm shadow-xl hover:bg-slate-100 cursor-pointer">
                            Gửi lời khích lệ
                        </button>
                        <button className="px-6 py-2 bg-indigo-800 text-white rounded-full font-bold text-sm hover:bg-indigo-700 cursor-pointer">
                            Xem Chương trình học
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weekly Activity */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" /> Tiến độ Làm chủ
                        </h3>
                        <select className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-transparent border-none focus:outline-none">
                            <option>7 ngày qua</option>
                            <option>30 ngày qua</option>
                        </select>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-4 px-2">
                        {[40, 65, 30, 85, 90, 45, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-indigo-100 rounded-t-lg relative group transition-all"
                                    style={{ height: `${h}%` }}
                                >
                                    <div
                                        className="absolute inset-0 bg-indigo-600 rounded-t-lg transition-all"
                                        style={{ height: `${h * 0.7}%` }} // Mastered portion
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Làm chủ {h}%
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400">"T2-T3-T4-T5-T6-T7-CN".split("-")[i]</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Insights */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Thành tích nổi bật</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Vua Chăm chỉ</p>
                                <p className="text-xs text-slate-500">5 ngày liên tiếp môn Toán</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Góc Khám phá</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    Leo đã nắm vững <strong>Phép nhân</strong> nhanh hơn 20% so với trung bình!
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0" />
                                <p className="text-sm text-slate-600 font-medium">
                                    Đang gặp chút khó khăn với <strong>Phân số phức hợp</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Lessons */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Bài học gần đây</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {[
                        { title: "Góc trên đường thẳng", subject: "Toán", duration: "25 phút", state: "Đã nắm vững" },
                        { title: "Ẩn dụ trong Thơ ca", subject: "Ngữ văn", duration: "18 phút", state: "Đang khám phá" },
                        { title: "Phép chia dài có dư", subject: "Toán", duration: "42 phút", state: "Đang luyện tập" },
                    ].map((lesson, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    lesson.subject === "Toán" ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
                                )}>
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{lesson.title}</p>
                                    <p className="text-xs text-slate-500">{lesson.subject} • học {lesson.duration}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                                lesson.state === "Đã nắm vững" ? "bg-emerald-50 text-emerald-600" :
                                    lesson.state === "Đang luyện tập" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                            )}>
                                {lesson.state}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
