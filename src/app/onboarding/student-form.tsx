'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completeOnboarding } from './actions'
import { ArrowRight, BookOpen, GraduationCap, AlertCircle, Loader2 } from 'lucide-react'

// Grade levels
const GRADES = ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"]

export default function StudentForm({ role }: { role: string }) {
    const [selectedGrade, setSelectedGrade] = useState("")
    const [state, action, isPending] = useActionState(completeOnboarding, null)

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <form action={action} className="space-y-6">
                <input type="hidden" name="role" value={role} />
                <input type="hidden" name="gradeLevel" value={selectedGrade} />

                {/* Error Display */}
                {state?.error && (
                    <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-600">
                            {state.error}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-lg font-bold text-slate-700">Tên của bạn là gì?</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        required
                        disabled={isPending}
                        className="h-14 rounded-2xl bg-white border-2 border-slate-200 focus:border-indigo-500 text-lg px-4"
                    />
                </div>

                {role === 'student' && (
                    <div className="space-y-3">
                        <Label className="text-lg font-bold text-slate-700">Bạn học lớp mấy?</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {GRADES.map((grade) => (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => setSelectedGrade(grade)}
                                    disabled={isPending}
                                    className={`p-3 rounded-xl border-2 font-bold transition-all disabled:opacity-50 ${selectedGrade === grade
                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 transform scale-105'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {role === 'parent' && (
                    <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 text-blue-700 text-sm">
                        👋 Chào Phụ huynh! Chúng tôi sẽ giúp bạn kết nối với tài khoản của con sau khi hoàn tất thiết lập.
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 mt-8"
                    disabled={(role === 'student' && !selectedGrade) || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            Hoàn tất <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </motion.div >
    )
}
