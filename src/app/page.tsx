"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Target,
  Network,
  ShieldCheck,
  Users,
  CheckCircle2,
  BookOpen,
  Heart
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Navbar from "@/components/landing/Navbar";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Đường dẫn hình ảnh đã cập nhật
const PRIMARY_HERO = "/assets/primary_hero.png";
const SECONDARY_HERO = "/assets/secondary_hero.png";

type Level = "primary" | "secondary";

export default function Home() {
  const [level, setLevel] = useState<Level>("primary");
  const isPrimary = level === "primary";

  return (
    <div
      data-level={level}
      className="bg-brand-bg min-h-screen text-slate-900 overflow-x-hidden"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="relative z-10 space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100 shadow-sm"
            >
              <Heart className="w-4 h-4" /> Làm Chủ Kiến Thức Thực Thụ
            </motion.div>

            <motion.h1
              layout
              className={cn(
                "text-5xl md:text-7xl font-adaptive-display tracking-tight leading-[1.1]",
                isPrimary ? "text-slate-900" : "text-slate-800"
              )}
            >
              {isPrimary ? (
                <>Làm chủ kiến thức <span className="text-blue-600">Căn bản</span>,<br />Từng bước khám phá.</>
              ) : (
                <>Nền tảng <span className="text-blue-600">Kiến thức</span>,<br />Kiến tạo sự ưu tú.</>
              )}
            </motion.h1>

            <motion.p
              layout
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {isPrimary
                ? "Không thi cử. Không xếp hạng. Chỉ có niềm vui thuần khiết khi hiểu rõ nền tảng kiến thức xây dựng tương lai. Dành cho Lớp 3–5."
                : "Sơ đồ kiến thức chuyên sâu cho Lớp 6–9. Xây dựng mô hình tư duy đa chiều cho các môn học phức tạp với lộ trình làm chủ kiến thức bài bản."
              }
            </motion.p>

            <motion.div
              layout
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4"
            >
              <Link
                href="/dashboard"
                className={cn(
                  "px-8 py-4 bg-blue-600 text-white font-bold text-lg flex items-center gap-2 shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all w-full sm:w-auto justify-center",
                  isPrimary ? "rounded-full" : "rounded-xl"
                )}
              >
                Bắt đầu hành trình <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-white text-slate-600 font-bold border border-slate-200 hover:bg-slate-50 transition-all w-full sm:w-auto justify-center rounded-inherit">
                Xem Triết lý giáo dục
              </button>
            </motion.div>

            {/* Level Toggle Showcase */}
            <div className="pt-12 space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-center lg:justify-start">
                Trải nghiệm các cấp độ
              </p>
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit mx-auto lg:mx-0 shadow-inner">
                {(["primary", "secondary"] as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all cursor-pointer",
                      level === l
                        ? (l === "primary" ? "bg-white text-purple-600 shadow-md ring-1 ring-slate-200" : "bg-white text-cyan-600 shadow-md ring-1 ring-slate-200")
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {l === "primary" ? "Tiểu học (Lớp 3-5)" : "Trung học (Lớp 6-9)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={level}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative aspect-square"
              >
                <div className={cn(
                  "absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full",
                  isPrimary ? "scale-125" : "scale-110"
                )} />
                <div className={cn(
                  "relative w-full h-full overflow-hidden border-8 border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]",
                  isPrimary ? "rounded-[80px]" : "rounded-3xl"
                )}>
                  <Image
                    src={isPrimary ? PRIMARY_HERO : SECONDARY_HERO}
                    alt="Trải nghiệm học tập"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Đã nắm vững</p>
                      <p className="text-xs text-slate-500">Hình học • Hoàn thành 98%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 hidden md:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Network className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Bản đồ kiến thức</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 1, 1, 0.5, 0].map((v, i) => (
                          <div key={i} className="w-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${v * 100}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-4xl font-adaptive-display tracking-tight">Tập trung vào Kiến thức cốt lõi.</h2>
            <p className="text-slate-500 text-lg font-medium">Chúng tôi loại bỏ những yếu tố xao nhãng để tập trung vào điều quan trọng nhất: sự thấu hiểu sâu sắc.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sơ đồ Kiến thức",
                desc: "Mọi khái niệm đều được ánh xạ với các kiến thức tiên quyết. Học sinh luôn biết mình đang ở đâu trên hành trình.",
                icon: <Target className="w-8 h-8 text-blue-600" />
              },
              {
                title: "Phản hồi Thích ứng",
                desc: "Hệ thống chẩn đoán xác định các lỗ hổng kiến thức ngay lập tức và điều chỉnh tài liệu học tập phù hợp với trình độ.",
                icon: <BookOpen className="w-8 h-8 text-blue-600" />
              },
              {
                title: "Không Xếp hạng",
                desc: "Thành công được đo lường bằng chính sự nỗ lực làm chủ kiến thức của bản thân. Không áp lực, chỉ có sự tiến bộ.",
                icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
              }
            ].map((f, i) => (
              <div
                key={i}
                className={cn(
                  "p-8 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group",
                  isPrimary ? "rounded-[40px]" : "rounded-2xl"
                )}
              >
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm w-fit group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-2xl font-adaptive-display mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-bold">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Call to Action */}
      <section id="mastery" className="py-24 px-6 overflow-hidden">
        <div className={cn(
          "max-w-7xl mx-auto bg-slate-900 rounded-[64px] p-12 md:p-24 relative overflow-hidden",
          !isPrimary && "rounded-3xl"
        )}>
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-adaptive-display text-white leading-tight">
                Sẵn sàng thay đổi cách con bạn <span className="text-blue-400">học tập?</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <Users className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Hỗ trợ Kép</h4>
                    <p className="text-slate-400 text-sm font-medium">Giao diện riêng cho Phụ huynh và Gia sư cho một hệ sinh thái trọn vẹn.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-blue-400 shrink-0 mt-1">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Cốt lõi</h4>
                    <p className="text-slate-400 text-sm font-medium">Nền tảng Toán học và Ngữ văn vững chắc ngay từ những ngày đầu.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
              >
                Bắt đầu Miễn phí <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-40 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-4xl font-adaptive-display text-white mb-1">500+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Điểm kiến thức</p>
                </div>
                <div className="h-64 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-4xl font-adaptive-display text-white mb-1">4.9/5</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phụ huynh đánh giá</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-4xl font-adaptive-display text-white mb-1">100%</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Độ tập trung</p>
                </div>
                <div className="h-40 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-4xl font-adaptive-display text-white mb-1">24/7</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gia sư đồng hành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
              <Image
                src="/assets/logo.png"
                alt="EduPlatform Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-adaptive-display text-lg font-bold tracking-tight">
              EduPlatform
            </span>
          </div>
          <p className="text-slate-400 text-sm font-bold">© 2026 TNB Education. Bảo lưu mọi quyền.</p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-blue-600">Quyền riêng tư</Link>
            <Link href="#" className="hover:text-blue-600">Điều khoản</Link>
            <Link href="#" className="hover:text-blue-600">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
