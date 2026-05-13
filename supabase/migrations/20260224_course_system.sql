-- ═══════════════════════════════════════════════════════════════
-- COURSE SYSTEM & MULTI-TENANT ROLE ENHANCEMENT
-- ═══════════════════════════════════════════════════════════════

-- 0. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. ENHANCE COACH PROFILES WITH ROLES
ALTER TABLE IF EXISTS public.coach_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'coach' CHECK (role IN ('coach', 'super_admin'));

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'TRY',
    category TEXT,
    difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSE SECTIONS
CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSE LESSONS
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES public.course_sections ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_seconds INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    progress_percent INTEGER DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- 6. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    provider TEXT DEFAULT 'manual',
    provider_transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES

-- Courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = coach_id);
CREATE POLICY "Coaches can manage their own courses" ON public.courses FOR ALL USING (auth.uid() = coach_id);

-- Sections
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections are viewable by enrolled students or coach" ON public.course_sections FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = public.course_sections.course_id AND student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.courses WHERE id = public.course_sections.course_id AND coach_id = auth.uid())
);
CREATE POLICY "Coaches can manage their own sections" ON public.course_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = public.course_sections.course_id AND coach_id = auth.uid())
);

-- Lessons
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by enrolled students, previews, or coach" ON public.course_lessons FOR SELECT USING (
    is_preview = true
    OR auth.uid() IN (
        SELECT student_id FROM public.enrollments e
        JOIN public.course_sections s ON e.course_id = s.course_id
        WHERE s.id = section_id
    )
    OR auth.uid() IN (
        SELECT coach_id FROM public.courses c
        JOIN public.course_sections s ON c.id = s.course_id
        WHERE s.id = section_id
    )
);
CREATE POLICY "Coaches can manage their own lessons" ON public.course_lessons FOR ALL USING (
    auth.uid() IN (
        SELECT coach_id FROM public.courses c
        JOIN public.course_sections s ON c.id = s.course_id
        WHERE s.id = section_id
    )
);

-- Enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can see their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Coaches can see enrollments for their courses" ON public.enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = public.enrollments.course_id AND coach_id = auth.uid())
);

-- Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "SuperAdmins can see all payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.coach_profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 8. TRIGGERS FOR UPDATED_AT
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER course_lessons_updated BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
