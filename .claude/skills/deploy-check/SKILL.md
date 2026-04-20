---
name: deploy-check
description: 2026 Cloudflare Pages pre-deploy PT. Triggers on deploy, build, push, yayınla.
autoTrigger: true
---
# Deploy Check — 2026 PT (Cloudflare Pages)

## Pre-Deploy Pipeline (Fail-Fast)
```bash
# 1. Type safety
npx tsc -b --force                  # TS 5.6 strict, composite

# 2. Lint
npm run lint                         # ESLint react-hooks + @typescript-eslint

# 3. Format
npm run format:check                 # Prettier

# 4. Install sync
npm ci                               # .npmrc: legacy-peer-deps=true

# 5. i18n completeness
npm run audit:i18n                   # 13 locale key parity

# 6. a11y
npm run audit:a11y                   # axe-core

# 7. Security
npm run audit:security               # secret leak + XSS grep

# 8. Bundle
npm run audit:bundle                 # ≤180KB gzip initial

# 9. Build
npm run build                        # vite build → /dist

# 10. Lighthouse CI
npm run lighthouse                   # score ≥95
```

## Cloudflare Pages Config
- **Build cmd**: `npm run build`
- **Output dir**: `/dist`
- **NODE_VERSION**: `20`
- **Build system**: v3 (2026 latest)
- **Framework preset**: Vite
- **Functions dir**: `functions/` (edge runtime)
- **Env var**: Supabase URL/ANON_KEY + AI provider secrets (encrypted)

## Headers (`public/_headers`)
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{NONCE}'; ...
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## Redirects (`public/_redirects`)
```
/admin-eski  /admin  301
/blog/*      /:splat  200
```

## Common Gotcha
- **ERESOLVE** → `.npmrc` → `legacy-peer-deps=true`
- **Lock mismatch** → `npm install --legacy-peer-deps` → commit `package-lock.json`
- **Bundle >25MB** → split manual chunk, remove large dep
- **CSP block** → allowlist Supabase + Cloudflare analytics
- **Route 404** → SPA fallback `/_redirects`: `/*  /index.html  200`
- **Edge API 500** → `functions/` no Node-only API (crypto.subtle ok, fs YASAK)

## Deploy Verification
```bash
curl -I https://pt.kozbeylikonagi.com.tr | grep -E "HTTP|Cache|CSP"
# Status 200, Cache-Control, CSP present
```

## Rollback
Cloudflare Pages dashboard → Deployments → previous → Promote

## Smoke Test Post-Deploy
- Landing load
- Admin PIN login (ela2026)
- Portal access
- AI chat basic query
- Language switcher TR→EN
- Dark mode toggle
- Contact form submit

## Performance Gate
- LCP ≤2.0s (WebPageTest simulated 4G)
- INP ≤150ms (real user)
- CLS ≤0.05
- Lighthouse ≥95
- TTFB ≤600ms (Cloudflare edge)
