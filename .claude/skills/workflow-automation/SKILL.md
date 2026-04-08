# Workflow Automation Skill

Automate repetitive tasks for PT development.

## Git Workflows
- Auto-deploy: push to main triggers Cloudflare build
- Commit convention: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore

## Build Automation
```bash
npm run dev      # Local development (Vite HMR)
npm run build    # Production build
npm run preview  # Preview production build locally
```

## Pre-Deploy Checklist (Automated)
1. TypeScript: no errors (tsc --noEmit)
2. Lint: no warnings (eslint)
3. Build: succeeds (vite build)
4. Bundle: under 200KB gzipped
5. Images: all WebP, lazy loaded
6. i18n: no missing keys

## Content Workflow
1. Add Turkish text to landingData.ts
2. Add English translation
3. Update all 13 locale files
4. Test RTL for Arabic
5. Verify in dark mode

## Client Onboarding
1. Add lead via contact form or WhatsApp
2. Convert lead to client in admin
3. Set program, goals, sessions
4. Generate initial training program (AI Council)
5. Schedule first check-in

## Deployment
1. Code changes on feature branch
2. Test locally (npm run dev)
3. Merge to main
4. Cloudflare auto-deploys
5. Verify at pt.kozbeylikonagi.com.tr
