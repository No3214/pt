---
name: code-reviewer
description: 2026 code review checklist for PT. Triggers on review, audit, incele, denetle, güvenlik, PR.
autoTrigger: true
---
# Code Reviewer — 2026 (React 19 + TS 5.6 + Supabase)

## Security (Critical)
- **XSS guard** — `dangerouslySetInnerHTML` YASAK; gerekirse DOMPurify sanitize
- **Secret scan** — `VITE_` prefix olmayan env client'a sızıntı. `git grep -E "sk_live|api_key|Bearer"` temiz
- **PIN/password** — SHA-256 + salt; RLS policy Supabase tarafında
- **CSP headers** — Cloudflare `_headers`: script-src 'self' + nonce, no unsafe-inline
- **SRI** — CDN script'leri `integrity="sha384-..."` ile
- **Open redirect** — query-param `?redirect=` allowlist kontrol
- **postMessage** — origin check zorunlu
- **Supabase RLS** — her tablo policy'li (public read/write YASAK)

## TypeScript 5.6
- **`any` YASAK** — `unknown` + type guard veya discriminated union
- **Strict null** — `?.`, `??`, non-null `!` sadece ispatlı durumda
- **Exhaustive switch** — `default: return exhaustive(x)` ile `never` check
- **satisfies operator** — `const config = { ... } satisfies Config` (widening korunur)
- **const type parameters** — `function pick<const T extends string[]>(keys: T)`
- **Template literal types** — route tipi, i18n key validation
- **`using` declarations** — DB connection, subscription cleanup (Symbol.dispose)
- **noUncheckedIndexedAccess** — `arr[0]` → `T | undefined`

## React 19
- **'use client' minimal** — sadece interactive component
- **Actions + useActionState** form submit (native form action)
- **useOptimistic** optimistic UI (booking, wellness, macro log)
- **use() hook** promise consume + Suspense boundary
- **ref as prop** — `forwardRef` YASAK (deprecate)
- **No inline object/arrow** JSX prop (memo bozucu)
- **Stable keys** — UUID/slug, index YASAK
- **Effect cleanup + AbortController** — `signal` fetch'e geç
- **ErrorBoundary + reset** her route
- **React Compiler** uyumlu kod (memo/useMemo çoğu yerde gereksiz)

## Performance
- **Lazy route** — React.lazy + Suspense skeleton
- **Images** — WebP/AVIF, width/height açık, `loading="lazy"`, `fetchpriority="high"` LCP
- **Debounce + useDeferredValue** search
- **Virtualize** — 100+ item list (react-virtual / react-window)
- **Bundle** — initial ≤180KB gzip, route chunk ≤100KB
- **CSS contain** — scroll container'lara

## Core Web Vitals 2026
- **LCP** ≤2.0s (yeni hedef, 2.5s değil)
- **INP** ≤150s (FID deprecate; INP primary metric)
- **CLS** ≤0.05
- **TTFB** ≤600ms (Cloudflare edge)

## Accessibility (WCAG 2.2 AA)
- Semantic HTML (`<main>`, `<nav>`, `<article>`)
- `aria-label` icon button
- `role="dialog"` + `aria-modal="true"` + focus trap
- `prefers-reduced-motion` respect
- Color contrast ≥4.5:1 text, ≥3:1 UI
- Keyboard nav: Tab/Shift+Tab/Esc/Arrow
- Focus visible ring (outline YASAK, custom ring OK)
- Touch target ≥44x44px
- Screen reader: live region toast, alt text image

## i18n (PT 13 dil)
- Hardcoded string YASAK — `t.section.key`
- Yeni key 13 locale eksiksiz (CI kontrol)
- RTL: `document.dir` + logical property (margin-inline-start)
- Plural rule: Intl.PluralRules
- Date/number: Intl.DateTimeFormat + Intl.NumberFormat

## Anti-Patterns (Otomatik flag)
- `console.log` production (ESLint no-console)
- `// @ts-ignore` → `@ts-expect-error` + comment
- `!important` CSS (cascade bozar)
- Nested ternary (extract function)
- Magic number (named const)
- Unused import/var (noUnusedLocals/Parameters)
- `forwardRef` (React 19 deprecate)
- Barrel file `src/*/index.ts` re-export all
- Direct `window`/`document` access without guard (SSR break)
- Synchronous localStorage in render

## PT Özel Kurallar
- Zustand: `useStore(s => s.field, shallow)` pattern
- Framer Motion: transform + opacity only, `once: true`
- Supabase: realtime channel tek + cleanup
- i18n: useTranslation memoize
- Theme: dark/light token değişken, hardcoded renk YASAK

## PR Checklist
- [ ] typecheck: 0 error
- [ ] lint: 0 error
- [ ] build: pass
- [ ] Mobile 375px test
- [ ] 13 dil key eksik yok
- [ ] Lighthouse ≥95
- [ ] No new `any`, `@ts-ignore`
- [ ] No console.log
- [ ] a11y keyboard nav çalışıyor
