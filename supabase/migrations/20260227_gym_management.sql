-- ═══════════════════════════════════════════════════════════════
-- GYM & B2B MANAGEMENT SYSTEM
-- ═══════════════════════════════════════════════════════════════

-- 1. GYM STAFF RELATIONSHIP
CREATE TABLE IF NOT EXISTS public.gym_staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    coach_id UUID REFERENCES auth.users NOT NULL,
    role TEXT DEFAULT 'trainer' CHECK (role IN ('trainer', 'manager', 'head_coach')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(gym_id, coach_id)
);

-- 2. ENHANCE TENANTS WITH BUSINESS DATA
ALTER TABLE IF EXISTS public.tenants
ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'gym' CHECK (business_type IN ('gym', 'studio', 'personal_brand')),
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS address TEXT;

-- 3. RLS POLICIES

-- Gym Staff
ALTER TABLE public.gym_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff are viewable by their gym members"
ON public.gym_staff FOR SELECT
USING (
    tenant_id = gym_id -- If profile has tenant_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tenant_id = gym_id)
);

CREATE POLICY "Gym admins can manage staff"
ON public.gym_staff FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tenant_id = gym_id AND role IN ('admin', 'super_admin'))
);

-- 4. UTILITY VIEW FOR GYM ROSTER
CREATE OR REPLACE VIEW public.gym_roster AS
SELECT
    gs.gym_id,
    p.id as coach_id,
    p.name as coach_name,
    cp.professional_data->>'headline' as headline,
    gs.role,
    gs.joined_at
FROM public.gym_staff gs
JOIN public.profiles p ON gs.coach_id = p.id
LEFT JOIN public.coach_profiles cp ON gs.coach_id = cp.id;
