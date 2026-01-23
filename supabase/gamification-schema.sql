-- =====================================================
-- GAMIFICATION & QUIZ SCHEMA
-- =====================================================

-- 1. Quizzes Table (One Quiz per Lesson usually)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score INTEGER DEFAULT 70, -- Percent needed to pass
    xp_reward INTEGER DEFAULT 50, -- XP given for passing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lesson_id) -- Enforce 1 quiz per lesson for now
);

-- 2. Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank')),
    options JSONB, -- Array of strings ["A", "B", "C", "D"]
    correct_answer TEXT NOT NULL, -- The string value of the correct answer
    explanation TEXT, -- Feedback showed after answering
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Quiz Attempts
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- Percent 0-100
    passed BOOLEAN DEFAULT FALSE,
    answers JSONB, -- Record of what user answered {"question_id": "answer"}
    earned_xp INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes: Public read (if course/lesson is public)
-- Simplified: Allow read for all authenticated users for now
DROP POLICY IF EXISTS "Public can view quizzes" ON public.quizzes;
CREATE POLICY "Public can view quizzes" ON public.quizzes FOR SELECT USING (true);

-- Questions: Public read
DROP POLICY IF EXISTS "Public can view questions" ON public.quiz_questions;
CREATE POLICY "Public can view questions" ON public.quiz_questions FOR SELECT USING (true);

-- Attempts: Users can view/insert own
DROP POLICY IF EXISTS "Users can view own attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can view own attempts" ON public.user_quiz_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.user_quiz_attempts;
CREATE POLICY "Users can insert own attempts" ON public.user_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON public.user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz ON public.user_quiz_attempts(quiz_id);

-- =====================================================
-- RPC FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION increment_xp(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
