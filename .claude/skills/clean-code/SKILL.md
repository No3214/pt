---
name: clean-code
description: 2026 clean code standards PT (React 19 + TS 5.6). Triggers on temizle, refactor, kod kalitesi, clean.
autoTrigger: true
---
# Clean Code — 2026 PT Standards

## Naming
- **Component**: PascalCase (`ClientAlerts`, `AIChat`, `BookingCTA`)
- **Hook**: camelCase + `use` prefix (`useStore`, `useTranslation`, `useBooking`)
- **Constant**: UPPER_SNAKE (`MAX_RETRIES`, `API_TIMEOUT`)
- **File**: PascalCase component, camelCase util, kebab-case config
- **Boolean**: is/has/can/should prefix (`isLoading`, `hasError`, `canSubmit`)
- **Async**: verb + noun (`fetchStudents`, `saveBooking`)
- **Type**: `TClient` / `ClientProps` / `ClientState` (descriminated)

## Functions
- **Single responsibility** — bir iş, bir fonksiyon
- **≤30 satır** ideal (50 tolerans)
- **≤3 param**; fazlası → object destructure
- **Early return** — nesting derinliği azalt
- **Descriptive**: `calculateTDEE()` not `calc()`
- **Pure** tercih et — side effect izole
- **Async** default; sync sadece kritik path

## Components
- **≤150 satır** — fazlası sub-component extract
- **Props interface** yukarıda tanımlı
- **Default export** page component
- **Named export** shared (common/)
- **'use client' minimal** — sadece interactive
- **React.memo** ölçülmüş kazanç varsa
- **ref as prop** (React 19) — forwardRef YASAK
- **satisfies Props** — prop type güvenli

## Error Handling
- **try/catch** her async op
- **User-friendly message** TR + EN
- **Toast/Alert** UI feedback (silent fail YASAK)
- **ErrorBoundary** route-level
- **Result<T, E> pattern** — `{ok: true, data} | {ok: false, error}`
- `console.error` debug; `console.log` prod YASAK

## Comments
- **Why, not what** — kod ne yaptığını söylüyor
- **JSDoc** public API + export fn
- **TODO**(issue#): context + ticket ref
- **Commented-out code** YASAK (git history kullan)
- **Magic number** → named const + comment

## DRY & SOLID
- **Repeated logic → custom hook**
- **Shared UI → components/common/**
- **Constants → lib/constants.ts**
- **Magic number → named const**
- **SRP**: class/component bir sorumluluğa odak
- **DI**: prop ile dependency inject (test edilebilir)

## TypeScript 5.6
- `unknown` > `any`
- Discriminated union > enum
- `satisfies` widening korur
- `const T extends string[]` inference
- `using` (Symbol.dispose) resource cleanup
- Template literal type i18n key safety
- `noUncheckedIndexedAccess` strict

## Formatting
- Prettier default (2 space, 100 col)
- Import order: react → 3rd party → @/alias → relative → style
- Named export > default (refactor friendly)
- No default re-export barrel

## Review Checklist
- [ ] Name describes intent
- [ ] Function <30 lines, param ≤3
- [ ] Component <150 lines
- [ ] No `any`, no `@ts-ignore`
- [ ] Error handled + user feedback
- [ ] No magic number/string
- [ ] No commented-out code
- [ ] DRY across files
