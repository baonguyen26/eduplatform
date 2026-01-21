"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Star,
    Lock,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type MasteryState = "unseen" | "exploring" | "practicing" | "mastered";

interface KnowledgePoint {
    id: string;
    title: string;
    state: MasteryState;
    prerequisites?: string[];
    position?: { x: number; y: number };
}

const masteryColors: Record<MasteryState, string> = {
    unseen: "bg-slate-200 text-slate-400 border-slate-300",
    exploring: "bg-amber-400 text-white border-amber-500 shadow-amber-100",
    practicing: "bg-blue-500 text-white border-blue-600 shadow-blue-100",
    mastered: "bg-emerald-600 text-white border-emerald-700 shadow-emerald-100",
};

const stateLabels: Record<MasteryState, string> = {
    unseen: "Chưa học",
    exploring: "Đang khám phá",
    practicing: "Đang luyện tập",
    mastered: "Đã nắm vững"
};

export default function KnowledgeMap({
    points = [],
}: {
    points?: KnowledgePoint[];
}) {

    return (
        <div className="p-8 bg-brand-bg min-h-screen">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Map Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-adaptive-display text-slate-900 tracking-tight">
                            Bản đồ Kiến thức: Toán học
                        </h2>
                        <p className="text-slate-500 max-w-lg">
                            Đi theo lộ trình để làm chủ các khái niệm nền tảng. Mỗi điểm dừng là một bước tiến mới trên hành trình chinh phục tri thức!
                        </p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        {(["unseen", "exploring", "practicing", "mastered"] as MasteryState[]).map((state) => (
                            <div key={state} className="flex items-center gap-1.5 px-3 py-1.5">
                                <div className={cn("w-3 h-3 rounded-full", masteryColors[state].split(" ")[0])} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stateLabels[state]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unified Card View (Previously Primary) */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-12">
                        {/* Visual connector line background for larger screens */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-200 -z-10 translate-y-[-50%] hidden lg:block opacity-50 rounded-full" />

                        {points.map((point, index) => (
                            <motion.div
                                key={point.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex flex-col items-center group"
                            >
                                <div className={cn(
                                    "w-32 h-32 rounded-[32px] border-4 flex items-center justify-center transition-all duration-300 relative z-10",
                                    masteryColors[point.state],
                                    point.state === "unseen" ? "opacity-50" : "scale-105 shadow-xl hover:scale-110 cursor-pointer"
                                )}>
                                    {point.state === "mastered" ? (
                                        <CheckCircle2 className="w-16 h-16" />
                                    ) : point.state === "unseen" ? (
                                        <Lock className="w-12 h-12" />
                                    ) : (
                                        <Star className="w-16 h-16 animate-pulse" />
                                    )}

                                    {/* Step Number */}
                                    <div className="absolute -top-4 -right-4 bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="mt-6 text-center space-y-1">
                                    <h3 className="text-xl font-adaptive-display text-slate-800">{point.title}</h3>
                                    <button className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                                        Bắt đầu Khám phá →
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Legend / Stats Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Kiến thức Đã vững", value: points.filter(p => p.state === "mastered").length, color: "text-emerald-600" },
                        { label: "Đang tích cực học", value: points.filter(p => p.state === "exploring" || p.state === "practicing").length, color: "text-blue-600" },
                        { label: "Tổng số Điểm kiến thức", value: points.length, color: "text-slate-600" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                            <span className={cn("text-4xl font-adaptive-display mt-1", stat.color)}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
