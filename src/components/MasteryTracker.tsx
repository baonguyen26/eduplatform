"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SubjectMastery {
    subject: string;
    totalPoints: number;
    mastered: number;
    practicing: number;
    exploring: number;
}

const subjects: SubjectMastery[] = [
    { subject: "Toán học", totalPoints: 120, mastered: 45, practicing: 30, exploring: 15 },
    { subject: "Ngữ văn", totalPoints: 85, mastered: 60, practicing: 10, exploring: 5 },
];

export default function MasteryTracker({
    level = "primary"
}: {
    level?: "primary" | "secondary"
}) {
    const isPrimary = level === "primary";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-adaptive-display text-slate-900">Tiến độ Làm chủ Kiến thức</h2>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cập nhật 2 giờ trước</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((s) => {
                    const totalCovered = s.mastered + s.practicing + s.exploring;
                    const percentMastered = (s.mastered / s.totalPoints) * 100;
                    const percentPracticing = (s.practicing / s.totalPoints) * 100;
                    const percentExploring = (s.exploring / s.totalPoints) * 100;

                    return (
                        <div
                            key={s.subject}
                            className={cn(
                                "bg-white p-6 border border-slate-200 shadow-sm",
                                isPrimary ? "rounded-primary" : "rounded-secondary"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{s.subject}</h3>
                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                        Đã khám phá {totalCovered} / {s.totalPoints} khái niệm
                                    </p>
                                </div>
                                <div className="text-2xl font-adaptive-display text-emerald-600">
                                    {Math.round(percentMastered)}%
                                </div>
                            </div>

                            {/* Multi-state Progress Bar */}
                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentMastered}%` }}
                                    className="h-full bg-emerald-500"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentPracticing}%` }}
                                    className="h-full bg-blue-500"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentExploring}%` }}
                                    className="h-full bg-amber-400"
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {[
                                    { label: "Đã nắm vững", count: s.mastered, color: "bg-emerald-500" },
                                    { label: "Đang luyện tập", count: s.practicing, color: "bg-blue-500" },
                                    { label: "Đang khám phá", count: s.exploring, color: "bg-amber-400" },
                                ].map((item) => (
                                    <div key={item.label} className="flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className={cn("w-2 h-2 rounded-full", item.color)} />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{item.count} điểm</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
