---
name: systematic-debugging
description: 2026 structured debugging PT (React 19 + Cloudflare + Supabase). Triggers on debug, bug, hata, crash, sorun.
autoTrigger: true
---
# Systematic Debugging — 2026 PT

## Process
1. **REPRODUCE** — exact step to trigger (user agent, route, input, network)
2. **ISOLATE** — smallest failing case (codesandbox/minimal repro)
3. **DIAGNOSE** — root cause (not symptom). 5 whys
4. **FIX** — minimal change
5. **VERIFY** — confirm + regression test
6. **DOCUMENT** — patterns.md append

## PT Common Issues

### Blank/White Screen
- Console error (ErrorBoundary caught something)
- `createPortal` target exists (`document.body` mount)
- z-index stacking (modal z-100, lightbox z-9999)
- Hydration mismatch (SSR hydrate — though SPA, rare)
- React 19 Suspense fallback infinite loop

### Admin PIN Login Fail
- Rate limit lockout — clear `localStorage.auth_rate_limit`
- Hash mismatch — `sha256(pin + salt)` match validHashes
- `crypto.subtle` unavailable — needs HTTPS/localhost
- Browser autofill inject

### Cloudflare Deploy Fail
- Build log dashboard check
- Missing dep — `npm ci --legacy-peer-deps`
- TS error — local `tsc -b --force` repro
- Lock file mismatch — regenerate `package-lock.json`
- Bundle >25MB — manual chunk split

### Edge Function 500
- No Node-only API (fs, child_process, crypto.createHash old)
- Use Web Crypto: `crypto.subtle.digest('SHA-256', ...)`
- Env var not set (Cloudflare dashboard Secret)
- Timeout — edge fn 30s max (free tier shorter)

### AI Chat Not Responding
- API key config (Zustand persist) veya edge env
- CORS — `_headers` allowlist
- Provider rate limit — fallback another provider
- Network tab: check POST status + response
- Langfuse trace (if configured)

### i18n Missing
- `audit:i18n` — key parity 13 dil
- Fallback: EN if key missing
- RTL: Arabic `document.dir='rtl'` + logical CSS

### Supabase Realtime Stuck
- Single channel + cleanup `removeChannel`
- RLS policy block (auth JWT missing)
- Network: WebSocket connection frame check
- Exponential backoff reconnect

### React 19 Specific
- `use(promise)` — promise identity değişmemeli (memoize)
- Actions `useActionState` — server action not defined → client fallback
- `useOptimistic` — rollback on error doğru mu

## Tools
- **Chrome DevTools**
  - Console (error + source map)
  - Network (HAR, throttle 4G)
  - Performance (INP trace, CPU 4x slow)
  - Memory (heap snapshot leak)
  - Application (LocalStorage, IndexedDB, SW)
  - Rendering (Paint flashing, Layer border)
- **React DevTools** — Components + Profiler
- **Cloudflare Dashboard** — Deploy + Analytics + Workers logs
- **Supabase Dashboard** — SQL editor, Logs, Realtime Inspector
- **Langfuse** — AI call trace
- **Sentry** — error tracking + replay
- `git bisect` — regression hunt

## Debugging Command
```bash
# Local repro
npm run dev -- --host            # network available
npm run build && npm run preview # prod build test

# Network throttle
# Chrome DevTools → Network → Slow 3G

# Deep log
VITE_DEBUG=1 npm run dev         # verbose

# Bundle inspect
npx vite-bundle-visualizer

# TS incremental
npx tsc -b --force               # full rebuild
rm -rf node_modules/.tmp         # cache clear
```

## Patterns
- **Binary search** — git bisect, code comment out half
- **Rubber duck** — explain aloud, bug surface
- **Mini repro** — CodeSandbox isolated
- **Timeline** — when started? last working commit
- **Change one thing** — multiple var at once yanıltıcı

## Anti-Pattern
- Fix symptom not root (ör. `try/catch` swallow without log)
- Copy-paste SO answer without understand
- "Works on my machine" — env difference
- Skip verify (fix assume correct)
- No documentation — same bug repeat 6 month sonra
