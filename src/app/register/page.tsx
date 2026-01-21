'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signup } from '../login/actions'
import { ArrowRight, Sparkles, Rocket, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(signup, null)

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F0F9FF] overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
                />
            </div>

            {/* Left Column: Hero (Values/Join) */}
            <div className="relative z-10 w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg shadow-blue-500/10 mb-6 transform hover:scale-105 transition-transform cursor-default">
                        <Rocket className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                        <span className="font-bold text-slate-700 font-sans text-sm">Bắt đầu hành trình!</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-adaptive-display font-extrabold text-slate-900 leading-[1.1] mb-6"
                >
                    Unlock Your <br />
                    <span className="text-indigo-500">Superpowers.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg lg:text-xl text-slate-600 font-medium font-sans max-w-lg mb-10 leading-relaxed"
                >
                    Tham gia cộng đồng học tập thông minh. Theo dõi tiến độ, nhận huy chương và làm chủ kiến thức ngay hôm nay.
                </motion.p>
            </div>

            {/* Right Column: Register Card */}
            <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md bg-white p-8 lg:p-10 rounded-[2rem] shadow-2xl shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {state?.success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ring-4 ring-green-50"
                                >
                                    <Mail className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <h2 className="text-3xl font-adaptive-display font-bold text-slate-900 mb-4">Kiểm tra hộp thư!</h2>
                                <p className="text-slate-600 font-medium font-sans mb-8 leading-relaxed px-4">
                                    Chúng tôi đã gửi một liên kết "phép thuật" tới <span className="font-bold text-indigo-600">{state.email}</span>. <br />
                                    Bấm vào đó để <span className="font-bold text-green-600">tự động đăng nhập</span> vào hệ thống.
                                </p>

                                <div className="space-y-4">
                                    <button onClick={() => window.location.reload()} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                        Không nhận được? Gửi lại
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 transform rotate-3">
                                        <span className="text-3xl">🚀</span>
                                    </div>
                                    <h2 className="text-3xl font-adaptive-display font-bold text-slate-900">Tạo tài khoản</h2>
                                    <p className="text-slate-500 font-medium mt-2 font-sans">Hoàn toàn miễn phí & bắt đầu ngay.</p>
                                </div>

                                <form className="space-y-5">
                                    {state?.success && (
                                        <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-100 flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-green-600">
                                                {state.message}
                                            </p>
                                        </div>
                                    )}

                                    {state?.message && !state?.success && (
                                        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-red-600">
                                                {state.message}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2 text-left">
                                        <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email của bạn</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            disabled={isPending}
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 px-4 text-lg transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <Label htmlFor="password" className="font-bold text-slate-700">Mật khẩu</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            disabled={isPending}
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 px-4 text-lg transition-all"
                                        />
                                    </div>

                                    <Button
                                        formAction={action}
                                        disabled={isPending}
                                        className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Vui lòng chờ...
                                            </>
                                        ) : (
                                            <>
                                                Đăng ký ngay <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-100" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Đã có tài khoản?</span>
                                        </div>
                                    </div>

                                    <Link href="/login" className="block w-full">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={isPending}
                                            className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
