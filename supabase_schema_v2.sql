-- ═══════════════════════════════════════════════════════════════
-- PT PLATFORM V2 — ENTERPRISE SCHEMA
-- $100K Value: Auth, Messaging, Payments, Video Library, Notifications
-- ═══════════════════════════════════════════════════════════════

-- ══════ 1. STUDENT PROFILES (linked to Supabase Auth) ══════
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
    coach_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    goal TEXT,
    athlete_level TEXT DEFAULT 'Rookie' CHECK (athlete_level IN ('Rookie', 'Pro', 'Elite', 'Legend')),
    personal_note TEXT,
    nutrition_goals JSONB DEFAULT '{"cal": 2000, "p": 120, "f": 65, "c": 250}',
    performance_stats JSONB DEFAULT '{"strength": 50, "explosiveness": 50, "endurance": 50, "consistency": 50, "nutrition": 50}',
    allergens TEXT[] DEFAULT '{}',
    health_notes TEXT,
    emergency_contact JSONB,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'paused', 'expired', 'trial')),
    subscription_end DATE,
    total_sessions INTEGER DEFAULT 0,
    remaining_sessions INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 2. COACH PROFILES ══════
CREATE TABLE IF NOT EXISTS public.coach_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    specializations TEXT[] DEFAULT '{}',
    certifications JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '{}',
    max_students INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 3. MESSAGING SYSTEM ══════
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    student_id UUID REFERENCES auth.users NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    unread_coach INTEGER DEFAULT 0,
    unread_student INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coach_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'workout', 'meal_plan', 'voice', 'system')),
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 4. PAYMENT & SUBSCRIPTION TRACKING ══════
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    session_count INTEGER NOT NULL,
    duration_days INTEGER DEFAULT 30,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    coach_id UUID REFERENCES auth.users NOT NULL,
    package_id UUID REFERENCES public.packages,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    invoice_url TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    coach_id UUID REFERENCES auth.users NOT NULL,
    package_id UUID REFERENCES public.packages,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    sessions_total INTEGER DEFAULT 0,
    sessions_used INTEGER DEFAULT 0,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 5. VIDEO EXERCISE LIBRARY ══════
CREATE TABLE IF NOT EXISTS public.exercise_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.exercise_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    category_id UUID REFERENCES public.exercise_categories,
    name TEXT NOT NULL,
    name_tr TEXT,
    description TEXT,
    description_tr TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    youtube_id TEXT,
    difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'elite')),
    muscle_groups TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    instructions JSONB DEFAULT '[]',
    tips TEXT[] DEFAULT '{}',
    duration_seconds INTEGER,
    calories_estimate INTEGER,
    is_public BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 6. WORKOUT PLANS & TRACKING ══════
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    student_id UUID REFERENCES auth.users,
    name TEXT NOT NULL,
    description TEXT,
    plan_type TEXT DEFAULT 'custom' CHECK (plan_type IN ('custom', 'template', 'ai_generated')),
    difficulty TEXT DEFAULT 'intermediate',
    duration_weeks INTEGER DEFAULT 4,
    days_per_week INTEGER DEFAULT 3,
    exercises JSONB NOT NULL DEFAULT '[]',
    ai_notes TEXT,
    is_template BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    plan_id UUID REFERENCES public.workout_plans,
    date DATE NOT NULL,
    duration_minutes INTEGER,
    exercises_completed JSONB DEFAULT '[]',
    total_volume DECIMAL(10,2),
    calories_burned INTEGER,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    notes TEXT,
    mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'tired', 'exhausted')),
    coach_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 7. NUTRITION PLANS ══════
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users NOT NULL,
    student_id UUID REFERENCES auth.users,
    name TEXT NOT NULL,
    description TEXT,
    daily_targets JSONB DEFAULT '{"cal": 2000, "p": 120, "f": 65, "c": 250}',
    meals JSONB NOT NULL DEFAULT '[]',
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories INTEGER,
    protein DECIMAL(6,1),
    fat DECIMAL(6,1),
    carbs DECIMAL(6,1),
    portion_size TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 8. NOTIFICATIONS ══════
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'workout', 'message', 'payment', 'achievement', 'reminder')),
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 9. ACHIEVEMENTS & GAMIFICATION ══════
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    description TEXT,
    description_tr TEXT,
    icon TEXT NOT NULL,
    category TEXT CHECK (category IN ('workout', 'nutrition', 'consistency', 'milestone', 'social')),
    xp_reward INTEGER DEFAULT 100,
    requirement JSONB NOT NULL,
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond'))
);

CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    achievement_id UUID REFERENCES public.achievements NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, achievement_id)
);

-- ══════ 10. WELLNESS & BODY TRACKING ══════
CREATE TABLE IF NOT EXISTS public.wellness_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    date DATE NOT NULL,
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    water_liters DECIMAL(3,1),
    steps INTEGER,
    mood TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    date DATE NOT NULL,
    weight DECIMAL(5,1),
    body_fat DECIMAL(4,1),
    muscle_mass DECIMAL(5,1),
    bmi DECIMAL(4,1),
    shoulder DECIMAL(5,1),
    chest DECIMAL(5,1),
    waist DECIMAL(5,1),
    hip DECIMAL(5,1),
    thigh DECIMAL(5,1),
    arm DECIMAL(5,1),
    photos JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ 11. HABIT TRACKING ══════
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    date DATE NOT NULL,
    habits JSONB NOT NULL DEFAULT '[]',
    completion_rate DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- ══════ 12. PROGRESS PHOTOS ══════
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users NOT NULL,
    photo_url TEXT NOT NULL,
    category TEXT DEFAULT 'front' CHECK (category IN ('front', 'side', 'back', 'other')),
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════ RLS POLICIES ══════
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- Students can see their own profile
CREATE POLICY "students_own_profile" ON public.student_profiles
    FOR ALL USING (auth.uid() = auth_id);

-- Coaches can see their students
CREATE POLICY "coaches_see_students" ON public.student_profiles
    FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "coaches_manage_students" ON public.student_profiles
    FOR ALL USING (auth.uid() = coach_id);

-- Messaging: both parties can see their conversations
CREATE POLICY "conversation_access" ON public.conversations
    FOR ALL USING (auth.uid() = coach_id OR auth.uid() = student_id);

CREATE POLICY "message_access" ON public.messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM public.conversations
            WHERE coach_id = auth.uid() OR student_id = auth.uid()
        )
    );

-- Notifications: users see their own
CREATE POLICY "own_notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Students see their own data
CREATE POLICY "own_workout_sessions" ON public.workout_sessions
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "own_food_logs" ON public.food_logs
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "own_wellness" ON public.wellness_logs
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "own_measurements" ON public.body_measurements
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "own_habits" ON public.habit_logs
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "own_photos" ON public.progress_photos
    FOR ALL USING (auth.uid() = student_id);

-- Packages are public read
CREATE POLICY "packages_public_read" ON public.packages
    FOR SELECT USING (true);

CREATE POLICY "coaches_manage_packages" ON public.packages
    FOR ALL USING (auth.uid() = coach_id);

-- Exercise library: public exercises visible to all, private to coach
CREATE POLICY "exercise_library_read" ON public.exercise_library
    FOR SELECT USING (is_public = true OR auth.uid() = coach_id);

CREATE POLICY "coaches_manage_exercises" ON public.exercise_library
    FOR ALL USING (auth.uid() = coach_id);

-- Workout plans
CREATE POLICY "workout_plans_access" ON public.workout_plans
    FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = student_id OR is_template = true);

CREATE POLICY "coaches_manage_plans" ON public.workout_plans
    FOR ALL USING (auth.uid() = coach_id);

-- Payments & Subscriptions
CREATE POLICY "payment_access" ON public.payments
    FOR ALL USING (auth.uid() = student_id OR auth.uid() = coach_id);

CREATE POLICY "subscription_access" ON public.subscriptions
    FOR ALL USING (auth.uid() = student_id OR auth.uid() = coach_id);

-- Achievements: public read
CREATE POLICY "achievements_public" ON public.achievements
    FOR SELECT USING (true);

CREATE POLICY "student_achievements_access" ON public.student_achievements
    FOR ALL USING (auth.uid() = student_id);

-- ══════ INDEXES FOR PERFORMANCE ══════
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_workout_sessions_student ON public.workout_sessions(student_id, date DESC);
CREATE INDEX idx_food_logs_student_date ON public.food_logs(student_id, date DESC);
CREATE INDEX idx_wellness_logs_student ON public.wellness_logs(student_id, date DESC);
CREATE INDEX idx_body_measurements_student ON public.body_measurements(student_id, date DESC);
CREATE INDEX idx_student_profiles_coach ON public.student_profiles(coach_id);
CREATE INDEX idx_payments_student ON public.payments(student_id, created_at DESC);

-- ══════ REALTIME SUBSCRIPTIONS ══════
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ══════ FUNCTIONS ══════
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER student_profiles_updated
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate XP on achievement
CREATE OR REPLACE FUNCTION award_xp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.student_profiles
    SET xp = xp + (SELECT xp_reward FROM public.achievements WHERE id = NEW.achievement_id)
    WHERE auth_id = NEW.student_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_achievement_earned
    AFTER INSERT ON public.student_achievements
    FOR EACH ROW EXECUTE FUNCTION award_xp();
