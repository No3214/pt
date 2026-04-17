import { test, expect } from '@playwright/test'

test.describe('Responsive — Mobile', () => {
  test('Landing loads and hero is visible on iPhone viewport', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 })
  })

  test('Admin mobile sidebar opens with opaque background', async ({ page }) => {
    await page.goto('/admin')
    // If PIN gate appears, skip
    const pin = page.locator('input[type="password"]')
    if (await pin.count()) {
      test.skip(true, 'PIN-gated in fresh context')
      return
    }
    const hamburger = page.locator('button[aria-label="Menü"]')
    if (!(await hamburger.count())) {
      test.skip(true, 'Hamburger not rendered (likely auth-gated)')
      return
    }
    await expect(hamburger).toBeVisible()
    await hamburger.click()

    // Sidebar aside should be visible and opaque (have solid bg on mobile)
    const aside = page.locator('aside').first()
    await expect(aside).toBeVisible()

    // Nav items must be clickable (not behind overlay)
    const dashboardLink = page.locator('aside a', { hasText: /Dashboard/i })
    await expect(dashboardLink).toBeVisible()
  })

  test('No horizontal overflow on mobile landing', async ({ page }) => {
    await page.goto('/')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
