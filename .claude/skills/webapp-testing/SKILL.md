---
name: webapp-testing
description: 2026 testing strategy PT (Vitest + RTL + Playwright). Triggers on test, e2e, playwright, vitest, coverage.
---
# Web App Testing — 2026 PT

## Strategy (Pyramid)
- **Unit** (Vitest) — store, util, hook pure
- **Component** (RTL) — interactive component
- **E2E** (Playwright) — critical user flow
- **Visual** (Playwright screenshot) — design regression

## Coverage Target
- Unit: ≥80% critical lib
- Component: ≥60% interactive
- E2E: ≥10 flow covered
- Total: ≥70%

## Playwright E2E (Primary)
```bash
npx playwright test
npx playwright test --ui            # UI mode
npx playwright test --debug
npx playwright codegen              # record
```

### Critical Flow
1. Landing loads + nav works
2. Admin PIN login (`ela2026`)
3. Portal access (student)
4. AI chat query + response
5. Form submit (lead, contact, booking)
6. Dark mode toggle persist
7. Language switcher (TR→EN minimum)
8. Booking create → approve → pay
9. Wellness log daily
10. Workout complete → stats update

### Pattern (2026 Best)
```ts
import { test, expect } from '@playwright/test'

test.describe('Admin auth', () => {
  test('PIN login success', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    // Semantic query (accessibility-first)
    await page.getByRole('textbox', { name: /pin/i }).fill('ela2026')
    await page.getByRole('button', { name: /giriş/i }).click()

    await expect(page).toHaveURL(/admin\/dashboard/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/dashboard/i)
  })

  test('Rate limit 5 fails', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.goto('/admin')
      await page.getByRole('textbox', { name: /pin/i }).fill('wrong')
      await page.getByRole('button').click()
    }
    await expect(page.getByText(/rate limit/i)).toBeVisible()
  })
})
```

### Config
```ts
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  reporter: [['html'], ['github']],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' }
})
```

## Component (RTL + Vitest)
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('triggers onClick when clicked', async () => {
    const handle = vi.fn()
    render(<Button onClick={handle}>Click me</Button>)

    await userEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(handle).toHaveBeenCalledTimes(1)
  })

  it('respects disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## Rules (RTL)
- **Role-based query** — `getByRole`, `getByLabelText`, `getByText`
- **Test user behavior**, not implementation
- **No state/internal** test
- **Mock external** (Supabase, AI fetch)
- **`userEvent` > `fireEvent`** (realistic)

## Vitest Config
```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: { lines: 70, functions: 70, statements: 70 }
    }
  }
})
```

## Mock Zustand
```ts
import { useStore } from '@/stores/useStore'

beforeEach(() => {
  useStore.setState({
    darkMode: false,
    language: 'tr',
    // ... initial
  })
})
```

## Mock Supabase
```ts
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [...], error: null }),
      insert: vi.fn().mockResolvedValue({ data: {...}, error: null })
    }))
  }
}))
```

## CI
```yaml
# .github/workflows/test.yml
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: npm run test:unit      # Vitest
- run: npm run test:e2e       # Playwright
- uses: codecov/codecov-action@v4
```

## What NOT to Test
- Third-party (Framer Motion animation)
- CSS visual detail (use visual regression instead)
- Implementation internal (state shape, private method)
- Generated code (types, locale file)

## Visual Regression (2026)
```ts
test('Landing visual', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('landing.png', {
    maxDiffPixelRatio: 0.02,
    fullPage: true
  })
})
```

## Accessibility Test
```ts
import { injectAxe, checkA11y } from 'axe-playwright'

test('Landing a11y', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    axeOptions: { runOnly: ['wcag2a', 'wcag2aa', 'wcag22aa'] }
  })
})
```
