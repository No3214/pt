# Systematic Debugging Skill

Structured debugging for the PT platform.

## Debug Process
1. REPRODUCE: Get exact steps to trigger the bug
2. ISOLATE: Narrow down to smallest failing case
3. DIAGNOSE: Find root cause (not symptoms)
4. FIX: Minimal change that resolves the issue
5. VERIFY: Confirm fix works, no regressions

## Common PT Issues

### Blank/White Screen
- Check browser console for errors
- Check if createPortal target exists (document.body)
- Check z-index stacking (lightbox needs 9999)
- Check React Error Boundary caught something

### Admin Login Fails
- Rate limit lockout: clear localStorage auth_rate_limit
- Hash mismatch: verify SHA-256 of PIN matches validHashes
- crypto.subtle not available (needs HTTPS or localhost)

### Cloudflare Deploy Fails
- Check build logs in Cloudflare dashboard
- Common: missing dependency, TypeScript error
- .npmrc file conflicts with lock file
- Bundle too large (over 25MB)

### AI Chat Not Responding
- Check API keys in aiConfig (Zustand persisted)
- Check functions/api/ai.ts edge function
- CORS issues: check Cloudflare _headers
- Provider rate limits or outages

### i18n Missing Translations
- Check all 13 locale files have the key
- Fallback: English if key missing
- RTL: Arabic layout issues

## Tools
- Browser DevTools Console (errors, network)
- React DevTools (component tree, state)
- Cloudflare dashboard (deploy logs, analytics)
- git bisect for regression hunting
