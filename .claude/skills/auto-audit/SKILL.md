---
name: auto-audit
description: 2026 one-command PT health check. Triggers on audit, check, kontrol, health, hata tara.
autoTrigger: true
---
# Auto Audit — One Command Health

## Komutlar
```bash
npm run audit:all          # tüm audit tek seferde
npm run auditcodex          # cross-AI review
npm run audit:i18n          # 13 dil key eksikliği
npm run audit:a11y          # WCAG 2.2 AA
npm run audit:security      # XSS + secret + CSP
npm run audit:seo           # on-page + schema
npm run audit:bundle        # size + duplicate dep
npm run audit:images        # WebP + lazy + dimension
npm run audit:quality       # ESLint + Prettier
npm run audit:vitals        # Core Web Vitals v4 simulate

npm run fix:a11y            # auto-fix a11y
npm run fix:images          # convert PNG/JPG → WebP/AVIF
npm run fix:i18n            # stub missing keys
```

## Pre-Deploy Pipeline
```bash
npm run pre-deploy
```
Sırası:
1. `tsc -b --force` (TS 5.6 strict)
2. ESLint (react-hooks + @typescript-eslint)
3. Prettier check
4. i18n completeness (13 dil)
5. a11y (axe-core)
6. security (envdetector, grep secret pattern)
7. bundle (≤180KB gzip initial)
8. `vite build`
9. Lighthouse CI (score ≥95)

## Gate (Fail-Fast)
- typecheck error > 0 → FAIL
- i18n missing > 0 → FAIL
- a11y violation > 0 → FAIL
- bundle size > 180KB gzip → FAIL
- security leak tespit → FAIL

## Auto-Audit Raporu
`audit-report.json` output:
- Severity dağılımı
- Trend (önceki run ile kıyas)
- New issue vs regression
- ETA to fix (AI estimate)

## CI Integration
GitHub Actions `.github/workflows/audit.yml`:
- PR opened → tüm audit
- main push → pre-deploy + Lighthouse CI

## PT Özel
- Cloudflare `_headers` CSP test
- Supabase RLS policy check
- 13 locale senkronu
- React 19 pattern compliance (no forwardRef, ref as prop)
