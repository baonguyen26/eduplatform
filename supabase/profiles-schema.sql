-- =====================================================
-- PROFILES SCHEMA (User Onboarding & Profile Data)
-- =====================================================

-- Create profiles table
-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Idempotent schema updates (add columns if they don't exist)
DO $$
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'parent'));
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade_level TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS children_ids TEXT[];
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    
    -- Gamification Columns
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_current INTEGER DEFAULT 0;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_longest INTEGER DEFAULT 0;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE; -- For streak calculation
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_completed);

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, onboarding_completed)
    VALUES (NEW.id, FALSE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
