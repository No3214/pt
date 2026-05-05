-- ARENA Performance SaaS Monetization Migration Draft
-- Purpose: convert the current PT dashboard into a multi-tenant paid SaaS foundation.
-- Review before running in production. Run in a staging Supabase project first.

-- ============================================================
-- 1. ORGANIZATIONS AND MEMBERSHIP
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    organization_type TEXT DEFAULT 'coach' CHECK (organization_type IN ('coach', 'gym', 'studio', 'academy', 'enterprise')),
    owner_id UUID REFERENCES auth.users ON DELETE SET NULL,
    logo_url TEXT,
    website_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    billing_email TEXT,
    default_currency TEXT DEFAULT 'TRY',
    timezone TEXT DEFAULT 'Europe/Istanbul',
    status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'suspended', 'cancelled')),
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_branding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL UNIQUE,
    brand_name TEXT NOT NULL,
    tagline TEXT,
    primary_color TEXT DEFAULT '#C2684A',
    secondary_color TEXT DEFAULT '#7A9E82',
    accent_color TEXT DEFAULT '#4A6D88',
    background_color TEXT DEFAULT '#FAF6F1',
    dark_background_color TEXT DEFAULT '#0A0A0A',
    logo_url TEXT,
    favicon_url TEXT,
    instagram_url TEXT,
    whatsapp_number TEXT,
    custom_domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'coach', 'staff', 'student')),
    status TEXT DEFAULT 'active' CHECK (status IN ('invited', 'active', 'disabled')),
    invited_by UUID REFERENCES auth.users,
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMMERCIAL PLANS, PACKAGES, CHECKOUT, PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saas_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    annual_price DECIMAL(10,2),
    currency TEXT DEFAULT 'TRY',
    max_students INTEGER,
    max_coaches INTEGER,
    max_branches INTEGER,
    features JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_saas_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    saas_plan_id UUID REFERENCES public.saas_plans,
    status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
    billing_period TEXT DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'annual')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    provider TEXT,
    provider_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('iyzico', 'paytr', 'param', 'stripe', 'manual')),
    display_name TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    mode TEXT DEFAULT 'test' CHECK (mode IN ('test', 'live')),
    public_config JSONB DEFAULT '{}',
    encrypted_secret_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, provider)
);

CREATE TABLE IF NOT EXISTS public.commercial_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    coach_id UUID REFERENCES auth.users,
    name TEXT NOT NULL,
    description TEXT,
    package_type TEXT NOT NULL CHECK (package_type IN ('pt_sessions', 'online_coaching', 'gym_membership', 'group_class', 'course', 'bundle')),
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    session_count INTEGER,
    duration_days INTEGER,
    access_days INTEGER,
    features JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checkout_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    package_id UUID REFERENCES public.commercial_packages ON DELETE SET NULL,
    buyer_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    buyer_name TEXT,
    buyer_email TEXT,
    buyer_phone TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'expired', 'cancelled')),
    provider TEXT,
    provider_session_id TEXT,
    provider_payment_id TEXT,
    checkout_url TEXT,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    checkout_session_id UUID REFERENCES public.checkout_sessions ON DELETE SET NULL,
    package_id UUID REFERENCES public.commercial_packages ON DELETE SET NULL,
    student_id UUID REFERENCES auth.users ON DELETE SET NULL,
    coach_id UUID REFERENCES auth.users ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'TRY',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled', 'chargeback')),
    payment_method TEXT,
    provider TEXT,
    provider_payment_id TEXT,
    provider_conversation_id TEXT,
    installment_count INTEGER DEFAULT 1,
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    invoice_url TEXT,
    raw_payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations ON DELETE SET NULL,
    event_type TEXT,
    provider_event_id TEXT,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_entitlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    package_id UUID REFERENCES public.commercial_packages ON DELETE SET NULL,
    payment_transaction_id UUID REFERENCES public.payment_transactions ON DELETE SET NULL,
    entitlement_type TEXT NOT NULL CHECK (entitlement_type IN ('pt_sessions', 'membership', 'course_access', 'online_coaching', 'bundle')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'cancelled')),
    sessions_total INTEGER DEFAULT 0,
    sessions_used INTEGER DEFAULT 0,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. ONLINE EDUCATION / LMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    instructor_id UUID REFERENCES auth.users ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'TRY',
    access_days INTEGER,
    certificate_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.course_modules ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    lesson_type TEXT DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'pdf', 'quiz', 'live_session')),
    video_url TEXT,
    pdf_url TEXT,
    body TEXT,
    duration_seconds INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    entitlement_id UUID REFERENCES public.student_entitlements ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
    progress_percent DECIMAL(5,2) DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(course_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.course_enrollments ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.course_lessons ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    watch_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(enrollment_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_url TEXT
);

-- ============================================================
-- 4. GYM/STUDIO OPERATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.class_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    capacity_default INTEGER DEFAULT 10,
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches ON DELETE SET NULL,
    class_type_id UUID REFERENCES public.class_types ON DELETE SET NULL,
    coach_id UUID REFERENCES auth.users ON DELETE SET NULL,
    title TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER DEFAULT 10,
    meeting_url TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    class_session_id UUID REFERENCES public.class_sessions ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'waitlisted', 'cancelled', 'attended', 'no_show')),
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in_at TIMESTAMPTZ,
    UNIQUE(class_session_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.coach_commission_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    coach_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    commission_type TEXT DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
    commission_value DECIMAL(10,2) NOT NULL,
    applies_to TEXT DEFAULT 'pt_sessions' CHECK (applies_to IN ('pt_sessions', 'group_class', 'course', 'all')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. CONSENT, AUDIT, NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('privacy_notice', 'explicit_consent', 'health_data_consent', 'terms', 'distance_sales')),
    version TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, document_type, version)
);

CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    legal_document_id UUID REFERENCES public.legal_documents ON DELETE SET NULL,
    consent_type TEXT NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address TEXT,
    user_agent TEXT,
    granted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_role ON public.organization_members(organization_id, role);
CREATE INDEX IF NOT EXISTS idx_packages_org ON public.commercial_packages(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_checkout_org_status ON public.checkout_sessions(organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_org_status ON public.payment_transactions(organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entitlements_student ON public.student_entitlements(student_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_org_status ON public.courses(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.course_enrollments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_class_sessions_org_time ON public.class_sessions(organization_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_audit_org_time ON public.audit_logs(organization_id, created_at DESC);

-- ============================================================
-- 7. SECURITY HELPERS AND RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = org_id
          AND om.user_id = auth.uid()
          AND om.status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_org_role(org_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = org_id
          AND om.user_id = auth.uid()
          AND om.status = 'active'
          AND om.role = ANY(allowed_roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Organization visibility
CREATE POLICY org_member_read_organizations ON public.organizations
    FOR SELECT USING (public.is_org_member(id));

CREATE POLICY org_owner_admin_update_organizations ON public.organizations
    FOR UPDATE USING (public.has_org_role(id, ARRAY['owner','admin']));

-- Organization-scoped generic examples
CREATE POLICY org_member_read_branding ON public.organization_branding
    FOR SELECT USING (public.is_org_member(organization_id));

CREATE POLICY org_admin_manage_branding ON public.organization_branding
    FOR ALL USING (public.has_org_role(organization_id, ARRAY['owner','admin']));

CREATE POLICY org_member_read_packages ON public.commercial_packages
    FOR SELECT USING (is_public = TRUE OR public.is_org_member(organization_id));

CREATE POLICY org_admin_manage_packages ON public.commercial_packages
    FOR ALL USING (public.has_org_role(organization_id, ARRAY['owner','admin','coach']));

CREATE POLICY org_member_read_transactions ON public.payment_transactions
    FOR SELECT USING (public.is_org_member(organization_id));

CREATE POLICY org_admin_read_checkout ON public.checkout_sessions
    FOR SELECT USING (public.is_org_member(organization_id));

CREATE POLICY org_admin_manage_courses ON public.courses
    FOR ALL USING (public.has_org_role(organization_id, ARRAY['owner','admin','coach']));

CREATE POLICY org_member_read_courses ON public.courses
    FOR SELECT USING (status = 'published' OR public.is_org_member(organization_id));

CREATE POLICY org_member_read_class_sessions ON public.class_sessions
    FOR SELECT USING (public.is_org_member(organization_id));

CREATE POLICY org_admin_manage_class_sessions ON public.class_sessions
    FOR ALL USING (public.has_org_role(organization_id, ARRAY['owner','admin','coach','staff']));

CREATE POLICY org_member_read_audit ON public.audit_logs
    FOR SELECT USING (public.has_org_role(organization_id, ARRAY['owner','admin']));

-- ============================================================
-- 8. SEED SAAS PLANS
-- ============================================================

INSERT INTO public.saas_plans (code, name, description, monthly_price, annual_price, currency, max_students, max_coaches, max_branches, features)
VALUES
('solo_pt', 'Solo PT', 'Independent personal trainer starter plan', 499, 4990, 'TRY', 25, 1, 1, '["payment_links", "student_portal", "workout_builder", "measurements"]'),
('pro_coach', 'Pro Coach', 'Online coach growth plan with AI and automations', 999, 9990, 'TRY', 75, 3, 1, '["payment_links", "subscriptions", "student_portal", "ai_checkins", "whatsapp_templates"]'),
('studio', 'Studio / Gym', 'Boutique gym and performance studio plan', 2499, 24990, 'TRY', 250, 10, 3, '["multi_coach", "class_booking", "pt_sessions", "payments", "reports"]'),
('enterprise', 'Enterprise / White Label', 'Custom branded multi-branch plan', 7500, 75000, 'TRY', NULL, NULL, NULL, '["white_label", "custom_domain", "api", "priority_support"]')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 9. NOTES FOR IMPLEMENTATION
-- ============================================================

-- Payment webhooks must be handled server-side only.
-- Do not update paid/active status from the browser.
-- Store payment provider secrets outside the database or as encrypted references.
-- Existing tables should gradually receive organization_id after data migration planning.
-- Test RLS with at least two organizations before production launch.
