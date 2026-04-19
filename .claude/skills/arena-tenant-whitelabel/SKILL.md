---
name: arena-tenant-whitelabel
description: ARENA Performance'i farkli musteriler (sporcu kulubu, spor okulu, antrenor, studyo) icin white-label multi-tenant SaaS'a cevirme playbook. Tenant onboarding, custom subdomain, brand tokens (colors/logo/fonts), copy overrides, feature flags, data isolation (RLS tenant_id), billing per-tenant, DNS/CDN setup, domain verification, SSO, custom email sender. Monetization-ready. Tetikleyici: "white-label", "whitelabel", "tenant", "multi-tenant", "musteri", "reseller", "custom brand", "customer onboarding", "subdomain", "branding".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Tenant White-label Playbook

Hedef: ARENA cekirdegini 10–100 spor kulubune/koca'ya aylik ücretle satmak. Her musteri kendi markasi, sub-domain'i, kullanici tabani, odeme planiyla izole.

## 0) Iki Dagitim Modeli

### A — Shared Core, Subdomain per Tenant
- `koseli.arena.app`, `istanbulvoley.arena.app`
- Tek codebase, tek Supabase project, tenant_id ile izole
- Hizli scale; orta seviye custom
- Fiyat: 49 USD / 99 USD / 199 USD aylik (Starter / Pro / Elite)

### B — Full White-label, Custom Domain
- `performans.koseli.com.tr`
- Tenant'in kendi domain'i; DNS CNAME → CF Pages
- Branding tamamen gizli (ARENA yazisi yok)
- Fiyat: 499 USD / setup fee + 199 USD aylik

Ikisini ayni URL routing'le cozebiliriz (middleware).

## 1) Data Model

```sql
CREATE TABLE public.tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  domain text,              -- custom domain (optional)
  plan text NOT NULL DEFAULT 'starter',
  status text NOT NULL DEFAULT 'active', -- active | suspended | trial
  brand jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { colors, logo, fonts, ... }
  features jsonb NOT NULL DEFAULT '{}'::jsonb, -- feature flags
  created_at timestamptz DEFAULT now(),
  trial_ends_at timestamptz
);

-- Her user bir tenant'a baglanir
ALTER TABLE public.profiles ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
-- Her data satiri tenant_id tutar
ALTER TABLE public.workouts ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
-- vs.
```

### RLS Tenant Isolation

```sql
CREATE POLICY "tenant_isolated_read"
  ON public.workouts
  FOR SELECT
  USING (
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );
```

Veya daha performant: JWT claim'de tenant_id.

## 2) Domain Routing

### Cloudflare Pages — Custom Domain
1. Tenant admin panelinden domain eklendi (`performans.koseli.com.tr`)
2. CF Pages Custom Domain'e kaydet (API veya Dashboard)
3. Tenant CNAME ekler: `performans.koseli.com.tr CNAME arena.pages.dev`
4. Verification token (TXT record opsiyonel)
5. SSL otomatik

### App-level tenant detection
```ts
// src/lib/tenant.ts
export async function resolveTenant(): Promise<Tenant> {
  const host = window.location.hostname
  // 1) Subdomain match
  const sub = host.split('.')[0]
  if (host.endsWith('.arena.app')) {
    return fetchTenantBySlug(sub)
  }
  // 2) Custom domain
  return fetchTenantByDomain(host)
}
```

Server-side (CF Pages Function):
```ts
export async function onRequest({ request }) {
  const url = new URL(request.url)
  const tenant = await lookupTenant(url.hostname)
  if (!tenant) return new Response('Tenant not found', { status: 404 })
  // forward with header
  return fetch(request, { headers: { 'x-tenant-id': tenant.id } })
}
```

## 3) Brand Token Overlay

```ts
// src/lib/tenant-theme.ts
export function applyTenantTheme(tenant: Tenant) {
  const root = document.documentElement
  Object.entries(tenant.brand.colors).forEach(([k, v]) => {
    root.style.setProperty(`--color-${k}`, v as string)
  })
  if (tenant.brand.logo) {
    (document.querySelector('link[rel=icon]') as HTMLLinkElement).href = tenant.brand.logo
  }
  if (tenant.brand.fontFamily) {
    root.style.setProperty('--font-body', tenant.brand.fontFamily)
  }
}
```

Tailwind config:
```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary, #C2684A)',
      secondary: 'var(--color-secondary, #7A9E82)',
      // ...
    },
  },
},
```

Tenant brand jsonb ornek:
```json
{
  "colors": {
    "primary": "#1A5F7A",
    "secondary": "#159895",
    "accent": "#57C5B6"
  },
  "logo": "https://cdn.arena.app/t/koseli/logo.svg",
  "logoMark": "https://cdn.arena.app/t/koseli/mark.svg",
  "fontFamily": "Inter, sans-serif",
  "name": "Koseli Voleybol Akademisi",
  "tagline": "Gelecegin Sampiyonlari"
}
```

## 4) Copy Overrides (i18n)

Tenant bazinda belirli string'leri override et:

```ts
// tenant.copyOverrides.tr.json
{
  "hero": { "title": "Koseli Akademi — Gelecegin Sampiyonlari" },
  "footer": { "brand": "Koseli Akademi © 2026" }
}

// resolveTranslations
const base = locales[lang]
const overrides = tenant.copyOverrides?.[lang] ?? {}
const merged = deepMerge(base, overrides)
```

## 5) Feature Flags

```ts
// features jsonb
{
  "aiWorkoutGenerator": true,
  "videoLibrary": true,
  "macroTracker": false,
  "parentPortal": true,
  "teamManagement": false
}

// usage
if (tenant.features.aiWorkoutGenerator) {
  return <AIWorkoutGenerator />
}
```

Paketler:
- Starter: auth + workout log + basic chart
- Pro: + AI workout + video library + nutrition
- Elite: + parent portal + team management + white-label

## 6) Tenant Onboarding Akisi

1. Landing'de "Arena'yi deneyin" → onboarding form
2. Tenant adi, email, subdomain secimi (validation + unique)
3. 14-gun trial otomatik basliyor
4. Stripe customer create (odeme bilgisi trial sonunda alin)
5. Admin user davet edilir (magic link)
6. Brand wizard (logo + renk + tagline) — 5 dakika
7. `welcome.koseli.arena.app` → ilk giris

Onboarding DB akisi:
```sql
-- 1. tenant olustur
INSERT INTO tenants (slug, name, plan, trial_ends_at)
  VALUES ($1, $2, 'pro', now() + interval '14 days')
  RETURNING id;
-- 2. admin profile ekle
INSERT INTO profiles (id, tenant_id, role, email)
  VALUES (auth.uid(), $tenantId, 'admin', $email);
-- 3. audit log
INSERT INTO audit_events (tenant_id, action) VALUES ($tenantId, 'tenant_created');
```

## 7) Admin Panel (Super Admin)

Super admin (ARENA kendi) tum tenant'lari gorur:
- Tenant list + plan + revenue + usage
- Suspend / reactivate
- Override brand (support case'leri)
- Impersonation (audit log'lu)

## 8) Tenant Admin (Kulubun admin'i)

- Kullanici yonetimi (invite / suspend / role)
- Brand ayarlari
- Subscription yonetimi (Stripe Customer Portal)
- Export data (CSV / JSON)
- Audit log goruntule

## 9) Email Sender per Tenant

Default `hello@arena.app`. Tenant paid-plan'da kendi `hello@koseli.com` kullanabilir.

Resend / Postmark domain verify:
- DKIM record ekle (tenant DNS'ine)
- SPF: `v=spf1 include:_spf.arena.app ~all`
- Return-Path: `bounces.tenant.arena.app`

## 10) Data Export / Portability

GDPR + Turkiye KVKK:
- Kullanici data export: tum tablolar user_id filter → ZIP
- Tenant data export: tum tablolar tenant_id filter → ZIP (super admin only)
- Delete: soft-delete (status=deleted + cron 30-day hard delete)

## 11) SLA + Uptime

- 99.9% SLA garantisi (Elite plan)
- Status page: status.arena.app
- Incident communication: email + Slack (tenant admin slack webhook)

## 12) Billing Integration

Stripe subscription (arena-billing-stripe skill'i ile coordine):
- Trial 14 gun → auto-convert
- Metered usage (Elite): 100+ student → ek ucret
- Yearly plan %20 indirim
- Upgrade/downgrade pro-rated
- Cancel: hemen vs donem sonu

## 13) Analytics per Tenant

Mixpanel / Posthog tenant dimension:
```ts
posthog.identify(userId, { tenant_id: tenantId, plan: tenant.plan })
posthog.capture('workout_logged', { tenant_id: tenantId })
```

Super admin dashboard:
- MRR per tenant
- Active users per tenant
- Feature usage heatmap
- Churn prediction

## 14) Documentation per Tenant

Her tenant'a ozel help center: `help.koseli.arena.app/docs`
- Onboarding wizard
- Role-specific guide (coach / athlete / parent)
- Video tutorials (customizable)
- Support ticket link

## 15) Support Tiers

- Starter: email 48h response
- Pro: email 24h + Slack channel
- Elite: Slack + dedicated CS + phone

## 16) Legal / Compliance

Her tenant icin:
- ToS accept (onboarding)
- Privacy Policy (parametrize: tenant name, iletisim)
- Data Processing Agreement (Enterprise)
- KVKK aydinlatma metni (TR tenant'lar icin)
- GDPR (EU tenant'lar icin)

## 17) Production Checklist (Her Yeni Tenant)

- [ ] tenants row
- [ ] Admin user invited
- [ ] Custom domain (Pro+)
- [ ] DNS verified
- [ ] SSL active
- [ ] Brand applied
- [ ] Email sender configured
- [ ] Stripe subscription
- [ ] Welcome email sent
- [ ] Onboarding scheduled
- [ ] Feature flags applied per plan

## 18) Migration / Dedicated DB (Enterprise)

Ultra-Enterprise tenant'lar kendi Supabase project'i ister:
- Schema mirror
- Data migration tool (pg_dump + restore)
- Bolgesel hosting (EU, US, TR)

## 19) Code Org

```
src/
├── lib/
│   ├── tenant.ts           # resolve tenant
│   ├── tenant-theme.ts     # brand apply
│   ├── tenant-copy.ts      # i18n merge
│   └── tenant-features.ts  # feature flags
├── pages/
│   ├── super-admin/        # ARENA staff only
│   └── tenant-admin/       # kulup admin
├── components/
│   └── tenant/             # brand-aware components
└── config/
    └── tenant.schema.ts    # zod validation
```

## 20) Pricing Card Copy (satisciyla calismaya ornek)

- **Starter — 49 USD/ay**: 25 sporcu, temel workout log, basic chart, email destek
- **Pro — 99 USD/ay**: 100 sporcu, AI workout, video library, nutrition, Slack destek
- **Elite — 199 USD/ay**: Sinirsiz sporcu, white-label, team management, phone destek
- **Enterprise — Custom**: Dedicated DB, on-prem option, SLA, gerekirse ozel ozellik

14 gun trial, kredi karti gerekmez. Yillik %20 indirim.

## 21) Red Flags

- Tenant_id unutulmus query → cross-tenant leak (RLS kurtarir ama uretimde audit)
- Subdomain validation yetersiz → `admin.arena.app` kapmak
- Brand asset'larda XSS (user-uploaded SVG'de script)
- Stripe webhook verification yok → fake payment
- Custom domain cert expiration monitoring yok

---

Bu playbook'u izlersek: 10 tenant × 99 USD = 990 USD/ay MRR basina — 100 tenant'la 99k USD ARR teorik.
