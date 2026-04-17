---
name: senior-architect
description: 2026 PT platform architecture decisions (React 19 + Cloudflare + Supabase). Triggers on architecture, mimari, sistem tasarımı, scalability.
---
# Senior Architect — 2026 PT

## Architecture Stack
- **Frontend**: React 19 SPA + Vite 6 + TS 5.6 — Cloudflare Pages CDN
- **Edge API**: Cloudflare Workers / Pages Functions (V8 isolates)
- **DB**: Supabase PostgreSQL 15 + RLS + pgvector
- **Realtime**: Supabase Realtime (WebSocket)
- **Storage**: Supabase Storage + Cloudflare R2 (media)
- **AI**: Multi-provider Council (Claude 4.7 + GPT-5 + Gemini 3 + DeepSeek R2)
- **State**: Zustand 5 + persist
- **Animation**: Framer Motion 11
- **Routing**: React Router 6 (SPA)
- **i18n**: Custom 13-lang loader

## Key Decisions (Trade-Off Documented)
- **Zustand > Redux Toolkit** — küçük API surface, no provider, devtools OK
- **Tailwind + CSS variables** — theme token runtime, dark/light native
- **Custom i18n > react-i18next** — küçük bundle, 13 dil lazy load
- **Cloudflare Pages > Vercel** — edge latency TR, $0 bandwidth
- **Supabase > Firebase** — Postgres (SQL + RLS), self-host option
- **Multi-AI Council > Single Provider** — hallucination ↓, consensus ↑

## Folder Structure (Enforced)
```
src/
  components/
    landing/           — public section (Hero, About, Programs, ...)
    portal/            — client-facing (StudentHome, Workout, ...)
    admin/             — coach dashboard
    common/            — shared (Toast, Modal, Skeleton)
    animations/3d/     — Spotlight, Card3D, ShineBorder
  pages/               — route component
    admin/             — /admin/*
    portal/            — /portal/*
  stores/              — Zustand slice
  lib/                 — ai-council, supabase, exercises, analytics
  data/                — landingData, exerciseLib
  locales/             — tr.ts, en.ts, ... (13 dil)
  hooks/               — useBookingsRealtime, useAnalytics, ...
  config/              — tenant, feature flags
  types/               — global TS types
functions/
  api/                 — Cloudflare edge function
```

## Constraints (Production)
- **Edge-compatible** — no Node-only API (fs, child_process). V8 isolate compat.
- **Bundle ≤180KB gzip** initial
- **WCAG 2.2 AA** accessibility
- **Core Web Vitals v4**: LCP ≤2.0s, INP ≤150ms, CLS ≤0.05
- **CSP strict** — no unsafe-inline
- **13 dil** parity
- **Mobile first** — 375px perfect

## Design Patterns
- **CQRS-lite** — read via selector hook, write via store action
- **Repository** — Supabase client isolate (`src/lib/db/`)
- **Adapter** — AI provider wrapper (swap vendor easily)
- **Feature flag** — config/featureFlags.ts + Cloudflare KV
- **Optimistic UI** — useOptimistic + rollback on failure

## Scalability Path
1. **Now**: 1k MAU, Cloudflare free tier
2. **10k MAU**: Cloudflare Pro + Supabase Pro ($25+$25)
3. **100k MAU**: Dedicated edge function, Supabase dedicated cluster
4. **1M+**: Multi-region Supabase read replica, Cloudflare Stream video

## Security Posture
- RLS every table
- PIN SHA-256 + salt
- API key edge-only
- CSP strict
- Rate limit middleware
- DDoS: Cloudflare auto

## Observability
- **Sentry** error + perf
- **Langfuse** AI call trace
- **Cloudflare Web Analytics** RUM
- **Supabase Logs** query slow

## Tech Debt Register
- [ ] Service Worker PWA cache strategy (currently naive)
- [ ] Virtual list 500+ student (react-virtual)
- [ ] Background sync — offline booking queue
- [ ] A/B test framework (PostHog)

## Decision Log Format (`docs/adr/`)
```
ADR-001: Zustand over Redux
Status: Accepted 2026-01-15
Context: ...
Decision: ...
Consequences: ...
```
