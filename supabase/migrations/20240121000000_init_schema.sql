
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'parent', 'tutor');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'student',
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}', -- Store Spark/Focus/Scholar mode here
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- Lucide icon name or URL
  color TEXT, -- Hex code or tailwind class
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for subjects" 
  ON public.subjects FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create topics table
CREATE TABLE public.topics (
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
CREATE POLICY "Public read access for topics" 
  ON public.topics FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create knowledge_nodes table (for graph)
CREATE TABLE public.knowledge_nodes (
  id TEXT PRIMARY KEY, -- Using text ID to match visualizer lib if needed, else UUID
  label TEXT NOT NULL,
  topic_id UUID REFERENCES public.topics(id), -- Optional link to topic
  status TEXT DEFAULT 'locked', -- locked, available, completed (can be derived but helpful for graph)
  x FLOAT DEFAULT 0,
  y FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for nodes" 
  ON public.knowledge_nodes FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create edges for graph
CREATE TABLE public.knowledge_edges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  target TEXT REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for edges" 
  ON public.knowledge_edges FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  mastery_score INTEGER DEFAULT 0, -- 0-100
  status TEXT DEFAULT 'locked',
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" 
  ON public.user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON public.user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON public.user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
