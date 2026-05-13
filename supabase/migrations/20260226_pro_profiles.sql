-- ═══════════════════════════════════════════════════════════════
-- PROFESSIONAL PROFILES (LINKEDIN-STYLE)
-- ═══════════════════════════════════════════════════════════════

-- 1. ENHANCE COACH PROFILES WITH PROFESSIONAL DATA
ALTER TABLE IF EXISTS public.coach_profiles
ADD COLUMN IF NOT EXISTS professional_data JSONB DEFAULT '{
    "experience": [],
    "certifications": [],
    "skills": [],
    "headline": "Elite Fitness Coach",
    "bio_long": ""
}'::JSONB;

-- 2. COACH RECOMMENDATIONS (SOCIAL PROOF)
CREATE TABLE IF NOT EXISTS public.coach_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    author_name TEXT NOT NULL,
    author_title TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES

-- Recommendations
ALTER TABLE public.coach_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recommendations are viewable by everyone"
ON public.coach_recommendations FOR SELECT
USING (true);

CREATE POLICY "Coaches can manage their own recommendations"
ON public.coach_recommendations FOR ALL
USING (auth.uid() = coach_id);

-- 4. UTILITY INDEX
CREATE INDEX IF NOT EXISTS idx_coach_recommendations_coach_id ON public.coach_recommendations(coach_id);
