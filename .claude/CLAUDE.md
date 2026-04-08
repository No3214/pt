# Ela Ebeoğlu PT — Development Context

## Project Overview
Personal Trainer web platform for Ela Ebeoğlu Performance.
- **Stack**: React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 3
- **State**: Zustand 5 with persist middleware
- **i18n**: 13 languages (TR, EN, ES, FR, DE, IT, PT, RU, ZH, JA, AR, KO, HI)
- **Deploy**: Cloudflare Pages (Git integration from `main` branch)
- **AI Proxy**: Cloudflare Pages Functions (`functions/api/ai.ts`)
- **Backend**: Supabase (leads, measurements)
- **PWA**: vite-plugin-pwa with ReloadPrompt

## Communication Style
me talk short. no filler. tool first, result first. me stop.
drop articles. "me fix code" not "I will fix the code".
shorter response always better. concise only.
run tools first, show results, then stop. no narration.
## Architecture
```
src/
├── components/landing/    # 12 landing sections
├── components/admin/      # Admin dashboard
├── components/portal/     # Student portal (20+ widgets)
├── pages/admin/           # Admin routes
├── pages/portal/          # Portal routes
├── stores/                # Zustand (useStore, studentAuth, studentPortal)
├── lib/                   # ai-council.ts, animations, constants, supabase
├── locales/               # 13 language files
├── config/tenant.ts       # Brand colors/contact
functions/api/ai.ts        # Cloudflare Pages Function (AI proxy)
```

## LLM Council System
Multi-provider AI: Gemini, OpenRouter, DeepSeek
Pipeline: Parallel drafts → Adversarial critique → Consensus synthesis
Domain-aware: nutrition, training, assessment, wellness
Anti-hallucination: strict system prompts on every call

## Key Conventions
- Turkish primary language; system prompts in Turkish
- XSS: `.replace(/[<>]/g, '')` on all user inputs
- Auth: SHA-256 hashed PIN
- Colors: Terracotta #C2684A, Sage #7A9E82, Coast #4A6D88
- Animations: Framer Motion whileInView scroll reveals
- Build: `npm run build` (tsc -b && vite build)
- `.npmrc`: legacy-peer-deps=true (Cloudflare compat)
- NODE_VERSION=20 on Cloudflare dashboard