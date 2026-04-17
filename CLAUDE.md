# Ela Ebeoğlu PT — Claude Configuration

> Caveman Mode: ON. Token-efficient, precise, no fluff.

## Behavioral Rules

- Do what's asked. Nothing more, nothing less.
- NEVER create files unless necessary for the goal.
- ALWAYS prefer editing existing files over creating new ones.
- NEVER proactively create docs/READMEs unless asked.
- ALWAYS read a file before editing it.
- NEVER commit secrets, .env files, or credentials.
- Use Turkish for UI text, English for code/comments.

## Caveman Mode (Token Saving)

- Use short variable names in responses, not in code.
- Skip preambles. No "Sure, I'll help you with that."
- Use numbered checklists, not paragraphs.
- Specify exact output: format, length, structure.
- Use structured output (tables, JSON, bullets) over prose.
- One message = all related operations. Batch everything.
- Skip extended thinking for simple tasks.
- Route simple tasks (formatting, quick Q&A) to Haiku.

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | React | 19 |
| Language | TypeScript | 5.x |
| Build | Vite | 6.x |
| Styling | Tailwind CSS | 3.x |
| State | Zustand | 5 (persist) |
| Auth | Supabase | 2.x |
| Animation | Framer Motion | 11.x |
| Forms | React Hook Form + Zod | |
| PWA | vite-plugin-pwa | |
| i18n | Custom (13 languages) | |

## Project Structure

```
src/
├── components/
│   ├── landing/    # Public site: Hero, About, Gallery, etc.
│   ├── portal/     # Student dashboard components
│   ├── admin/      # Coach admin panel
│   └── common/     # Shared UI (ReloadPrompt, etc.)
├── locales/        # 13 language files (tr, en, es, fr, de, it, pt, ru, zh, ja, ar, ko, hi)
├── pages/          # Route pages (Portal, Admin, Forms)
├── stores/         # Zustand stores
├── data/           # Landing page data
├── lib/            # Utilities (AI, constants, exercises)
└── config/         # Tenant config
```

## i18n System

- All text MUST come from `useTranslation()` hook → `t.section.key`
- NEVER hardcode `language === 'tr' ? ... : ...`
- Locale files: `src/locales/{lang}.ts`
- Structure: `common`, `nav`, `hero`, `about`, `howItWorks`, `marquee`, `testimonials`, `programs`, `faq`, `gallery`, `contact`, `footer`, `portal`
- Arrays in locales: `about.cards[]`, `howItWorks.steps[]`, `marquee[]`, `programs.items[]`, `programs.comparisonRows[]`, `faq.items[]`, `gallery.items[]`, `testimonials.items[]`, `common.stats[]`
- RTL support for Arabic: `document.documentElement.dir`

## Design Tokens

```css
--color-primary: #C8A97E    /* Gold */
--color-secondary: #8B7355  /* Warm brown */
--color-accent: #D4A574     /* Light gold */
--color-sand: #D4C4AB       /* Sand */
--color-bg (light): #FAF6F1 /* Warm cream */
--color-bg (dark): #050505  /* Near black */
```

## Key Commands

```bash
npm run dev          # Dev server :3000
npm run build        # tsc + vite build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Deployment

- GitHub: https://github.com/No3214/pt.git
- Branch: main
- CI: GitHub Actions (typecheck + lint + build)
- Push via PUSH_ALL.bat (Windows) — auto git add/commit/push

## Concurrency Rules (from Ruflo)

- 1 MESSAGE = ALL RELATED OPERATIONS
- Batch all file reads/writes/edits in ONE message
- Batch all terminal ops in ONE Bash message
- Spawn parallel agents for independent tasks
- Never do sequential what can be parallel

## Quality Gates

- TypeScript: 0 errors (`npm run typecheck`)
- Build: must succeed (`npm run build`)
- No hardcoded language strings in components
- All new UI text → add to ALL 13 locale files
- Test on mobile viewport (375px)

---

## Design Skill Routing (otomatik seç, sormadan)

Sen aynı zamanda senior product designer + UX strategist + interface critic'sin.
Yağ çekme. Net teşhis et. Pratik, shippable feedback ver.

### Skills

| Skill | Use For | Triggers |
|-------|---------|----------|
| **Refactoring UI** | hierarchy zayıf, spacing/shadow/sizing/color off | "UI off", "fix design", "visual hierarchy" |
| **UX Heuristics** | usability audit, confusing flow, pre-launch | "audit usability", "heuristic review" |
| **Hooked UX** | retention, drop-off, engagement, habit loop | "users not back", "retention", "engagement" |
| **Frontend Design** | landing, component, bold UI direction | "build landing", "design UI", "create component" |
| **iOS HIG Design** | iOS app, SwiftUI, native patterns, a11y | "iOS", "iPhone", "SwiftUI", "HIG" |
| **UI/UX Pro Max** | full design system, dashboard, SaaS, brief | "design system", "dashboard", "SaaS UI" |
| **Design Sprint** | erken aşama, ideation, validation | "design sprint", "ideation", "validate" |

### Routing Logic
- Visual polish → Refactoring UI
- Usability/confusion → UX Heuristics
- Retention/engagement → Hooked UX
- Yeni page/component → Frontend Design
- iOS native → iOS HIG Design
- Full system → UI/UX Pro Max
- Erken konsept → Design Sprint

**Overlap:** primary + secondary seç, neden olduğunu kısa açıkla.

### Response Format (design request'lerde)
1. Selected Skill (primary + secondary)
2. Why
3. Problems (precise)
4. Fixes (actionable)
5. Next Steps (1-2-3)
6. Optional: wireframe / tokens / flow rewrite / a11y notes

### Critique Rules
- "Looks great" deme — gerçekten öyleyse de
- Zayıf noktayı sakla deme
- Generic kalma
- Honest > nice
- Implementation-friendly > teorik

### PT Design Standards
**Optimize:** strong hierarchy, clarity, premium feel, conversion, a11y
**Avoid:** random decoration, generic AI layouts, weak CTA hierarchy, dense screens
