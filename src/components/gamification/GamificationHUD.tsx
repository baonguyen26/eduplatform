'use client';

import React from 'react';
import { XPBar } from './XPBar';
import { StreakFlame } from './StreakFlame';

interface GamificationHUDProps {
    xp: number;
    streak: number;
}

export function GamificationHUD({ xp, streak }: GamificationHUDProps) {
    return (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4 pointer-events-none">
            {/* Pointer events auto to allow interaction if needed, but none for now */}
            <div className="pointer-events-auto flex gap-4">
                <XPBar xp={xp} />
                <StreakFlame days={streak} />
            </div>
        </div>
    );
}
