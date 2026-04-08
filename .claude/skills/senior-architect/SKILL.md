# Senior Architect Skill

Architecture decisions and patterns for PT platform.

## Architecture
- Frontend: React 19 SPA on Cloudflare Pages CDN
- API: Cloudflare Pages Functions (Edge Runtime)
- Database: Supabase PostgreSQL
- AI: LLM Council (Gemini, OpenRouter, DeepSeek)
- State: Zustand with persist middleware

## Key Decisions
- Zustand over Redux: simpler, less boilerplate, no provider
- Tailwind + CSS Variables: theme tokens for light/dark
- Multi-Provider AI Council: parallel drafts, adversarial critique, consensus
- Cloudflare Pages: Git deploys, global CDN, edge functions
- Custom i18n: 13 languages, key-based t.xxx pattern

## Component Organization
```
src/
  components/landing/  - Public sections
  components/admin/    - Coach dashboard
  components/portal/   - Client portal
  components/common/   - Shared (Toast, Skeleton)
  pages/admin/         - Admin routes
  stores/              - Zustand
  lib/                 - ai-council, supabase, exercises
  data/                - landingData
  locales/             - i18n translations
  config/              - Tenant config
```

## Constraints
- Edge compatible (no Node.js-only APIs)
- Bundle under 200KB gzipped
- WCAG AA accessibility
- Dark mode via CSS variables
