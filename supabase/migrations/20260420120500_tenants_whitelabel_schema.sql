-- ============================================================================
-- ARENA Performance — Tenants + White-label Schema
-- Iter 16: Activate arena-tenant-whitelabel skill
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- tenants: Her musteri (kulub, akademi, koc, studyo) 1 satir
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  name text NOT NULL,
  legal_name text,
  domain text UNIQUE,
  plan text NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter','pro','elite','enterprise','custom')),
  status text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','past_due','suspended','cancelled')),
  brand jsonb NOT NULL DEFAULT '{}'::jsonb,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  copy_overrides jsonb DEFAULT '{}'::jsonb,
  contact_email text,
  contact_phone text,
  billing_email text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  country_code text DEFAULT 'TR',
  timezone text DEFAULT 'Europe/Istanbul',
  locale text DEFAULT 'tr',
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tenants_slug_idx ON public.tenants (slug);
CREATE INDEX IF NOT EXISTS tenants_domain_idx ON public.tenants (domain);
CREATE INDEX IF NOT EXISTS tenants_status_idx ON public.tenants (status);
CREATE INDEX IF NOT EXISTS tenants_plan_idx ON public.tenants (plan);

-- ---------------------------------------------------------------------------
-- profiles extension: tenant_id + role
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'athlete'
    CHECK (role IN ('super_admin','admin','editor','coach','parent','athlete','viewer')),
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

CREATE INDEX IF NOT EXISTS profiles_tenant_idx ON public.profiles (tenant_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

-- ---------------------------------------------------------------------------
-- tenant_invites: Email davet token'lari
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_invites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','editor','coach','parent','athlete','viewer')),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by uuid REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  accepted_at timestamptz,
  accepted_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS tenant_invites_token_idx ON public.tenant_invites (token);
CREATE INDEX IF NOT EXISTS tenant_invites_email_idx ON public.tenant_invites (email);

-- ---------------------------------------------------------------------------
-- tenant_audit_log: Kritik aksiyonlarin kaydi
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text,
  resource_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tenant_audit_log_tenant_idx ON public.tenant_audit_log (tenant_id);
CREATE INDEX IF NOT EXISTS tenant_audit_log_created_at_idx ON public.tenant_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS tenant_audit_log_action_idx ON public.tenant_audit_log (action);

-- ---------------------------------------------------------------------------
-- Helper function: current user's tenant
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_audit_log ENABLE ROW LEVEL SECURITY;

-- tenants: super admin all, users read own
CREATE POLICY tenants_super_admin_all ON public.tenants
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY tenants_own_read ON public.tenants
  FOR SELECT
  USING (id = public.current_tenant_id());

-- tenant_invites: tenant admins manage, invitee can read by token (edge function)
CREATE POLICY tenant_invites_admin ON public.tenant_invites
  FOR ALL
  USING (
    public.is_super_admin() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND tenant_id = tenant_invites.tenant_id
        AND role IN ('admin','editor')
    )
  );

-- tenant_audit_log: super admin all, tenant admins read own
CREATE POLICY audit_log_super_admin ON public.tenant_audit_log
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY audit_log_tenant_read ON public.tenant_audit_log
  FOR SELECT
  USING (
    tenant_id = public.current_tenant_id() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- Seed: Default ARENA tenant (ana marka)
-- ---------------------------------------------------------------------------
INSERT INTO public.tenants (id, slug, name, plan, status, brand, features, country_code, timezone, locale)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'arena',
  'ARENA Performance',
  'custom',
  'active',
  jsonb_build_object(
    'colors', jsonb_build_object(
      'primary',   '#C2684A',
      'secondary', '#7A9E82',
      'accent',    '#4A6D88',
      'sand',      '#D4B483',
      'bg_light',  '#FAF6F1',
      'bg_dark',   '#0A0A0A'
    ),
    'logo', '/brand/arena-logo.svg',
    'fontFamily', 'Manrope, sans-serif',
    'name', 'ARENA Performance',
    'tagline', 'Guclu Ol. Kendine Guven.'
  ),
  jsonb_build_object(
    'aiWorkoutGenerator', true,
    'videoLibrary', true,
    'macroTracker', true,
    'parentPortal', true,
    'teamManagement', true,
    'whitelabel', true,
    'customDomain', true,
    'aiVideoGeneration', true,
    'contentAutomation', true
  ),
  'TR',
  'Europe/Istanbul',
  'tr'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- ============================================================================
-- ROLLBACK:
-- ============================================================================
-- BEGIN;
--   DROP FUNCTION IF EXISTS public.is_super_admin();
--   DROP FUNCTION IF EXISTS public.current_tenant_id();
--   DROP TABLE IF EXISTS public.tenant_audit_log CASCADE;
--   DROP TABLE IF EXISTS public.tenant_invites CASCADE;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS tenant_id;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS invited_by;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS invited_at;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS onboarded_at;
--   DROP TABLE IF EXISTS public.tenants CASCADE;
-- COMMIT;
