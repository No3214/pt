# Code Reviewer Skill

Code review checklist for PT project quality.

## Security
- No XSS (no dangerouslySetInnerHTML, sanitize input)
- No hardcoded secrets or API keys
- SHA-256 for PINs/passwords
- CSP headers in Cloudflare _headers

## TypeScript
- No any types, use unknown + type guards
- Proper null checks (?., ??)
- Exhaustive switch with never check

## React
- No inline objects in JSX props (causes re-renders)
- key props on all .map() elements (stable IDs, not index)
- Effects have proper dependency arrays + cleanup
- createPortal for overlays/modals
- Error boundaries at route level

## Performance
- Lazy loading for routes
- Images: WebP, explicit dimensions, loading=lazy
- Debounced search inputs

## Accessibility
- Semantic HTML, aria-label on icon buttons
- role=dialog + aria-modal on modals
- prefers-reduced-motion respected
- Color contrast >= 4.5:1

## i18n
- No hardcoded strings, use t.xxx
- All 13 languages have new keys

## Anti-Patterns to Flag
- console.log in production
- // @ts-ignore
- !important in CSS
- Nested ternaries
- index as key on dynamic lists
