---
name: code-audit
description: 2026 React 19 + TS 5.6 + Supabase code audit. Triggers on review, bug, hata, güvenlik, security.
autoTrigger: true
---
# Code Audit — 2026 PT

## Stack (Locked)
React 19 + TS 5.6 + Vite 6 + Zustand 5 + Framer Motion 11 + Tailwind 3 + Supabase 2 + Cloudflare Pages

## Security (Critical)
- **XSS** — no `dangerouslySetInnerHTML`; input sanitize (DOMPurify) if HTML render
- **Secret leak** — `VITE_` client leak detect; `sk_live`, `Bearer`, `api_key` grep clean
- **API key** — edge proxy only (`functions/api/*`); client'ta YASAK
- **PIN/password** — SHA-256 + salt; client'ta plaintext YASAK
- **CSP** — Cloudflare `_headers`: script-src 'self' + nonce
- **RLS** — Supabase her tablo policy'li (public read/write YASAK)
- **postMessage** — origin allowlist check
- **Open redirect** — query-param allowlist

## TypeScript 5.6
- `any` YASAK; `unknown` + type guard
- `@ts-ignore` YASAK; `@ts-expect-error` + comment
- Explicit interface export
- Strict mode + `noUncheckedIndexedAccess`
- `satisfies` operator widening kontrol
- `const` type param inference
- `using`/`Symbol.dispose` cleanup

## React 19 Pattern
- `createPortal` modal/lightbox
- ErrorBoundary route-level
- `lazy + Suspense` heavy route
- **ref as prop** — forwardRef YASAK
- **Actions + useActionState** form
- **useOptimistic** instant UI
- **use() + Suspense** data fetch
- No inline object/arrow JSX prop
- Stable key (UUID), index YASAK
- Effect cleanup + AbortController

## Zustand 5
- Focused selector + shallow: `useStore(s => s.field, shallow)`
- Full-store subscribe (`useStore()`) YASAK
- Persist only essential (partialize)
- Action in store, not component

## Performance (Core Web Vitals v4)
- LCP ≤2.0s, INP ≤150ms, CLS ≤0.05
- Image: WebP/AVIF, width/height açık, `loading="lazy"`, `fetchpriority="high"` LCP
- React.lazy route + Suspense skeleton
- Bundle ≤180KB gzip initial
- CSS contain + content-visibility
- `prefers-reduced-motion` respect
- Debounce + useDeferredValue search

## i18n
- `t.section.key` pattern
- Hardcoded string YASAK
- 13 locale senkronu (CI check)
- RTL Arabic: `document.dir` + logical property
- Intl.PluralRules + DateTimeFormat + NumberFormat

## Accessibility (WCAG 2.2 AA)
- Semantic HTML
- `aria-label` icon button
- `role="dialog"` + focus trap modal
- Contrast ≥4.5:1
- Touch target ≥44x44px
- Keyboard nav + focus ring

## Supabase Realtime
- Single channel, cleanup `removeChannel`
- Exponential backoff reconnect
- Select only needed columns

## Anti-Pattern
- `console.log` prod
- `forwardRef` (deprecate)
- Barrel file re-export
- Inline obj/arrow JSX
- Nested ternary
- Magic number/string
- Unused import (noUnusedLocals)

## Audit Komutu
```bash
npm run audit:all
npm run lint:fix
npx tsc -b --force
```
