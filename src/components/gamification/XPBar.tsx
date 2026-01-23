'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface XPBarProps {
    xp: number;
}

export function XPBar({ xp }: XPBarProps) {
    // Claymorphism: Soft, extruded feel
    const clayPill = "bg-white/90 backdrop-blur rounded-full px-4 py-2 border border-white/50 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] flex items-center gap-2";

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={clayPill}
        >
            <div className="bg-yellow-100 p-1.5 rounded-full shadow-inner">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="font-[Baloo_2] font-bold text-indigo-900 text-lg">
                {xp.toLocaleString()} <span className="text-sm text-indigo-400">XP</span>
            </span>
        </motion.div>
    );
}
