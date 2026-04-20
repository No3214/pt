-- ============================================================================
-- ARENA Performance — Content Automation Schema
-- Iter 16: Activate arena-content-automation + arena-ai-video skills
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- content_briefs: Kullanici/admin tarafindan olusturulan icerik brief'leri
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_briefs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('blog','email','push','social_post','reel','hero_video','seo_page')),
  title text NOT NULL,
  goal text CHECK (goal IN ('awareness','consideration','conversion','retention','evangelism')),
  persona text,
  key_message text,
  brief jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','generating','review','approved','published','failed','cancelled')),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  publish_at timestamptz
);

CREATE INDEX IF NOT EXISTS content_briefs_status_idx ON public.content_briefs (status);
CREATE INDEX IF NOT EXISTS content_briefs_tenant_idx ON public.content_briefs (tenant_id);
CREATE INDEX IF NOT EXISTS content_briefs_publish_at_idx ON public.content_briefs (publish_at);

-- ---------------------------------------------------------------------------
-- content_drafts: LLM tarafindan uretilen locale-specific draft'lar
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_drafts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id uuid NOT NULL REFERENCES public.content_briefs(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('tr','en','ar','de','es','fr','it','nl','pl','pt','ru','uk','zh')),
  title text,
  body_md text,
  meta_description text,
  excerpt text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','reviewing','approved','rejected','published')),
  model text,
  prompt_id text,
  tokens_input int DEFAULT 0,
  tokens_output int DEFAULT 0,
  cost_usd numeric(10,4) DEFAULT 0,
  reviewer_id uuid REFERENCES auth.users(id),
  review_notes text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brief_id, locale)
);

CREATE INDEX IF NOT EXISTS content_drafts_status_idx ON public.content_drafts (status);
CREATE INDEX IF NOT EXISTS content_drafts_brief_idx ON public.content_drafts (brief_id);

-- ---------------------------------------------------------------------------
-- content_published: Platform'a yayinlanmis icerik referanslari + metrics
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_published (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id uuid NOT NULL REFERENCES public.content_drafts(id) ON DELETE CASCADE,
  platform text NOT NULL
    CHECK (platform IN ('blog','email','push','instagram','linkedin','x','tiktok','youtube','facebook','pinterest','threads')),
  external_id text,
  url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  metrics jsonb DEFAULT '{}'::jsonb,
  metrics_updated_at timestamptz,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS content_published_platform_idx ON public.content_published (platform);
CREATE INDEX IF NOT EXISTS content_published_tenant_idx ON public.content_published (tenant_id);
CREATE INDEX IF NOT EXISTS content_published_published_at_idx ON public.content_published (published_at DESC);

-- ---------------------------------------------------------------------------
-- ai_renders: Veo 3 / Imagen / SadTalker / Higgsfield render log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_renders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('veo3','imagen4','runway','higgsfield','sadtalker','hymotion','champ','luma','pika','sdxl','flux','elevenlabs')),
  prompt text NOT NULL,
  prompt_id text,
  params jsonb DEFAULT '{}'::jsonb,
  input_asset_url text,
  output_url text,
  duration_ms int,
  cost_usd numeric(10,4),
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','success','failed','cancelled')),
  error_message text,
  reviewer_id uuid REFERENCES auth.users(id),
  review_status text CHECK (review_status IN ('pending','approved','rejected')),
  review_notes text,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  brief_id uuid REFERENCES public.content_briefs(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS ai_renders_status_idx ON public.ai_renders (status);
CREATE INDEX IF NOT EXISTS ai_renders_kind_idx ON public.ai_renders (kind);
CREATE INDEX IF NOT EXISTS ai_renders_tenant_idx ON public.ai_renders (tenant_id);
CREATE INDEX IF NOT EXISTS ai_renders_created_at_idx ON public.ai_renders (created_at DESC);

-- ---------------------------------------------------------------------------
-- content_dlq: Dead-letter queue (3x retry sonrasi basarisiz briefler)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_dlq (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id uuid REFERENCES public.content_briefs(id) ON DELETE SET NULL,
  error_message text,
  error_stack text,
  retry_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- web_vitals: RUM data (arena-lighthouse skill uyumlu)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.web_vitals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL CHECK (name IN ('CLS','INP','LCP','FCP','TTFB','FID')),
  value numeric NOT NULL,
  rating text CHECK (rating IN ('good','needs-improvement','poor')),
  metric_id text,
  navigation_type text,
  url text,
  user_agent text,
  connection_type text,
  viewport_width int,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS web_vitals_name_idx ON public.web_vitals (name);
CREATE INDEX IF NOT EXISTS web_vitals_created_at_idx ON public.web_vitals (created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS: Tenant isolation + super admin override
-- ---------------------------------------------------------------------------
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_published ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_dlq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

-- content_briefs: admin only
CREATE POLICY content_briefs_admin_all ON public.content_briefs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin','super_admin','editor')
        AND (tenant_id = content_briefs.tenant_id OR role = 'super_admin')
    )
  );

-- content_drafts: mirror brief permissions
CREATE POLICY content_drafts_admin_all ON public.content_drafts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content_briefs b
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE b.id = content_drafts.brief_id
        AND p.role IN ('admin','super_admin','editor')
        AND (p.tenant_id = b.tenant_id OR p.role = 'super_admin')
    )
  );

-- content_published: public read, admin write
CREATE POLICY content_published_public_read ON public.content_published
  FOR SELECT
  USING (true);

CREATE POLICY content_published_admin_write ON public.content_published
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin','super_admin','editor')
    )
  );

-- ai_renders: admin only
CREATE POLICY ai_renders_admin_all ON public.ai_renders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin','super_admin','editor')
        AND (tenant_id = ai_renders.tenant_id OR role = 'super_admin')
    )
  );

-- content_dlq: super admin only
CREATE POLICY content_dlq_super_admin ON public.content_dlq
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- web_vitals: anonymous insert, admin read
CREATE POLICY web_vitals_anon_insert ON public.web_vitals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY web_vitals_admin_read ON public.web_vitals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin','super_admin')
    )
  );

-- ---------------------------------------------------------------------------
-- Helper views: Cost + performance analytics
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_content_cost_daily AS
SELECT
  date_trunc('day', created_at) AS day,
  count(*) AS drafts,
  sum(tokens_input + tokens_output) AS tokens,
  sum(cost_usd) AS cost_usd,
  count(DISTINCT brief_id) AS briefs
FROM public.content_drafts
GROUP BY 1
ORDER BY 1 DESC;

CREATE OR REPLACE VIEW public.v_ai_render_cost_daily AS
SELECT
  date_trunc('day', created_at) AS day,
  kind,
  count(*) AS renders,
  count(*) FILTER (WHERE status = 'success') AS success,
  count(*) FILTER (WHERE status = 'failed') AS failed,
  sum(cost_usd) AS cost_usd,
  avg(duration_ms) FILTER (WHERE status = 'success') AS avg_duration_ms
FROM public.ai_renders
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

COMMIT;

-- ============================================================================
-- ROLLBACK (manuel calistir gerekirse):
-- ============================================================================
-- BEGIN;
--   DROP VIEW IF EXISTS public.v_ai_render_cost_daily;
--   DROP VIEW IF EXISTS public.v_content_cost_daily;
--   DROP TABLE IF EXISTS public.web_vitals CASCADE;
--   DROP TABLE IF EXISTS public.content_dlq CASCADE;
--   DROP TABLE IF EXISTS public.ai_renders CASCADE;
--   DROP TABLE IF EXISTS public.content_published CASCADE;
--   DROP TABLE IF EXISTS public.content_drafts CASCADE;
--   DROP TABLE IF EXISTS public.content_briefs CASCADE;
-- COMMIT;
