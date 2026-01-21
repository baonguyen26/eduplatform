'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Users, Sparkles } from 'lucide-react'
import StudentForm from './student-form'

export default function OnboardingPage() {
    const [step, setStep] = useState<'role' | 'details'>('role')
    const [role, setRole] = useState<'student' | 'parent' | null>(null)

    const handleRoleSelect = (selectedRole: 'student' | 'parent') => {
        setRole(selectedRole)
        setStep('details')
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="max-w-4xl w-full relative z-10 text-center">
                <AnimatePresence mode="wait">
                    {step === 'role' ? (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-bold text-slate-600">Bước 1/2</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-adaptive-display font-extrabold text-slate-900">
                                    Bạn tham gia với vai trò gì?
                                </h1>
                                <p className="text-xl text-slate-500 font-medium">Chọn vai trò để chúng tôi tối ưu trải nghiệm cho bạn.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <button
                                    onClick={() => handleRoleSelect('student')}
                                    className="group relative bg-white hover:bg-blue-50 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-4 border-transparent hover:border-blue-400 transition-all duration-300 text-left hover:-translate-y-2"
                                >
                                    <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <GraduationCap className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Học sinh</h3>
                                    <p className="text-slate-500 font-medium">Tôi muốn học tập, luyện thi và chinh phục kiến thức.</p>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('parent')}
                                    className="group relative bg-white hover:bg-emerald-50 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-4 border-transparent hover:border-emerald-400 transition-all duration-300 text-left hover:-translate-y-2"
                                >
                                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Users className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Phụ huynh</h3>
                                    <p className="text-slate-500 font-medium">Tôi muốn theo dõi tiến độ và hỗ trợ con em mình.</p>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg text-3xl">
                                    {role === 'student' ? '🎓' : '👨‍👩‍👧‍👦'}
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">
                                    {role === 'student' ? 'Hồ sơ học sinh' : 'Thông tin phụ huynh'}
                                </h2>
                                <p className="text-slate-500 mt-2">Chỉ còn một bước nữa thôi!</p>
                            </div>

                            {role && <StudentForm role={role} />}

                            <button
                                onClick={() => setStep('role')}
                                className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600"
                            >
                                ← Quay lại chọn vai trò
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
