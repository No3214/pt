# Modern Stack 2026 — Piyasa Referans Noktası

Bu dosya "güncel" demenin ne anlama geldiğini tanımlar. Stack bundan
≤1 minor gerideyse "fresh", 2+ minor gerideyse "upgrade", major
gerideyse "migrate planı yap".

## Frontend Core

| Paket | 2026 Q2 stable | Notlar |
|---|---|---|
| React | 19.x | useOptimistic, useFormStatus, useActionState, ref as prop |
| TypeScript | 5.6+ | isolatedDeclarations, NoInfer, const type params |
| Next.js | 15.x | Async Request APIs, PPR stable, after() |
| Vite | 6.x | Environment API, Rolldown experimental |
| Tailwind CSS | 4.x | CSS-first, @theme, @source, OKLCH, container queries |
| ESLint | 9.x flat config | eslint.config.js, @eslint/js, typescript-eslint 8+ |
| Biome | 1.9+ | drop-in ESLint+Prettier alternative |
| Prettier | 3.3+ | tailwindcss plugin 0.6+ |
| Bun | 1.1+ | workspaces, lockb format v1 |
| pnpm | 10.x | package extensions, workspace catalogs |

## React Ecosystem

| Paket | 2026 stable | Replaces |
|---|---|---|
| TanStack Query | v5.x | React Query v4 |
| TanStack Router | v1 stable | react-router v6 (type-safe) |
| Zustand | 5.x | slices pattern, immer middleware optional |
| Jotai | 2.x | atomic primitives |
| Redux Toolkit | 2.x | RTK Query |
| React Hook Form | 7.x | zod resolver |
| Framer Motion | 12.x | LazyMotion, layout animations, motion/react |
| Radix UI | 1.1+ | primitives için |
| shadcn/ui | v4 | Tailwind 4 + Radix + CLI |
| Lucide React | latest | icon set |

## Backend / Data

| Paket | 2026 stable | Notlar |
|---|---|---|
| Supabase JS | 2.x | RLS + Realtime + Edge Functions |
| Drizzle ORM | 0.36+ | migrate, seed, studio |
| Prisma | 5.x | migrations + client |
| Turso | libsql 0.5+ | edge SQLite |
| Neon | serverless pg | branching |
| tRPC | 11.x | HTTP streaming, links |
| Hono | 4.x | edge-first |
| Fastify | 5.x | plugin architecture |

## Build / Deploy

| Araç | Best Practice 2026 |
|---|---|
| Vercel | Framework Inference + Edge Config + KV |
| Cloudflare Pages + Workers | Workers-native build, DURABLE OBJECTS, D1 |
| Netlify | Functions v2, Edge Functions, Blobs |
| Railway | Nixpacks, sleep/wake, metrics |
| Fly.io | Machines v2, Postgres |
| GitHub Actions | reusable workflows, OIDC to cloud |
| Turbo | 2.x remote cache, parallel tasks |

## Testing

| Paket | 2026 stable | Kapsam |
|---|---|---|
| Vitest | 2.x | unit + component |
| Playwright | 1.48+ | E2E + a11y + visual + CT |
| Testing Library | 16.x | React 19 compat |
| MSW | 2.x | request interception |
| Storybook | 8.x | CSF 3, interaction tests |
| Chromatic | — | visual regression |
| Axe-core | 4.10+ | a11y audit |
| size-limit | 11.x | bundle budget |
| Lighthouse CI | 0.14+ | perf gate |

## Observability

| Servis/Paket | Use case |
|---|---|
| Sentry | error tracking + tracing |
| PostHog | product analytics + feature flags + session replay |
| Plausible / Umami | privacy-first web analytics |
| Axiom / Logtail | structured logs |
| Statuspage / BetterStack | uptime + incident |

## Design Patterns 2026

### React Server Components + Server Actions
```tsx
// Server Component (async, no "use client")
async function Page() {
  const data = await db.query(...)
  return <Client data={data} />
}
```

### Optimistic Updates with useOptimistic
```tsx
const [optimistic, addOptimistic] = useOptimistic(messages)
async function action(formData) {
  addOptimistic({ text: formData.get('text'), pending: true })
  await sendMessage(formData)
}
```

### React Compiler (auto-memoization)
- `babel-plugin-react-compiler` yapılandırıldıysa manuel `memo`,
  `useMemo`, `useCallback` çoğunlukla gereksiz
- ESLint plugin: `eslint-plugin-react-hooks` + compiler rules

### Tailwind v4 Config (CSS-first)
```css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(55% 0.12 27);
  --font-display: "Geist", sans-serif;
  --breakpoint-3xl: 120rem;
}
```

### Streaming SSR + Suspense boundaries
```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

### Partial Pre-Rendering (Next 15)
```tsx
export const experimental_ppr = true
```

### Typed Env (Zod)
```ts
// env.mjs
import { z } from "zod"
export const env = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
}).parse(process.env)
```

### Error Boundaries + Suspense pattern
- Her route segment'te `error.tsx` + `loading.tsx`
- Top-level `ErrorBoundary` + Sentry integration

## Performance Targets 2026

| Metrik | Hedef (mobil, 4G) |
|---|---|
| LCP | ≤ 1.8s (p75) |
| CLS | ≤ 0.05 |
| INP | ≤ 200ms |
| FCP | ≤ 1.2s |
| TTI | ≤ 3.5s |
| Lighthouse Perf | ≥ 95 |
| Lighthouse A11y | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 100 |
| Initial JS (gzipped) | ≤ 150KB |
| Main route total (gzipped) | ≤ 250KB |

## A11y Targets (WCAG 2.2 AA)

- Kontrast: normal 4.5:1, large 3:1
- Focus visible: 2px + 2px offset outline
- Skip links
- ARIA sadece gerekirse — semantic HTML first
- Reduced motion: `prefers-reduced-motion` respect et
- Form labels: `<label for>` veya `aria-label`
- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- Heading hierarchy: `<h1>` tek, sonra sıralı
- Color-only information yasak
- Min touch target: 44×44 CSS px

## SEO Targets

- Sitemap.xml + robots.txt
- OpenGraph + Twitter Cards (og:image 1200×630)
- JSON-LD structured data (Organization, Product, Article, FAQ)
- Canonical tags
- hreflang (i18n projeler)
- Server-rendered HTML (SSR/SSG/PPR)
- Image alt text (all)
- Descriptive link text (no "click here")
- 301 redirect planı
- Page weight ≤ 1MB total
