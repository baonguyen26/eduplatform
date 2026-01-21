'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, signup } from './actions'
import { ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
    const [loginState, loginAction, isLoginPending] = useActionState(login, null)

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

            {/* Left Column: Welcome & Hero */}
            <div className="relative z-10 w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg shadow-blue-500/10 mb-6 transform hover:scale-105 transition-transform cursor-default">
                        <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-slate-700 font-sans text-sm">Học tập thật vui!</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-adaptive-display font-extrabold text-slate-900 leading-[1.1] mb-6"
                >
                    Khám phá <br />
                    <span className="text-blue-500">Tiềm năng</span> <br />
                    của bạn.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg lg:text-xl text-slate-600 font-medium font-sans max-w-lg mb-10 leading-relaxed"
                >
                    Mỗi ngày một chút tiến bộ. Thu thập kiến thức, mở khóa kỹ năng và trở thành phiên bản tốt hơn của chính mình.
                </motion.p>

                {/* Fun Stats Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-4"
                >
                    <div className="bg-white p-4 rounded-3xl shadow-lg shadow-indigo-500/5 border-2 border-indigo-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">
                            🚀
                        </div>
                        <div className="text-left">
                            <div className="font-adaptive-display font-bold text-slate-900 text-xl">Nhanh hơn</div>
                            <div className="text-slate-500 text-sm font-bold font-sans">3x Tốc độ</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-3xl shadow-lg shadow-emerald-500/5 border-2 border-emerald-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
                            🏆
                        </div>
                        <div className="text-left">
                            <div className="font-adaptive-display font-bold text-slate-900 text-xl">Thú vị</div>
                            <div className="text-slate-500 text-sm font-bold font-sans">Như chơi game</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Login Card */}
            <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md bg-white p-8 lg:p-10 rounded-[2rem] shadow-2xl shadow-blue-500/10 border-4 border-white ring-4 ring-blue-50"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 transform -rotate-3">
                            <span className="text-3xl">👋</span>
                        </div>
                        <h2 className="text-3xl font-adaptive-display font-bold text-slate-900">Chào bạn!</h2>
                        <p className="text-slate-500 font-medium mt-2 font-sans">Sẵn sàng cho bài học hôm nay chưa?</p>
                    </div>

                    <form className="space-y-5">

                        {/* Error Messages */}
                        {loginState?.message && (
                            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-bold text-red-600">
                                    {loginState.message}
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
                                disabled={isLoginPending}
                                className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 text-lg transition-all"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="font-bold text-slate-700">Mật khẩu bí mật</Label>
                                <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline">Quên rồi hả?</a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isLoginPending}
                                className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 text-lg transition-all"
                            />
                        </div>

                        <Button
                            formAction={loginAction}
                            disabled={isLoginPending}
                            className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/20 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {isLoginPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    Vào học ngay! <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Hoặc là</span>
                            </div>
                        </div>

                        <Link href="/register" className="block w-full">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                Tạo tài khoản mới
                            </Button>
                        </Link>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
