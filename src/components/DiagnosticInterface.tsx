"use client";

import React, { useState } from "react";
import {
    ClipboardCheck,
    HelpCircle,
    ArrowRight,
    Target,
    Clock,
    Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DiagnosticInterface() {
    const [started, setStarted] = useState(false);

    return (
        <div className="min-h-[600px] flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
                {!started ? (
                    <motion.div
                        key="start"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-xl w-full bg-white p-8 border border-slate-200 shadow-soft text-center space-y-8 rounded-[32px]"
                    >
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <ClipboardCheck className="w-10 h-10" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-adaptive-display text-slate-900">Bài Kiểm tra Chẩn đoán</h2>
                            <p className="text-slate-500 font-medium">
                                Hãy cùng xem bạn đã biết những gì! Đây không phải một bài thi—nó giúp chúng tôi xây dựng <strong>Bản đồ Kiến thức</strong> duy nhất cho riêng bạn.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: <Target className="w-4 h-4" />, label: "Cá nhân hóa" },
                                { icon: <Clock className="w-4 h-4" />, label: "15-20 phút" },
                                { icon: <Heart className="w-4 h-4" />, label: "Thích ứng" },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
                                    <div className="text-slate-400">{feature.icon}</div>
                                    <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider font-sans">{feature.label}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            className="w-full py-4 px-8 bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 group transition-all hover:bg-blue-700 shadow-xl shadow-blue-100 cursor-pointer rounded-full"
                        >
                            Bắt đầu Chẩn đoán <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl w-full bg-white p-10 border border-slate-200 shadow-soft space-y-10 rounded-[32px]"
                    >
                        {/* Progress Header */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Toán học • Bài chẩn đoán</span>
                            <span>Câu hỏi 4 / 15</span>
                        </div>

                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[26%]" />
                        </div>

                        {/* Question */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full">
                                <HelpCircle className="w-4 h-4" /> Thử thách
                            </div>
                            <h3 className="text-2xl font-adaptive-display text-slate-900 leading-tight">
                                Sarah có 145 miếng nhãn dán. Cô ấy cho em trai 27 miếng và cho bạn 38 miếng. Hỏi Sarah còn lại bao nhiêu miếng nhãn dán?
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["70 miếng", "80 miếng", "85 miếng", "90 miếng"].map((option, i) => (
                                <button
                                    key={i}
                                    className="p-6 text-left border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group font-bold text-slate-700 flex items-center justify-between cursor-pointer rounded-[24px]"
                                >
                                    {option}
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 flex justify-between">
                            <button className="text-slate-400 font-bold text-sm hover:text-slate-600 cursor-pointer">Bỏ qua câu này</button>
                            <button className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">Bạn cần gợi ý?</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
