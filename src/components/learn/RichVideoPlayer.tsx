'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

// @ts-ignore
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

interface RichVideoPlayerProps {
    url: string;
    onProgress?: (progress: number) => void; // 0 to 1
    onComplete?: () => void;
    title?: string;
}

export function RichVideoPlayer({ url, onProgress, onComplete, title }: RichVideoPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0); // 0 to 1
    const [showControls, setShowControls] = useState(false);
    const playerRef = useRef<any>(null);

    // Claymorphism styles (Tailwind)
    const clayContainer = "bg-white/80 backdrop-blur-md rounded-3xl shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] border border-white/40 p-2 relative overflow-hidden group";
    const clayButton = "p-3 rounded-full bg-white shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] text-indigo-600 transition-all active:scale-95";
    const progressBar = "h-3 w-full bg-gray-200 rounded-full cursor-pointer shadow-inner relative overflow-hidden";
    const progressFill = "h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300";

    const handlePlayPause = () => setPlaying(!playing);

    const handleProgress = (state: { played: number, loaded: number }) => {
        setPlayed(state.played);
        if (onProgress) onProgress(state.played);

        // Mark strictly complete at 90%
        if (state.played > 0.9 && onComplete) {
            onComplete();
        }
    };

    return (
        <div
            className={`${clayContainer} w-full aspect-video flex flex-col`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-black">
                {/* Wrapper */}
                <div className="absolute inset-0">
                    <ReactPlayer
                        ref={playerRef as any}
                        url={url}
                        width="100%"
                        height="100%"
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        onProgress={handleProgress}
                        controls={false}
                        className="absolute top-0 left-0"
                        onEnded={onComplete}
                        config={{
                            youtube: {
                                playerVars: {
                                    showinfo: 1,
                                    controls: 0,
                                    modestbranding: 1,
                                    rel: 0,
                                    autohide: 1,
                                    origin: typeof window !== 'undefined' ? window.location.origin : undefined
                                }
                            }
                        }}
                        onError={(e: any) => {
                            // Ignore AbortError which happens on rapid play/pause
                            if (e?.name === 'AbortError') return;
                            console.error('Player Error:', e);
                        }}
                    />
                </div>

                {/* Big Play Overlay */}
                {!playing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors cursor-pointer" onClick={handlePlayPause}>
                        <div className={`${clayButton} !p-6 !text-indigo-500 hover:!text-indigo-600 scale-125`}>
                            <Play className="w-8 h-8 fill-current" />
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Control Bar */}
            <div className={`absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-lg transition-all duration-300 ${showControls || !playing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {title && <div className="text-xs font-bold text-gray-500 mb-2 px-1 font-[Quicksand]">{title}</div>}

                {/* Progress */}
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className={progressBar}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const newPlayed = x / rect.width;
                            playerRef.current?.seekTo(newPlayed);
                        }}
                    >
                        <div className={progressFill} style={{ width: `${played * 100}%` }} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={handlePlayPause} className={clayButton}>
                            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={() => setMuted(!muted)} className={`${clayButton} !p-2`}>
                                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    setMuted(false);
                                }}
                                className="w-20 accent-indigo-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer hidden group-hover/vol:block transition-all"
                            />
                        </div>
                    </div>

                    <div className="text-sm font-bold text-indigo-900 font-[Baloo_2]">
                        {Math.round(played * 100)}% Complete
                    </div>
                </div>
            </div>
        </div>
    );
}
