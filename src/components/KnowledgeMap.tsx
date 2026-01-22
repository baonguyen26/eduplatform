"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MasteryGraph, { GraphNode, GraphEdge, GradeLevel } from "./MasteryGraph";
import ConceptModal from "./ConceptModal";

export default function KnowledgeMap() {
    const supabase = createClient();
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [edges, setEdges] = useState<GraphEdge[]>([]);
    const [gradeLevel, setGradeLevel] = useState<string>("primary-1");
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [nodeLessons, setNodeLessons] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // 1. Get User & Profile
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('grade_level')
                .eq('id', user.id)
                .single();

            if (profile?.grade_level) {
                setGradeLevel(profile.grade_level);
                setUserProfile(profile);
            }

            // 2. Get Nodes & Edges
            const { data: fetchedNodes } = await supabase
                .from('knowledge_nodes')
                .select('*');

            const { data: fetchedEdges } = await supabase
                .from('knowledge_edges')
                .select('*');

            // 3. Get Progress
            const { data: progress } = await supabase
                .from('user_node_progress')
                .select('node_id, status, mastery_score')
                .eq('user_id', user.id);

            // 4. Merge Data
            const mergedNodes: GraphNode[] = (fetchedNodes || []).map((n: any) => {
                const p = progress?.find((p: any) => p.node_id === n.id);
                return {
                    id: n.id,
                    title: n.title,
                    description: n.description,
                    position: n.position || { x: 0, y: 0 },
                    status: p?.status || 'unseen',
                    icon_type: n.icon_type,
                    // TODO: Calculate lesson completion
                    completed_lessons: 0,
                    total_lessons: 0
                };
            });

            const formattedEdges: GraphEdge[] = (fetchedEdges || []).map((e: any) => ({
                id: e.id,
                from: e.from_node_id,
                to: e.to_node_id
            }));

            setNodes(mergedNodes);
            setEdges(formattedEdges);
            setLoading(false);
        }

        fetchData();
    }, []);

    const handleNodeClick = async (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        setSelectedNode(node);
        setModalOpen(true);
        setNodeLessons([]); // Clear previous

        // Fetch connected lessons
        const { data: linkedLessons } = await supabase
            .from('lesson_to_node')
            .select('lesson_id, lessons(id, title, duration)')
            .eq('node_id', nodeId);

        if (linkedLessons) {
            // Need to check completion status for these lessons
            // This is a bit expensive, maybe optimize later
            const lessons = linkedLessons.map((l: any) => ({
                id: l.lessons.id,
                title: l.lessons.title,
                duration: l.lessons.duration,
                isCompleted: false // TODO: Fetch boolean from user_progress
            }));
            setNodeLessons(lessons);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-slate-50 rounded-3xl">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-adaptive-display font-extrabold text-slate-900 leading-tight">
                            Bản đồ <span className="text-indigo-600">Kiến thức</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl mt-2">
                            {gradeLevel.startsWith('primary')
                                ? "Khám phá thế giới tri thức đầy màu sắc! Mỗi ngôi sao là một bài học mới."
                                : "Theo dõi lộ trình làm chủ kiến thức của bạn. Xây dựng nền tảng vững chắc."}
                        </p>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-500">Chưa học</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <span className="text-xs font-bold text-slate-700">Đang học</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">Đã xong</span>
                        </div>
                    </div>
                </div>

                {/* Graph Area */}
                <MasteryGraph
                    nodes={nodes}
                    edges={edges}
                    gradeLevel={gradeLevel}
                    onNodeClick={handleNodeClick}
                />

                {/* Modal */}
                <ConceptModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    node={selectedNode}
                    lessons={nodeLessons}
                    gradeLevel={gradeLevel}
                />
            </div>
        </div>
    );
}
