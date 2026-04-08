# Web App Testing Skill

Testing patterns for PT React application.

## Test Strategy
- Unit: Zustand store actions, utility functions
- Component: React Testing Library for UI components
- E2E: Playwright for critical user flows
- Visual: Screenshot comparison for design regression

## Playwright E2E (Primary)
```bash
npx playwright test
```

### Critical Flows to Test
1. Landing page loads, navigation works
2. Admin login with PIN (ela2026)
3. Client portal access
4. AI chat sends query and receives response
5. Form submissions (lead capture, contact)
6. Dark mode toggle
7. Language switcher (TR/EN minimum)

### Pattern
```typescript
import { test, expect } from '@playwright/test'

test('admin login', async ({ page }) => {
  await page.goto('/admin')
  await page.waitForLoadState('networkidle')
  await page.fill('input[type="password"]', 'ela2026')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/admin\/dashboard/)
})
```

## Component Testing
- React Testing Library + Vitest
- Test user interactions, not implementation
- Use role-based queries: getByRole, getByLabelText
- Mock Zustand store for isolated tests

## What NOT to Test
- Third-party libraries (Framer Motion animations)
- CSS styling details
- Implementation internals (state shape)
