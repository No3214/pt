# Quality Gates — Must-Pass Checks

Her atomic commit öncesi **sırasıyla** çalıştırılır. İlk fail'de dur,
fix et, gate'i tekrar çalıştır. 3 ardışık aynı fail → user'a rapor.

## Gate 1: TypeScript

```bash
npx tsc --noEmit
```

**Pass:** exit 0, zero error.
**Fail pattern:** `error TS\d+:`
**Auto-fix strategy:**
- Type import eksikse ekle
- any → proper type (infer from usage)
- Missing null check → optional chaining veya non-null assertion
  (dikkatli)
- Missing prop → interface'e ekle

## Gate 2: Lint

### ESLint v9 (flat config)
```bash
npx eslint . --max-warnings 0
```

### Biome (alternatif)
```bash
npx biome check .
```

**Pass:** exit 0.
**Auto-fix:**
- `npx eslint . --fix` (unsafe için `--fix-dry-run` önce)
- Import sort: `eslint-plugin-simple-import-sort`
- Unused import: `--fix` ile otomatik
- React hooks: manuel bak (dependency array)

## Gate 3: Format

```bash
npx prettier --check .
# fail → npx prettier --write .
```

veya Biome format:
```bash
npx biome format --write .
```

## Gate 4: Build

### Vite
```bash
npm run build
```

### Next
```bash
npm run build
```

**Pass:** exit 0, no errors (warnings OK ama not et).
**Fail pattern:** `Error:`, `Build failed`
**Common fixes:**
- Import path case mismatch (Windows/Linux)
- SSR import in client module
- Dynamic import missing `.default`
- Env var missing at build time

## Gate 5: Unit Tests

### Vitest
```bash
npx vitest run
```

**Pass:** all green, coverage ≥ %70 (hedef ama blocker değil).

## Gate 6: E2E Tests

### Playwright
```bash
npx playwright test --reporter=dot
```

**Pass:** all green.
**Skip conditions:** yok — E2E must pass.

## Gate 7: Accessibility

### Axe via Playwright
```bash
npx playwright test --grep @a11y
```

Her page smoke test'te:
```ts
test('homepage a11y', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
})
```

**Pass:** zero critical/serious violations.

## Gate 8: Bundle Budget

### size-limit
```bash
npx size-limit
```

`.size-limit.json`:
```json
[
  { "path": "dist/assets/index-*.js", "limit": "150 KB" },
  { "path": "dist/assets/*.css", "limit": "30 KB" }
]
```

**Pass:** all under limit.
**Fail fix:**
- Route-level code split
- Dynamic import heavy deps (chart, editor)
- Tree-shake unused exports
- Replace moment → date-fns / dayjs

## Gate 9: Performance (Lighthouse CI)

```bash
npx lhci autorun \
  --collect.numberOfRuns=3 \
  --collect.settings.preset=desktop \
  --assert.preset=lighthouse:recommended
```

`.lighthouserc.json` assertions:
```json
{
  "ci": {
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

## Gate 10: Security

```bash
npm audit --audit-level=high
```

**Pass:** zero critical/high.
**Fix:**
- `npm audit fix` (safe)
- `npm audit fix --force` (dikkatli — breaking olabilir)
- Transitive dep lock: `overrides` in package.json

## Gate 11: Dependency Freshness

```bash
npx npm-check-updates --errorLevel=2 --target=minor
```

**Pass:** no minor behind.
**Upgrade flow:**
- Patch + minor → otomatik `ncu -u && npm i`
- Major → rapor + changelog oku + test

## Gate 12: i18n Coverage (opsiyonel — proje varsa)

```bash
node scripts/check-i18n.mjs
```

Her locale dosyası aynı key sayısına sahip olmalı. Eksik key:

```
❌ locales/de.ts eksik keys: landing.hero.subtitle, portal.menu.logout
```

## Gate 13: Visual Regression (opsiyonel)

### Playwright screenshots
```bash
npx playwright test --update-snapshots=none
```

Pixel fark > %0.1 → fail.
Onaylı değişiklik için: `npx playwright test --update-snapshots`

## Gate Runner Script

Tek komutta hepsini çalıştır:

```bash
# scripts/gate.sh
set -e
echo "→ typecheck"    && npx tsc --noEmit
echo "→ lint"         && npx eslint . --max-warnings 0
echo "→ format"       && npx prettier --check .
echo "→ build"        && npm run build
echo "→ unit"         && npx vitest run
echo "→ e2e"          && npx playwright test --reporter=dot
echo "→ a11y"         && npx playwright test --grep @a11y
echo "→ bundle"       && npx size-limit
echo "→ audit"        && npm audit --audit-level=high
echo "✓ ALL GATES PASS"
```

`.bat` versiyonu Windows için:
```bat
@echo off
call npx tsc --noEmit || exit /b 1
call npx eslint . --max-warnings 0 || exit /b 1
call npx prettier --check . || exit /b 1
call npm run build || exit /b 1
call npx vitest run || exit /b 1
call npx playwright test --reporter=dot || exit /b 1
echo ALL GATES PASS
```

## Gate Failure Decision Tree

```
Gate fail?
├── Flaky? (retry 1x)
│   ├── Pass on retry → continue
│   └── Still fail → real failure
└── Real failure
    ├── Auto-fixable (format, lint --fix) → fix → rerun
    ├── Code fix needed → Edit → rerun
    └── Systemic (wrong dep version, missing tool) → rapor + user onay
```

## Pre-Push Hook

Her push öncesi `gate.sh` çalıştır:

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
bash scripts/gate.sh
```
