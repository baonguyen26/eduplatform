"use client";

import React from "react";
import {
    Users,
    Search,
    TrendingUp,
    AlertCircle,
    BookOpen,
    CheckCircle2,
    MoreVertical,
    Filter
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const students = [
    { id: "1", name: "Alex Johnson", level: "Tiểu học", activeSubject: "Toán", status: "needs_intervention", mastery: 42 },
    { id: "2", name: "Maya Lin", level: "Trung học", activeSubject: "Ngữ văn", status: "steady", mastery: 78 },
    { id: "3", name: "Leo Chen", level: "Tiểu học", activeSubject: "Toán", status: "excelling", mastery: 91 },
    { id: "4", name: "Sophie Grey", level: "Trung học", activeSubject: "Toán", status: "steady", mastery: 55 },
];

const statusLabels: Record<string, string> = {
    needs_intervention: "Cần hỗ trợ",
    steady: "Ổn định",
    excelling: "Xuất sắc"
};

export default function TutorDashboard() {
    return (
        <div className="space-y-8 p-1">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Học sinh Đang học", value: "24", icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Làm chủ Trung bình", value: "68%", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Cần Hỗ trợ gấp", value: "3", icon: <AlertCircle className="w-5 h-5" />, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Bài học hôm nay", value: "12", icon: <BookOpen className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-adaptive-display text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={cn("p-3 rounded-lg", stat.bg, stat.color)}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Tổng quan Học sinh</h2>
                        <p className="text-sm text-slate-500">Giám sát tiến độ và xác định các điểm cần can thiệp.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Tìm học sinh..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <Filter className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Học sinh</th>
                                <th className="px-6 py-4">Cấp độ</th>
                                <th className="px-6 py-4">Môn học</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Làm chủ</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-semibold text-slate-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                                            student.level === "Tiểu học" ? "bg-purple-50 text-purple-600" : "bg-cyan-50 text-cyan-600"
                                        )}>
                                            {student.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{student.activeSubject}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                student.status === "needs_intervention" ? "bg-rose-500 animate-pulse" :
                                                    student.status === "steady" ? "bg-blue-500" : "bg-emerald-500"
                                            )} />
                                            <span className="text-sm font-medium text-slate-700">
                                                {statusLabels[student.status]}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        student.mastery > 80 ? "bg-emerald-500" :
                                                            student.mastery > 50 ? "bg-blue-500" : "bg-amber-400"
                                                    )}
                                                    style={{ width: `${student.mastery}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{student.mastery}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 text-center">
                    <button className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">Xem tất cả học sinh</button>
                </div>
            </div>
        </div>
    );
}
