-- =====================================================
-- KNOWLEDGE GRAPH SCHEMA
-- =====================================================

-- 1. Knowledge Nodes (The Brain)
DROP TABLE IF EXISTS public.knowledge_nodes CASCADE;
CREATE TABLE public.knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL CHECK (subject IN ('math', 'science', 'english', 'vietnamese', 'history', 'geography')),
    grade_level TEXT NOT NULL, -- e.g., 'primary-1', 'secondary-6'
    icon_type TEXT DEFAULT 'star', -- star, book, calculator, etc.
    position JSONB DEFAULT '{"x": 0, "y": 0}', -- Default visual position
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Knowledge Edges (The Connections)
DROP TABLE IF EXISTS public.knowledge_edges CASCADE;
CREATE TABLE public.knowledge_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'prerequisite' CHECK (type IN ('prerequisite', 'related')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(from_node_id, to_node_id)
);

-- 3. Lesson Mapping (Many-to-Many: One lesson can teach multiple nodes, one node can have multiple lessons)
CREATE TABLE IF NOT EXISTS public.lesson_to_node (
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (lesson_id, node_id)
);

-- 4. User Node Progress (The Mastery State)
CREATE TABLE IF NOT EXISTS public.user_node_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'unseen' CHECK (status IN ('unseen', 'exploring', 'practicing', 'mastered')),
    mastery_score INTEGER DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, node_id)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_to_node ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_node_progress ENABLE ROW LEVEL SECURITY;

-- Public Read allowed for Nodes/Edges/Maps
DROP POLICY IF EXISTS "Public can view knowledge nodes" ON public.knowledge_nodes;
CREATE POLICY "Public can view knowledge nodes" ON public.knowledge_nodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view knowledge edges" ON public.knowledge_edges;
CREATE POLICY "Public can view knowledge edges" ON public.knowledge_edges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view lesson mappings" ON public.lesson_to_node;
CREATE POLICY "Public can view lesson mappings" ON public.lesson_to_node FOR SELECT USING (true);

-- User Progress: Only Owner
DROP POLICY IF EXISTS "Users can view own node progress" ON public.user_node_progress;
CREATE POLICY "Users can view own node progress" 
    ON public.user_node_progress FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own node progress" ON public.user_node_progress;
CREATE POLICY "Users can update own node progress" 
    ON public.user_node_progress FOR ALL 
    USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_nodes_subject_grade ON public.knowledge_nodes(subject, grade_level);
CREATE INDEX IF NOT EXISTS idx_edges_from ON public.knowledge_edges(from_node_id);
CREATE INDEX IF NOT EXISTS idx_edges_to ON public.knowledge_edges(to_node_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.user_node_progress(user_id);
