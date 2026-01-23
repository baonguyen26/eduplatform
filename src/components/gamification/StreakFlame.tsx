'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
    days: number;
}

export function StreakFlame({ days }: StreakFlameProps) {
    const clayPill = "bg-white/90 backdrop-blur rounded-full px-4 py-2 border border-white/50 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] flex items-center gap-2";

    // Active if days > 0
    const isActive = days > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={clayPill}
        >
            <motion.div
                animate={isActive ? {
                    scale: [1, 1.1, 1],
                    rotate: [-5, 5, -5],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className={`p-1.5 rounded-full shadow-inner ${isActive ? 'bg-orange-100' : 'bg-slate-100'}`}>
                    <Flame className={`w-5 h-5 ${isActive ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
                </div>
            </motion.div>

            <div className="flex flex-col leading-none">
                <span className={`font-[Baloo_2] font-bold text-lg ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                    {days}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày</span>
            </div>
        </motion.div>
    );
}
