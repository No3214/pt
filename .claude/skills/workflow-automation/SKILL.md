---
name: workflow-automation
description: 2026 PT automation — Git, CI, content, deploy. Triggers on automation, ci, workflow, otomatik, pipeline.
---
# Workflow Automation — 2026 PT

## Git Workflow
- **main** auto-deploy → Cloudflare Pages
- **feat/xyz**, **fix/abc** branch → PR → review → merge squash
- **Conventional commit**: `type(scope): desc`
- Types: feat fix docs style refactor perf test chore ci build

## Build Scripts
```bash
npm run dev                # Vite HMR
npm run build              # production
npm run preview            # local prod test
npm run typecheck          # tsc -b --force
npm run lint               # ESLint
npm run lint:fix           # auto-fix
npm run format             # Prettier write
npm run test               # Vitest
npm run test:e2e           # Playwright
npm run audit:all          # full health
npm run pre-deploy         # TS + Lint + Build + Audit
```

## Pre-Deploy Pipeline (Automated)
1. `tsc -b --force` — 0 error
2. ESLint — 0 warning
3. Prettier check
4. `vite build` — success
5. Bundle ≤180KB gzip
6. i18n parity 13 dil
7. a11y axe-core
8. Security (secret grep, CSP check)
9. Images WebP + lazy + dimension
10. Lighthouse CI ≥95

## GitHub Actions (.github/workflows)

### ci.yml — PR gate
```yaml
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci --legacy-peer-deps
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npm run audit:i18n
```

### deploy.yml — main push
```yaml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: pt
          directory: dist
```

### lighthouse.yml — Performance gate
```yaml
on: [pull_request]
jobs:
  lighthouse:
    steps:
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: https://preview-${{ github.event.pull_request.number }}.pt.pages.dev
          budgetPath: ./lighthouse-budget.json
```

## Content Workflow (i18n)
1. Add Turkish text → `locales/tr.ts`
2. DeepL API auto-translate → EN, ES, FR, DE, IT, PT, RU, ZH, JA, KO, HI
3. Human review → AR (RTL)
4. `npm run audit:i18n` parity
5. Commit `feat(i18n): add key X`

## Client Onboarding (Automated)
1. Lead form submit → Supabase + n8n workflow
2. WhatsApp API auto-reply (welcome + link)
3. Admin notification Slack
4. Calendar auto-booking link
5. First session prep email (24h before)

## Deployment Flow
1. Feature branch local dev
2. `npm run dev` test
3. Commit + push feat/xyz
4. Open PR → CI runs
5. Review → approve
6. Squash merge main
7. Cloudflare auto-deploy (~2min)
8. Smoke test https://arena.kozbeylikonagi.com.tr
9. Monitor Sentry + Cloudflare Analytics

## n8n Automation (Self-Host)
- Lead capture → CRM (Supabase + Notion)
- Daily wellness reminder WhatsApp
- Weekly report auto-generate + email
- Booking 24h reminder email + SMS
- Payment received → Slack + invoice PDF

## AI Automation
- Training program auto-generate (AI Council)
- Wellness trend analysis weekly (Claude 4.7)
- Content draft (blog, Reels caption) — Sonnet 4.6
- Performance radar insight (DeepSeek R2)

## Monitoring Alerts
- Sentry error spike → Slack
- Cloudflare deploy fail → Slack
- Supabase RLS violation → email
- Lighthouse score drop <90 → PR comment

## Scheduled Tasks
- Daily: wellness digest email
- Weekly: client progress report
- Monthly: business metrics dashboard
- Quarterly: content audit + refresh

## Tooling
- **Husky** — pre-commit hook
- **lint-staged** — stage-only lint
- **release-please** — changelog + tag
- **Renovate** — dep update PR
- **n8n** — workflow orchestration
- **GitHub Actions** — CI/CD

## Anti-Pattern
- Manual deploy (use CI)
- Skip pre-deploy checks
- No smoke test post-deploy
- Secret in workflow file (use GitHub Secret)
- Hardcoded branch name (use `github.ref`)
