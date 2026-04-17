# ARENA Performance

Elite voleybol ve performans koçluk sistemi — **Güçlü ol. Kendine güven.**

Built with **Vite 6 + React 19 + TypeScript 5 + Tailwind 3 + Zustand 5 + Supabase 2**.

Live: https://arena.kozbeylikonagi.com.tr
Deployed on **Cloudflare Pages** with edge-native AI proxy functions.

## 🏗️ Architecture

```
src/
├── components/       # Reusable UI components
│   ├── admin/        # Dashboard, KPI, Charts, CRM widgets
│   ├── landing/      # Landing page sections (Hero, Services, Contact)
│   └── portal/       # Client portal (Habits, Food, Gamification)
├── config/           # Tenant branding & theme configuration
├── lib/              # Utilities, AI client, Supabase client, Zod schemas
├── locales/          # i18n (13 dil: tr, en, es, fr, de, it, pt, ru, zh, ja, ko, ar, hi)
├── pages/            # Route-level page components
│   └── admin/        # Admin panel pages (Dashboard, Clients, Leads, etc.)
├── stores/           # Zustand state management
└── App.tsx           # Root router & theme injection
functions/
└── api/ai.ts         # Cloudflare Pages Function — secure AI proxy
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

| Variable | Description |
|----------|-------------|
| `GEMINI_KEY` | Google Gemini API key (Cloudflare env) |
| `OPENROUTER_KEY` | OpenRouter API key (Cloudflare env) |
| `DEEPSEEK_KEY` | DeepSeek API key (Cloudflare env) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

> **Note:** AI keys are server-side only (Cloudflare Workers environment variables). They never reach the browser.

## 🛡️ Security

- **CORS Hardening:** `/api/ai` endpoint rejects requests from unknown origins
- **Provider Allowlist:** Only `gemini`, `openrouter`, `deepseek` accepted
- **Payload Limit:** Prompts capped at 3000 characters
- **XSS Sanitization:** All user input sanitized before storage
- **CSP Headers:** Configured via `build/_headers` for Cloudflare Pages
- **Admin Auth:** SHA-256 hashed PIN verification

## 📦 Bundle Strategy

Heavy dependencies are code-split into separate chunks:

| Chunk | Contents |
|-------|----------|
| `vendor` | React, ReactDOM, React Router |
| `charts` | Recharts |
| `motion` | Framer Motion |
| `forms` | React Hook Form, Zod, Resolvers |
| `state` | Zustand |

Admin pages are lazy-loaded to minimize initial bundle.

## 🧪 Testing

```bash
# E2E tests (requires Playwright browsers)
npx playwright install
npm run test:e2e
```

## 📡 Deployment

Automatically deployed to Cloudflare Pages on push to `main`.

CI pipeline runs: `typecheck → lint → build`

## 📄 License

Private — All rights reserved.
