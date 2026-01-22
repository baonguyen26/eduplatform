
-- INIT SCHEMA: Subjects & Topics (Essentials Only)
-- Other tables (profiles, courses, knowledge) are handled by specific schema files.

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for subjects" ON public.subjects;
CREATE POLICY "Public read access for subjects" 
  ON public.subjects FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  "position" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, slug)
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for topics" ON public.topics;
CREATE POLICY "Public read access for topics" 
  ON public.topics FOR SELECT 
  TO authenticated, anon 
  USING (true);
