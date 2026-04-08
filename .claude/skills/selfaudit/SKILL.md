---
name: selfaudit
description: Self-audit recent changes before committing. Triggers on selfaudit, self-review, kendi kontrol, son kontrol.
---
# Self Audit — Pre-Commit Review

## Process
1. Run `git diff HEAD` to see all pending changes
2. For EACH changed file, verify:
   - No `any` types introduced (TypeScript)
   - No XSS vectors (unescaped user input)
   - No hardcoded strings (should use i18n)
   - No missing error handling (try/catch, ErrorBoundary)
   - No performance regressions (missing memo, lazy, loading=lazy)
   - No accessibility issues (missing alt, aria-label, role)
3. Check import paths are correct
4. Verify no secrets/API keys in code
5. Confirm changes compile: `npx tsc --noEmit`
6. Present findings and recommend fixes before commit