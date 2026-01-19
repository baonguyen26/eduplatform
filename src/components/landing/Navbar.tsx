"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Rocket, GraduationCap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-4 left-4 right-4 z-[100] transition-all duration-300",
            "rounded-2xl border border-white/20 backdrop-blur-md",
            isScrolled ? "bg-white/80 shadow-lg py-3" : "bg-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                        <Image
                            src="/assets/logo.png"
                            alt="EduPlatform Logo"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <span className="font-adaptive-display text-xl font-bold tracking-tight text-slate-900">
                        EduPlatform
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
                    <Link href="#mastery" className="hover:text-blue-600 transition-colors">Triết lý</Link>
                    <Link href="#showcase" className="hover:text-blue-600 transition-colors">Giao diện</Link>
                    <Link href="#features" className="hover:text-blue-600 transition-colors">Tính năng</Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200"
                    >
                        Vào Ứng dụng
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-xl space-y-4">
                    <Link href="#mastery" className="block px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Triết lý</Link>
                    <Link href="#showcase" className="block px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Giao diện</Link>
                    <Link href="#features" className="block px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Tính năng</Link>
                    <Link
                        href="/dashboard"
                        className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-bold"
                    >
                        Vào Ứng dụng
                    </Link>
                </div>
            )}
        </nav>
    );
}
