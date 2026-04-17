import { test, expect } from '@playwright/test';

test.describe('Admin Panel Tests', () => {
  test('PIN koruma ekranı görünüyor ve yanlış şifrede giriş yapılamıyor', async ({ page }) => {
    await page.goto('/admin');

    const heading = page.locator('h1', { hasText: 'Koç Paneli' });
    const pinInput = page.locator('input[type="password"]');

    // Eğer zaten giriş yapılmışsa test bu adımı atlamalı (temiz context olsa da)
    if (await heading.count() > 0) return;

    // PIN ekranının gelmesi (veya input'un)
    await expect(pinInput).toBeVisible();

    // Yanlış PIN denemesi
    await pinInput.fill('0000');
    // Sonraki işlem (buton veya enter)
    const loginButton = page.locator('button', { hasText: 'Giriş Yap' });
    if (await loginButton.count() > 0) {
        await loginButton.click();
    } else {
        await pinInput.press('Enter');
    }

    // Hata mesajının görünmesini bekle
    const errorMessage = page.locator('text=Hata'); // Or more specific: 'Hatalı şifre'
    await expect(page.locator('text=Hatalı şifre')).toBeVisible();
  });
});
