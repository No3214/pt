-- ═══════════════════════════════════════════════════════════════
-- PERSONAL BRANDING & LANDING PAGE SYSTEM
-- ═══════════════════════════════════════════════════════════════

-- 1. COACH LANDINGS TABLE
CREATE TABLE IF NOT EXISTS public.coach_landings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    theme TEXT DEFAULT 'pro' CHECK (theme IN ('pro', 'athlete', 'minimalist')),
    content JSONB DEFAULT '{
        "hero": {
            "title": "Elite Performance Coaching",
            "subtitle": "Transform your body and mind with data-driven training.",
            "buttonText": "Start Your Journey"
        },
        "about": {
            "title": "About Me",
            "bio": "Professional coach dedicated to helping athletes reach their peak potential."
        },
        "services": [],
        "socials": {
            "instagram": "",
            "whatsapp": "",
            "youtube": ""
        }
    }'::JSONB,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADD COACH_ID TO LEADS FOR ATTRIBUTION
ALTER TABLE IF EXISTS public.leads
ADD COLUMN IF NOT EXISTS coach_id UUID REFERENCES auth.users;

-- 3. RLS POLICIES

-- Coach Landings
ALTER TABLE public.coach_landings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published landings"
ON public.coach_landings FOR SELECT
USING (is_published = true);

CREATE POLICY "Coaches can manage their own landing"
ON public.coach_landings FOR ALL
USING (auth.uid() = coach_id);

-- 4. TRIGGERS
CREATE TRIGGER coach_landings_updated
BEFORE UPDATE ON public.coach_landings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. INITIAL SLUGS FOR EXISTING COACHES
-- This is a helper to ensure existing coaches have a default landing entry
INSERT INTO public.coach_landings (coach_id, slug, is_published)
SELECT id, 'coach-' || id, false
FROM public.coach_profiles
ON CONFLICT (coach_id) DO NOTHING;
