import { test, expect } from '@playwright/test';

test.describe('Landing Page Tests', () => {
  test('Açılış sayfası temel öğeleri görüntülüyor', async ({ page }) => {
    await page.goto('/');
    
    // Header logomuz veya text
    await expect(page.locator('header').getByText('ARENA')).toBeVisible();

    // Ana manşet animasyonlu olduğu için H1 kontrolü yapıyoruz
    await expect(page.locator('h1').first()).toBeVisible();

    // Navigasyon kontrolü (genel bağlantılar)
    const programlarLink = page.locator('nav a', { hasText: /Programlar/i }).first();
    await expect(programlarLink).toBeVisible();
  });

  test('Koyu/Açık Tema Togglesi crash vermiyor', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('button[aria-label="Tema değiştir"]');
    
    // Tema değiştirici görünür olmalı
    await expect(themeToggle).toBeVisible();
    
    // Bir kere tıkla
    await themeToggle.click();
    
    // Hala görünür olmalı, crash/beyaz sayfa olmamalı
    await expect(themeToggle).toBeVisible();
  });
});
