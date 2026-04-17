# ARENA Performance — Full Project Brain

me talk short. no filler. tool first, result first. caveman efficiency.

## Identity
- Product: ARENA Performance — Elite volleyball & performance platform (system, not person-bound)
- Owner: Yunuscan (yunuscanoruk@gmail.com)
- Domain: arena.kozbeylikonagi.com.tr
- GitHub: github.com/No3214/pt.git
- Tagline: Güçlü ol. Kendine güven.

## Stack
React 19 + TypeScript 5.8+ + Vite 6 + Tailwind CSS 3
Zustand 5 (persist) | Framer Motion | 13-lang i18n
LLM Council: Gemini + OpenRouter + DeepSeek
Cloudflare Pages (auto from main) | Supabase PostgreSQL
Auth: SHA-256 PIN (ela2026, 1234) | PWA: vite-plugin-pwa
Forms: react-hook-form + zod | Charts: Recharts | Icons: Lucide

## Design Tokens
Primary: #C2684A (terracotta) Secondary: #7A9E82 (sage)
Accent: #4A6D88 (coast) Sand: #D4B483
BG: #FAF6F1 light / #0A0A0A dark
Display: Cormorant Garamond | Body: Outfit

## Automation
npm run audit:all (7 checks) | npm run auditcodex (graded report)
audit:i18n | audit:a11y | audit:security | audit:seo | audit:bundle | audit:images | audit:quality
fix:a11y | fix:images (PNG to WebP)

## 30 Skills in .claude/skills/
auto-audit, auditcodex, selfaudit, ai-council, code-audit, code-reviewer,
component-builder, deploy-check, design-audit, frontend-design, i18n-manager,
performance-audit, prompt-engineering, react-best-practices, self-improving,
senior-architect, senior-frontend, smart-commit, tailwind-patterns,
ui-design-system, ui-ux-pro-max, clean-code, content-creator, docker-expert,
mermaid-diagrams, seo-optimizer, systematic-debugging, web-performance,
webapp-testing, workflow-automation

## Critical Rules
1. No any types 2. No hardcoded strings (use t.xxx)
3. createPortal for modals 4. role=dialog aria-modal on dialogs
5. Run audits before deploy 6. Turkish primary language
7. Bundle under 200KB gz 8. prefers-reduced-motion respected
9. Dark mode via CSS vars 10. Alt text on all images
