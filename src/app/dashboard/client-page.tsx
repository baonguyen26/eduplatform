"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    BarChart3,
    Map as MapIcon,
    BookOpen,
    Users,
    GraduationCap,
    Bell,
    Settings,
    Menu,
    X,
    UserCircle,
    Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Import core components
import KnowledgeMap from "@/components/KnowledgeMap";
import LessonTemplate from "@/components/LessonTemplate";
import MasteryTracker from "@/components/MasteryTracker";
import DiagnosticInterface from "@/components/DiagnosticInterface";
import TutorDashboard from "@/components/TutorDashboard";
import ParentView from "@/components/ParentView";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Role = "student" | "tutor" | "parent";
type Tab = "map" | "lesson" | "tracker" | "diagnostic" | "management";

export default function DashboardClient({ points = [], masteryData = [] }: { points: any[], masteryData?: any[] }) {
    const [role, setRole] = useState<Role>("student");
    const [activeTab, setActiveTab] = useState<Tab>("map");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Using props for points instead of hardcoded data

    const navigation = [
        { id: "map", label: "Bản đồ Kiến thức", icon: <MapIcon className="w-5 h-5" />, roles: ["student"] },
        { id: "tracker", label: "Tiến độ Làm chủ", icon: <BarChart3 className="w-5 h-5" />, roles: ["student", "parent"] },
        { id: "lesson", label: "Bài học hiện tại", icon: <BookOpen className="w-5 h-5" />, roles: ["student"] },
        { id: "diagnostic", label: "Chẩn đoán", icon: <Trophy className="w-5 h-5" />, roles: ["student"] },
        { id: "management", label: "Bảng điều khiển", icon: <GraduationCap className="w-5 h-5" />, roles: ["tutor", "parent"] },
    ];

    return (
        <div className="min-h-screen bg-brand-bg flex">
            {/* Sidebar */}
            <aside className={cn(
                "bg-white border-r border-slate-200 transition-all duration-300 z-50 fixed md:static inset-y-0 left-0",
                isSidebarOpen ? "w-64" : "w-20",
                !isSidebarOpen && "md:w-20",
                "hidden md:flex flex-col"
            )}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                        <Image
                            src="/assets/logo.png"
                            alt="EduPlatform Logo"
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </div>
                    {isSidebarOpen && <span className="font-adaptive-display text-xl font-bold tracking-tight text-slate-800">EduPlatform</span>}
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.filter(item => item.roles.includes(role)).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group cursor-pointer",
                                activeTab === item.id
                                    ? "bg-blue-50 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className={cn(
                                "transition-colors",
                                activeTab === item.id ? "text-blue-600" : "group-hover:text-blue-600"
                            )}>
                                {item.icon}
                            </div>
                            {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 mt-auto">
                    <button className="flex items-center gap-3 px-3 py-3 w-full text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
                        <Settings className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-semibold text-sm">Cài đặt</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg md:block hidden cursor-pointer"
                        >
                            <Menu className="w-5 h-5 text-slate-500" />
                        </button>
                        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                            {([["student", "Học sinh"], ["tutor", "Gia sư"], ["parent", "Phụ huynh"]] as [Role, string][]).map(([r, label]) => (
                                <button
                                    key={r}
                                    onClick={() => {
                                        setRole(r);
                                        if (r === "tutor" || r === "parent") setActiveTab("management");
                                        else setActiveTab("map");
                                    }}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                                        role === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-900">Bảo Nguyễn</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Học viên</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                                    <UserCircle className="w-full h-full text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Viewport */}
                <div className="flex-1 overflow-y-auto bg-brand-bg/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${role}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="p-8"
                        >
                            {activeTab === "map" && <KnowledgeMap points={points} />}
                            {activeTab === "lesson" && <LessonTemplate />}
                            {activeTab === "tracker" && <div className="max-w-5xl mx-auto"><MasteryTracker subjects={masteryData} /></div>}
                            {activeTab === "diagnostic" && <DiagnosticInterface />}
                            {activeTab === "management" && role === "tutor" && <div className="max-w-6xl mx-auto"><TutorDashboard /></div>}
                            {activeTab === "management" && role === "parent" && <ParentView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
