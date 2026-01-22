"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Lesson {
    id: string;
    title: string;
    duration: number;
    isCompleted: boolean;
}

interface ConceptModalProps {
    isOpen: boolean;
    onClose: () => void;
    node: {
        id: string;
        title: string;
        description?: string;
        status: string;
    } | null;
    lessons: Lesson[];
    gradeLevel: string;
}

export default function ConceptModal({ isOpen, onClose, node, lessons, gradeLevel }: ConceptModalProps) {
    if (!node) return null;

    const isPrimary = gradeLevel.startsWith("primary");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
                    >
                        <div className={cn(
                            "pointer-events-auto w-full max-w-2xl overflow-hidden relative",
                            isPrimary
                                ? "bg-white rounded-[40px] border-8 border-white shadow-2xl"
                                : "bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10"
                        )}>

                            {/* Header */}
                            <div className={cn(
                                "p-8 flex justify-between items-start",
                                isPrimary ? "bg-indigo-50" : "bg-white/5 border-b border-white/5"
                            )}>
                                <div>
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3",
                                        node.status === 'mastered' ? "bg-green-100 text-green-700" :
                                            node.status === 'exploring' ? "bg-amber-100 text-amber-700" :
                                                "bg-slate-100 text-slate-500"
                                    )}>
                                        {node.status}
                                    </div>
                                    <h2 className={cn(
                                        "text-3xl font-bold font-adaptive-display",
                                        isPrimary ? "text-indigo-900" : "text-white"
                                    )}>
                                        {node.title}
                                    </h2>
                                    <p className={cn(
                                        "mt-2 font-medium",
                                        isPrimary ? "text-indigo-600/80" : "text-slate-400"
                                    )}>
                                        {node.description}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isPrimary ? "bg-white text-indigo-400 hover:bg-indigo-100" : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                                    )}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <h3 className={cn(
                                    "text-sm font-bold uppercase tracking-widest mb-4",
                                    isPrimary ? "text-indigo-400" : "text-slate-500"
                                )}>
                                    Bài học trong chủ đề này
                                </h3>

                                <div className="space-y-3">
                                    {lessons.map((lesson, i) => (
                                        <Link
                                            key={lesson.id}
                                            href={`/learn/${lesson.id}`}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-2xl transition-all group",
                                                isPrimary
                                                    ? "bg-indigo-50 hover:bg-indigo-100 border-2 border-transparent hover:border-indigo-200"
                                                    : "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                                lesson.isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : isPrimary ? "bg-white text-indigo-500" : "bg-white/10 text-white"
                                            )}>
                                                {lesson.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Play className="w-5 h-5 ml-1" />}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className={cn(
                                                    "font-bold text-lg",
                                                    isPrimary ? "text-indigo-900" : "text-slate-200 group-hover:text-white"
                                                )}>
                                                    {lesson.title}
                                                </h4>
                                                <p className={cn(
                                                    "text-sm font-medium",
                                                    isPrimary ? "text-indigo-400" : "text-slate-500"
                                                )}>
                                                    {Math.floor(lesson.duration / 60)} phút • Bài {i + 1}
                                                </p>
                                            </div>

                                            {node.status === 'unseen' && (
                                                <Lock className="w-5 h-5 text-slate-400" />
                                            )}
                                        </Link>
                                    ))}

                                    {lessons.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 italic">
                                            Chưa có bài học nào được cập nhật cho chủ đề này.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className={cn(
                                "p-6 border-t",
                                isPrimary ? "bg-white border-indigo-50" : "bg-slate-900 border-white/5"
                            )}>
                                <button className={cn(
                                    "w-full py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                    isPrimary
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                                )}>
                                    Bắt đầu học ngay
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
