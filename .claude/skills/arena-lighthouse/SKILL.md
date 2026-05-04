---
name: arena-lighthouse
description: ARENA Performance icin Lighthouse 4x≥95 + Core Web Vitals playbook. LCP, INP, CLS, TBT, FCP optimizasyon teknikleri. Image (AVIF/WebP, srcset, priority hint), font loading (preload + font-display: swap), JS (code split, defer, treeshake), CSS (critical, purge), render blocking, SSR/SSG dusunceleri, bundle budget, runtime perf, RUM monitoring. Tetikleyici: "lighthouse", "performance", "cwv", "lcp", "inp", "cls", "bundle", "perf", "hiz", "psi", "pagespeed", "web vitals".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Lighthouse & CWV

Hedef: 4x mobile Lighthouse ≥ 95 (Perf / A11y / BP / SEO). Core Web Vitals yesil: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.

## 0) Tesshis Once

```bash
# Lokal audit
npx lighthouse https://arena-performance.com --preset=desktop --view
npx lighthouse https://arena-performance.com --form-factor=mobile --view

# Throttled network (slow 4G) mobile CWV proxy
```

Chrome DevTools > Lighthouse > Mobile + Performance + Accessibility.

PageSpeed Insights (field data): https://pagespeed.web.dev/report?url=https://arena-performance.com

## 1) LCP (Largest Contentful Paint) ≤ 2.5s

Tipik LCP: Hero gorseli / Hero baslik.

### Image
```tsx
<img
  src="/hero-mobile.avif"
  srcSet="/hero-mobile.avif 640w, /hero-tablet.avif 1024w, /hero-desktop.avif 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
  alt={t.hero.alt}
  fetchPriority="high"
  loading="eager"
  decoding="async"
  width={1920}
  height={1080}
/>
```

- AVIF > WebP > JPEG (boyut/kalite)
- `width`/`height` attribute zorunlu (CLS icin)
- `fetchPriority="high"` hero asset
- Diger gorseller `loading="lazy"`

### Preload critical
```html
<link rel="preload" as="image" href="/hero-desktop.avif" media="(min-width: 1024px)" fetchpriority="high">
<link rel="preload" as="font" href="/fonts/Manrope-Variable.woff2" type="font/woff2" crossorigin>
```

### Font
```css
@font-face {
  font-family: 'Manrope';
  src: url('/fonts/Manrope-Variable.woff2') format('woff2-variations');
  font-weight: 200 800;
  font-display: swap;
}
```

`swap` — FOIT yerine FOUT; LCP daha hizli gelir. Alternatif `optional` (slow connection'da default font kalir).

### CDN
CF Pages zaten CDN. Image'lar `public/` → CDN edge.

### LCP Element Dogrulama
```js
new PerformanceObserver(list => list.getEntries().forEach(e => console.log('LCP', e)))
  .observe({ type: 'largest-contentful-paint', buffered: true })
```

## 2) INP (Interaction to Next Paint) ≤ 200ms

Main thread bloklama = kotu INP.

### JS Blocking
- Long tasks > 50ms → break up
- `requestIdleCallback` / `scheduler.postTask` kullan
- React concurrent: `startTransition` heavy state update icin

```tsx
import { startTransition } from 'react'
const onClick = () => {
  setImmediate() // priority UI
  startTransition(() => {
    setExpensiveState(compute())
  })
}
```

### Event Handler
- Debounce input (300ms)
- Virtualize list (react-window) 100+ item
- Memoize children (`React.memo`, `useMemo`)

### CSS Contain
```css
.card { contain: layout paint; }
```

## 3) CLS (Cumulative Layout Shift) ≤ 0.1

### Kaynaklar
1. Resimde `width`/`height` yok
2. Dynamic inject (banner, ads)
3. Font swap buyuk metric farki

### Cozum
- Image `width`/`height` explicit (aspect-ratio)
- Font: `size-adjust` CSS descriptor eslestir
- Skeleton/Placeholder minHeight eklenmis (projede `<Placeholder h={600} />`)
- Absolute positioned overlay kullan (doc flow'u etkilemez)

### aspect-ratio
```css
.hero-img { aspect-ratio: 16 / 9; object-fit: cover; }
```

## 4) TBT (Total Blocking Time) & FID

- Bundle'i kucult (mevcut 250KB/chunk budget)
- Third-party deferred (analytics, chat)
- Hydration split: below-fold components Suspense

## 5) FCP (First Contentful Paint)

- Inline critical CSS (first ~14KB)
- Async defer non-critical JS
- CDN + HTTP/2 push (H2/3 auto)

## 6) Bundle Optimization

Mevcut pipeline:
- `manualChunks` vite.config.ts (router, react-vendor, framer, supabase, charts, forms, state, icons, date-fns, scroll, image-export, confetti, pdf-export, email, vendor)
- `scripts/audit-bundle.ts` 250KB eager budget

### Tree-shake bilgi
- `import { X } from 'lodash'` YASAK → `import X from 'lodash/X'`
- Default export yerine named (tree-shake)
- Side-effect free: `"sideEffects": false` package.json

### Dynamic import
```tsx
const Heavy = lazy(() => import('./Heavy'))
<Suspense fallback={<Skeleton />}><Heavy /></Suspense>
```

## 7) CSS

- Tailwind purge (mevcut)
- Critical CSS: `@tailwindcss/critical` veya manual extract
- Avoid `@layer base` bloat — only what used

### Kullanilmayan CSS kesfet
```bash
npx purgecss --css dist/assets/*.css --content dist/**/*.html dist/assets/*.js
```

## 8) JS Prefetch / Preload

```html
<link rel="modulepreload" href="/assets/portal.js">
<link rel="prefetch" href="/assets/gallery.js">
```

Router navigation tahmini: mouse hover link → prefetch chunk.

## 9) HTTP/3 + Brotli

CF Pages default HTTP/3 + Brotli. Kontrol:
```bash
curl -I --http3 https://arena-performance.com
```

Response: `alt-svc: h3=":443"`, `content-encoding: br`.

## 10) RUM (Real User Monitoring)

```ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

const send = (metric: any) => {
  navigator.sendBeacon('/analytics/vitals', JSON.stringify(metric))
}

onCLS(send); onINP(send); onLCP(send); onFCP(send); onTTFB(send)
```

Supabase'a topla:
```sql
CREATE TABLE IF NOT EXISTS public.web_vitals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text, value numeric, rating text, id text, nav_id text, url text,
  user_agent text, created_at timestamptz DEFAULT now()
);
```

## 11) SEO

Lighthouse SEO 100:
- `<title>` + `<meta name="description">`
- `lang` attribute
- `<link rel="canonical">`
- hreflang (i18n)
- Structured data (JSON-LD): Organization, LocalBusiness, BreadcrumbList

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ARENA Performance",
  "url": "https://arena-performance.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Turkey" }
}
</script>
```

## 12) Best Practices (Lighthouse)

- HTTPS only
- No console errors
- `Content-Security-Policy` header
- Dogru `charset`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Referrer policy

## 13) Perf Budget CI

`scripts/audit-bundle.ts` gate'i zaten var. Ek olarak Lighthouse CI:

```yaml
# .github/workflows/lhci.yml
- run: npm ci && npm run build
- run: npx lhci autorun --config=lighthouserc.json
```

`lighthouserc.json`:
```json
{
  "ci": {
    "collect": { "url": ["http://localhost:4173/", "http://localhost:4173/portal"], "numberOfRuns": 3 },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

## 14) Red Flags

- LCP element `loading="lazy"` — LCP 2x gecikir
- `display: none` -> `block` → yeni LCP (layout shift)
- Google Fonts `@import` — render blocking
- Large GIF → video (`<video autoplay muted playsInline>`)
- Too many @media layer — CSSOM buyuk
- `document.write` — critical path kirilir

## 15) Quick Wins

1. Hero image AVIF + preload + fetchpriority=high
2. Font `font-display: swap` + preload woff2
3. Below-fold JS `defer` + `lazy` (Landing mevcut patterninde var)
4. Remove synchronous third-party (chat widget defer)
5. CSS minify + gzip/brotli
6. Enable HTTP/3 (CF default)

## 16) Monitoring

- PageSpeed Insights weekly
- Chrome UX Report (CrUX)
- RUM dashboard Supabase
- Lighthouse CI per PR

## 17) Portal Ozel

Portal login sonrasi heavy — ama auth-gated = direct-entry trafik yok. LCP target burada gevsek (3s OK). Landing kritik: arama motoru + kampanya trafigi.

## 18) Mobile Strateji

- Mobile CSS first (Tailwind default)
- Touch target ≥ 44×44px
- No hover-only functionality
- Gesture support: swipe carousel

## 19) Edge Function Perf

CF Pages Functions / Supabase Edge:
- Cold start minimize: Deno Deploy / CF Workers
- Cache response 5m TTL
- Gzip/Brotli otomatik

## 20) Final Gate Tablosu

| Metric | Mobile | Desktop |
|---|---|---|
| Performance | ≥ 95 | ≥ 98 |
| Accessibility | ≥ 95 | ≥ 95 |
| Best Practices | ≥ 95 | ≥ 100 |
| SEO | ≥ 95 | ≥ 100 |
| LCP | ≤ 2.5s | ≤ 1.8s |
| INP | ≤ 200ms | ≤ 150ms |
| CLS | ≤ 0.1 | ≤ 0.05 |

Her release'de bu tabloyu doldur → regression görünce iterasyon aç.
