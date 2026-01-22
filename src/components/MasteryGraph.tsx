import React, { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { CheckCircle2, Lock, Star, BookOpen, Calculator, FunctionSquare } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---

export type GradeLevel = "primary" | "secondary";
export type NodeStatus = "unseen" | "exploring" | "practicing" | "mastered";

export interface GraphNode {
    id: string;
    title: string;
    description?: string;
    position: { x: number; y: number };
    status: NodeStatus;
    icon_type?: string;
    completed_lessons?: number;
    total_lessons?: number;
}

export interface GraphEdge {
    id: string;
    from: string;
    to: string;
}

interface MasteryGraphProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    gradeLevel: string; // e.g. "primary-1", "secondary-7"
    onNodeClick?: (nodeId: string) => void;
}

// --- Icons ---
const Icons: Record<string, any> = {
    star: Star,
    book: BookOpen,
    math: Calculator,
    function: FunctionSquare,
    default: Star
};

// --- Styles ---

const MODES = {
    primary: {
        container: "bg-blue-50 pattern-grid-lg",
        edgeColor: "#94a3b8", // slate-400
        edgeWidth: 4,
        node: {
            base: "w-24 h-24 rounded-[32px] border-4 flex items-center justify-center transition-transform hover:scale-110 shadow-[0_8px_0_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none",
            unseen: "bg-slate-200 border-slate-300 text-slate-400",
            exploring: "bg-amber-400 border-amber-500 text-white",
            practicing: "bg-blue-500 border-blue-600 text-white",
            mastered: "bg-emerald-500 border-emerald-600 text-white",
        }
    },
    secondary: {
        container: "bg-slate-950 pattern-grid-sm",
        edgeColor: "#334155", // slate-700
        edgeWidth: 2,
        node: {
            base: "w-20 h-20 rounded-2xl border flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] backdrop-blur-md",
            unseen: "bg-slate-900/50 border-slate-800 text-slate-700 grayscale",
            exploring: "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
            practicing: "bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
            mastered: "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        }
    }
};

export default function MasteryGraph({ nodes, edges, gradeLevel, onNodeClick }: MasteryGraphProps) {
    const isPrimary = gradeLevel.startsWith("primary");
    const theme = isPrimary ? MODES.primary : MODES.secondary;
    const containerRef = useRef<HTMLDivElement>(null);

    // Zoom/Pan State
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);

    useGesture(
        {
            onDrag: ({ offset: [ox, oy] }) => {
                x.set(ox);
                y.set(oy);
            },
            onPinch: ({ offset: [s] }) => {
                scale.set(s);
            },
        },
        {
            target: containerRef,
            drag: { from: () => [x.get(), y.get()] },
            pinch: { scaleBounds: { min: 0.5, max: 2 }, modifierKey: undefined },
        }
    );

    // Manual controls helpers
    const handleZoomIn = () => scale.set(Math.min(scale.get() * 1.2, 2));
    const handleZoomOut = () => scale.set(Math.max(scale.get() * 0.8, 0.5));


    return (
        <div className={cn("w-full h-[600px] overflow-hidden relative cursor-grab active:cursor-grabbing rounded-3xl border-4", isPrimary ? "border-white bg-blue-50" : "border-slate-800 bg-slate-950")}>

            {/* Background Grid Pattern */}
            <div className={cn("absolute inset-0 opacity-20 pointer-events-none", isPrimary ? "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" : "bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:40px_40px]")} />

            <motion.div
                ref={containerRef}
                style={{ x, y, scale, touchAction: "none" }}
                className="w-full h-full origin-center"
            >
                {/* 1. Edges Layer */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill={theme.edgeColor} />
                        </marker>
                    </defs>
                    {edges.map((edge) => {
                        const from = nodes.find(n => n.id === edge.from);
                        const to = nodes.find(n => n.id === edge.to);
                        if (!from || !to) return null;

                        return (
                            <motion.line
                                key={edge.id}
                                x1={from.position.x}
                                y1={from.position.y}
                                x2={to.position.x}
                                y2={to.position.y}
                                stroke={theme.edgeColor}
                                strokeWidth={theme.edgeWidth}
                                strokeDasharray={from.status === 'unseen' ? "5,5" : "0"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                </svg>

                {/* 2. Nodes Layer */}
                {nodes.map((node, i) => {
                    const Icon = Icons[node.icon_type || 'default'] || Star;
                    const isUnlocked = node.status !== "unseen";

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                            className={cn(
                                "absolute -ml-10 -mt-10 flex flex-col items-center justify-center cursor-pointer group",
                                "touch-none select-none" // prevent browser gestures impacting drag
                            )}
                            style={{ left: node.position.x, top: node.position.y }}
                            onClick={() => onNodeClick?.(node.id)}
                        >
                            {/* Node Circle */}
                            <div className={cn(theme.node.base, theme.node[node.status])}>
                                {node.status === "mastered" ? (
                                    <CheckCircle2 className={isPrimary ? "w-10 h-10" : "w-8 h-8"} />
                                ) : !isUnlocked ? (
                                    <Lock className={isPrimary ? "w-8 h-8" : "w-6 h-6"} />
                                ) : (
                                    <Icon className={isPrimary ? "w-10 h-10" : "w-8 h-8"} />
                                )}

                                {/* Progress Ring (Secondary Mode only) */}
                                {!isPrimary && node.status !== 'unseen' && (
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
                                        <circle
                                            cx="50%" cy="50%" r="45%"
                                            fill="none" strokeWidth="2"
                                            stroke="currentColor" strokeOpacity="0.2"
                                        />
                                        <circle
                                            cx="50%" cy="50%" r="45%"
                                            fill="none" strokeWidth="2"
                                            stroke="currentColor"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - (node.completed_lessons || 0) / (node.total_lessons || 1) * 100}
                                        />
                                    </svg>
                                )}
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "mt-3 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                isPrimary
                                    ? "bg-white text-slate-700 shadow-md border-2 border-slate-100"
                                    : "bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-white group-hover:border-slate-600"
                            )}>
                                {node.title}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl hover:bg-slate-50" onClick={handleZoomIn}>+</button>
                <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl hover:bg-slate-50" onClick={handleZoomOut}>-</button>
            </div>
        </div>
    );
}
