"use client";

import React, { useState } from "react";
import {
    BookOpen,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Step {
    id: "concept" | "examples" | "mistakes" | "check";
    title: string;
    icon: React.ReactNode;
}

const steps: Step[] = [
    { id: "concept", title: "Khái niệm", icon: <BookOpen className="w-5 h-5" /> },
    { id: "examples", title: "Ví dụ", icon: <Lightbulb className="w-5 h-5" /> },
    { id: "mistakes", title: "Lỗi thường gặp", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "check", title: "Kiểm tra nhanh", icon: <CheckCircle2 className="w-5 h-5" /> },
];

export default function LessonTemplate({
    subject = "math",
    title = "Phép cộng có nhớ",
    content
}: {
    subject?: "math" | "language";
    title?: string;
    content?: {
        concept: React.ReactNode;
        examples: React.ReactNode;
        mistakes: React.ReactNode;
        check: React.ReactNode;
    }
}) {
    const [activeStep, setActiveStep] = useState<Step["id"]>("concept");

    const currentStepIndex = steps.findIndex(s => s.id === activeStep);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <span className={cn(
                    "text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit",
                    subject === "math" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                )}>
                    {subject === "math" ? "Toán học" : "Ngữ văn"} • Bài học cốt lõi
                </span>
                <h1 className="text-3xl md:text-4xl font-adaptive-display text-slate-900">
                    {title}
                </h1>
            </div>

            {/* Mastery Stepper */}
            <div className="flex items-center justify-between relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                {steps.map((step, index) => {
                    const isActive = step.id === activeStep;
                    const isCompleted = steps.findIndex(s => s.id === activeStep) > index;

                    return (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            className={cn(
                                "flex flex-col items-center space-y-2 group transition-all duration-300",
                                "cursor-pointer"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                "border-2",
                                isActive ? "bg-white border-blue-500 text-blue-500 scale-110 shadow-lg" :
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                        "bg-slate-100 border-slate-200 text-slate-400 group-hover:border-slate-300"
                            )}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                            </div>
                            <span className={cn(
                                "hidden md:block text-[10px] font-bold uppercase tracking-tighter",
                                isActive ? "text-blue-600" : "text-slate-500"
                            )}>
                                {step.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-white p-8 border border-slate-200 min-h-[400px] transition-all duration-500 rounded-[32px] shadow-soft">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeStep === "concept" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-adaptive-display flex items-center gap-2">
                                    <BookOpen className="text-blue-500" /> Giải thích Khái niệm
                                </h2>
                                <div className="prose prose-slate max-w-none">
                                    {content?.concept || (
                                        <>
                                            <p className="text-lg text-slate-600 leading-relaxed">
                                                Trong bài học này, chúng ta sẽ khám phá nền tảng cốt lõi của <strong>{title}</strong>.
                                                Làm chủ kiến thức bắt đầu bằng việc hiểu rõ "tại sao" trước khi học "làm thế nào".
                                            </p>
                                            <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg italic text-slate-500">
                                                "Mục tiêu không chỉ là tìm ra đáp án đúng, mà là thấu hiểu logic dẫn đến đáp án đó."
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeStep === "examples" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-adaptive-display flex items-center gap-2">
                                    <Lightbulb className="text-amber-500" /> Ví dụ từng bước
                                </h2>
                                <div className="grid gap-4">
                                    {content?.examples || (
                                        [1, 2].map(i => (
                                            <div key={i} className="p-6 border border-slate-100 rounded-xl bg-slate-50/50">
                                                <h3 className="font-bold text-slate-800 mb-2">Ví dụ {i}</h3>
                                                <p className="text-slate-600">Minh họa tương tác rõ ràng về cách áp dụng khái niệm vào thực tế.</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeStep === "mistakes" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-adaptive-display flex items-center gap-2">
                                    <AlertTriangle className="text-rose-500" /> Các sai lầm phổ biến
                                </h2>
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                                    {content?.mistakes || (
                                        <ul className="space-y-3 list-disc list-inside text-rose-900 font-medium">
                                            <li>Quên số nhớ khi thực hiện phép cộng hàng đơn vị lớn hơn 10.</li>
                                            <li>Đặt sai vị trí các chữ số theo hàng đơn vị, hàng chục.</li>
                                            <li>Nhầm lẫn giữa phép cộng có nhớ và phép nhân.</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeStep === "check" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-adaptive-display flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" /> Kiểm tra Hiểu biết nhanh
                                </h2>
                                <p className="text-slate-600 font-medium">Trả lời 3 câu hỏi sau để chuyển kiến thức này từ trạng thái <strong>Đang khám phá</strong> sang <strong>Đang luyện tập</strong>.</p>
                                <div className="space-y-4">
                                    {content?.check || (
                                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 italic">
                                            [Thành phần Câu hỏi Tương tác]
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={() => {
                        const prev = steps[currentStepIndex - 1];
                        if (prev) setActiveStep(prev.id);
                    }}
                    disabled={currentStepIndex === 0}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 font-bold transition-all cursor-pointer rounded-full",
                        currentStepIndex === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" /> Quay lại
                </button>

                <button
                    onClick={() => {
                        const next = steps[currentStepIndex + 1];
                        if (next) setActiveStep(next.id);
                    }}
                    className={cn(
                        "flex items-center gap-2 px-8 py-3 font-bold text-white transition-all shadow-md hover:shadow-lg cursor-pointer rounded-full",
                        subject === "math" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    )}
                >
                    {currentStepIndex === steps.length - 1 ? "Hoàn thành bài học" : "Tiếp tục"} <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
