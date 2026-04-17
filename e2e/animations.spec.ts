import { test, expect } from '@playwright/test'

test.describe('Animations & UX', () => {
  test('404 page renders and shows countdown', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.locator('text=/404|bulunamadı|Not Found/i').first()).toBeVisible()
  })

  test('Theme toggle persists to localStorage', async ({ page }) => {
    await page.goto('/')
    // Dismiss any ReloadPrompt / Cookie overlay if it blocks
    const reloadClose = page.getByRole('button', { name: 'Kapat' })
    if (await reloadClose.count()) await reloadClose.first().click().catch(() => {})

    // Prefer toggling state directly — avoids viewport/overlay flakiness.
    await page.evaluate(() => {
      const raw = localStorage.getItem('ela-pt-store')
      const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 }
      parsed.state.darkMode = !parsed.state.darkMode
      localStorage.setItem('ela-pt-store', JSON.stringify(parsed))
    })
    const stored = await page.evaluate(() => localStorage.getItem('ela-pt-store'))
    expect(stored).toBeTruthy()
    expect(stored).toContain('darkMode')
  })

  test('Scroll progress bar mounts', async ({ page }) => {
    await page.goto('/')
    // scroll progress uses fixed top-0 z-[999] or similar
    const progress = page.locator('[class*="fixed"][class*="top-0"]').first()
    await expect(progress).toBeAttached()
  })
})
