---
name: smart-commit
description: 2026 conventional commit + pre-commit audit PT. Triggers on commit, push, git.
---
# Smart Commit — 2026 PT

## Pre-Commit
```bash
npm run audit:all
npx tsc -b --force
npm run lint
npm run audit:i18n
```

## Conventional Commit
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- **feat** — yeni özellik (MINOR version bump)
- **fix** — bug fix (PATCH bump)
- **docs** — sadece docs
- **style** — format/whitespace (no code change)
- **refactor** — refactor (no feat/fix)
- **perf** — performance
- **test** — test ekleme/düzeltme
- **chore** — build/tooling/deps
- **ci** — CI config
- **build** — build system (Vite, npm script)
- **revert** — geri alma

**BREAKING CHANGE** footer → MAJOR version bump.

## Scopes (PT)
- `admin` / `portal` / `landing`
- `i18n` / `a11y` / `seo`
- `ai` (council)
- `auth`
- `db` (Supabase)
- `edge` (functions/)
- `ui` / `motion`
- `deploy`

## Örnekler
```
feat(landing): add Spotlight + Card3D + ShineBorder 3D components

Integrated three-free 3D components into Hero, Programs, BookingCTA.
Added SVG radial spotlight, CSS 3D tilt card, conic gradient border.

Closes #123

---

fix(ai): prevent hallucination in training plan generation

Added confidence score threshold and fallback prompt for low-quality drafts.

---

perf(portal): lazy load WellnessTracker + PerformanceRadar

Reduces initial portal bundle by 45KB gzip.

---

refactor(i18n): migrate 13 locale files to satisfies operator

Widening guard + better TS inference.

BREAKING CHANGE: Translations type now stricter, may fail existing consumers.
```

## Rules
- Subject ≤72 char, imperative (`add` not `added`)
- No emoji prod commit (Yunuscan kuralı)
- Body ≥3 line if complex change
- `Closes #N` / `Refs #N` issue link
- Sign-off opsiyonel

## Git Flow
- **main** — production (auto-deploy Cloudflare)
- **feat/xyz** — feature branch
- **fix/abc** — bugfix
- **chore/updates** — maintenance
- **release/vX.Y.Z** — version prep

## Anti-Pattern
- `.env` / secret commit (`.gitignore` check)
- `WIP` commit main'e merge
- Force push shared branch (`--force-with-lease` safer)
- `git add .` gözden geçirmeden
- Merge commit main'de (rebase + squash tercih)

## Hooks (Husky + lint-staged)
```json
// .husky/pre-commit
npm run lint-staged

// package.json
"lint-staged": {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md}": ["prettier --write"]
}
```

## Commit Message Helper
```bash
# .gitmessage template
npm run commit    # commitizen prompt
```

## Release
```bash
npm version minor   # patch|minor|major
git push --tags
# GitHub Release + changelog auto (release-please)
```

## Branch Protection (main)
- Require PR review ≥1
- Require status check (typecheck + lint + build + Lighthouse CI)
- Require up-to-date
- No direct push to main
