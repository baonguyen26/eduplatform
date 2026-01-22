import { SupabaseClient } from "@supabase/supabase-js";

/**
 * The GraphEngine handles the logic for traversing the knowledge graph
 * and updating user progress (unlocking nodes, marking mastery).
 */
export class GraphEngine {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Check if a node should be marked as 'mastered' based on lesson completion.
     * If mastered, it will also attempt to unlock dependent nodes (child nodes).
     */
    async checkNodeMastery(userId: string, nodeId: string) {
        // 1. Get all lessons for this node
        const { data: mappings } = await this.supabase
            .from('lesson_to_node')
            .select('lesson_id')
            .eq('node_id', nodeId);

        if (!mappings || mappings.length === 0) {
            // Node has no lessons? Auto-master it? Or leave as is?
            // For now, assume manual mastery or no-op.
            return;
        }

        const lessonIds = mappings.map(m => m.lesson_id);

        // 2. Check user progress for these lessons
        const { data: progress } = await this.supabase
            .from('user_progress')
            .select('lesson_id, status')
            .eq('user_id', userId)
            .in('lesson_id', lessonIds)
            .eq('status', 'completed');

        const completedCount = progress?.length || 0;
        const totalCount = lessonIds.length;

        // 3. Update Status
        let newStatus = 'exploring';
        if (completedCount > 0 && completedCount < totalCount) {
            newStatus = 'practicing';
        } else if (completedCount === totalCount) {
            newStatus = 'mastered';
        }

        // Upsert node progress
        await this.supabase
            .from('user_node_progress')
            .upsert({
                user_id: userId,
                node_id: nodeId,
                status: newStatus,
                mastery_score: Math.round((completedCount / totalCount) * 100),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, node_id' });

        // 4. If Mastered, Unlock Children
        if (newStatus === 'mastered') {
            await this.unlockChildren(userId, nodeId);
        }
    }

    /**
     * Unlock child nodes if all their prerequisites are met.
     */
    async unlockChildren(userId: string, parentNodeId: string) {
        // Find all edges where this node is the 'from' (prerequisite)
        const { data: edges } = await this.supabase
            .from('knowledge_edges')
            .select('to_node_id')
            .eq('from_node_id', parentNodeId)
            .eq('type', 'prerequisite');

        if (!edges) return;

        const childrenIds = edges.map(e => e.to_node_id);

        for (const childId of childrenIds) {
            await this.attemptUnlock(userId, childId);
        }
    }

    /**
     * Check if a specific node can be unlocked (all parents mastered).
     */
    async attemptUnlock(userId: string, nodeId: string) {
        // Get all prerequisites for this child
        const { data: prerequisites } = await this.supabase
            .from('knowledge_edges')
            .select('from_node_id')
            .eq('to_node_id', nodeId)
            .eq('type', 'prerequisite');

        if (!prerequisites || prerequisites.length === 0) {
            // No prerequisites? Should already be unlocked.
            return;
        }

        const parentIds = prerequisites.map(p => p.from_node_id);

        // Check status of all parents
        const { data: parentProgress } = await this.supabase
            .from('user_node_progress')
            .select('node_id, status')
            .eq('user_id', userId)
            .in('node_id', parentIds)
            .eq('status', 'mastered');

        const masteredParents = parentProgress?.length || 0;

        if (masteredParents === parentIds.length) {
            // All parents mastered! Unlock this node (set to 'exploring' if currently 'unseen')
            const { data: current } = await this.supabase
                .from('user_node_progress')
                .select('status')
                .eq('user_id', userId)
                .eq('node_id', nodeId)
                .single();

            if (!current || current.status === 'unseen') {
                await this.supabase
                    .from('user_node_progress')
                    .upsert({
                        user_id: userId,
                        node_id: nodeId,
                        status: 'exploring',
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id, node_id' });
            }
        }
    }
}
