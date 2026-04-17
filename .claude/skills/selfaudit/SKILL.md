---
name: selfaudit
description: 2026 pre-commit self-review PT (React 19 + TS 5.6). Triggers on selfaudit, self-review, kendi kontrol, son kontrol.
---
# Self Audit — 2026 Pre-Commit

## Pipeline
```bash
git diff HEAD
git status --short
npx tsc -b --force
npm run lint
npm run audit:i18n
```

## Per File Review
Her değişen dosyada:

### TypeScript 5.6
- [ ] No `any` introduced (`unknown` + type guard)
- [ ] No `@ts-ignore` (use `@ts-expect-error` + comment)
- [ ] `satisfies` where widening risk
- [ ] `noUncheckedIndexedAccess` respect (arr[0] → T | undefined)
- [ ] Exhaustive switch with `never` check

### React 19
- [ ] No `forwardRef` (ref as prop)
- [ ] No inline obj/arrow JSX prop
- [ ] Stable key (UUID, not index)
- [ ] Effect cleanup + AbortController
- [ ] `memo()` only when profiled
- [ ] ErrorBoundary around async/risky

### Security
- [ ] No `dangerouslySetInnerHTML` (sanitize if must)
- [ ] No secret/API key (grep `sk_live`, `Bearer`, `api_key`)
- [ ] No unescaped user input in HTML
- [ ] CSP compatible (no `unsafe-inline`)

### i18n
- [ ] No hardcoded string (use `t.xxx`)
- [ ] New key in all 13 locale files
- [ ] RTL Arabic handled (logical CSS)

### Performance
- [ ] Image: WebP/AVIF, width/height, loading="lazy"
- [ ] Route lazy + Suspense
- [ ] Debounce + useDeferredValue search
- [ ] No bundle bloat (audit:bundle)

### A11y (WCAG 2.2 AA)
- [ ] Semantic HTML
- [ ] `aria-label` icon button
- [ ] Focus visible ring
- [ ] Keyboard navigation
- [ ] Contrast ≥4.5:1

### Code Quality
- [ ] No `console.log` prod
- [ ] No commented-out code
- [ ] No magic number/string
- [ ] Function ≤30 lines
- [ ] Component ≤150 lines

## Git Hygiene
- [ ] Import paths correct
- [ ] No unused import (noUnusedLocals)
- [ ] No `.env` / secrets tracked
- [ ] Commit message convention: `type(scope): desc`
- [ ] Branch naming: `feat/xyz`, `fix/abc`

## Final Commands
```bash
npx tsc -b --force                    # 0 error
npm run lint                           # 0 error
npm run build                          # pass
npm run audit:i18n                     # parity
```

## Present Before Commit
- **Changed files**: list
- **Findings**: severity + line + fix
- **Green light**: all checks pass → ready to commit
- **Red light**: critical issue → fix first

## Anti-Pattern Auto-Flag
- `console.log`
- `any` type
- `@ts-ignore`
- `forwardRef`
- Hardcoded string
- Index as key
- Inline obj/arrow JSX
- Missing key in .map
- Missing `loading="lazy"` on image
- Missing width/height on image
