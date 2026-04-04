# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel Tests >> PIN koruma ekranı görünüyor ve yanlış şifrede giriş yapılamıyor
- Location: e2e\admin.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Koç Girişi')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Koç Girişi')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic:
      - img
    - generic [ref=e10]:
      - generic [ref=e11]:
        - paragraph [ref=e12]: 22:40
        - paragraph [ref=e13]: 4 Nisan Cumartesi
      - generic [ref=e14]:
        - img [ref=e18]
        - heading "Koç Paneli" [level=1] [ref=e23]
        - paragraph [ref=e24]: Ela Ebeoğlu Performance Coaching
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]: Şifre
          - textbox "••••••••" [active] [ref=e29]
        - button "Giriş Yap" [disabled] [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: Giriş Yap
      - generic [ref=e42]:
        - link "Ana Siteye Dön" [ref=e43] [cursor=pointer]:
          - /url: /
          - img [ref=e44]
          - text: Ana Siteye Dön
        - generic [ref=e46]:
          - img [ref=e47]
          - text: Şifreli
  - generic [ref=e51]:
    - generic [ref=e53]:
      - img [ref=e55]
      - generic [ref=e57]:
        - heading "Gizlilik & Çerezler" [level=4] [ref=e58]
        - paragraph [ref=e59]: Deneyiminizi iyileştirmek için çerez kullanıyoruz. KVKK kapsamında verileriniz korunmaktadır.
    - generic [ref=e60]:
      - button "Tümünü Kabul" [ref=e61] [cursor=pointer]
      - button "Özelleştir" [ref=e62] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Panel Tests', () => {
  4  |   test('PIN koruma ekranı görünüyor ve yanlış şifrede giriş yapılamıyor', async ({ page }) => {
  5  |     await page.goto('/admin');
  6  | 
  7  |     const heading = page.locator('h1', { hasText: 'Gelişmiş Coach Paneli' });
  8  |     const pinInput = page.locator('input[type="password"]');
  9  | 
  10 |     // Eğer zaten giriş yapılmışsa test bu adımı atlamalı (temiz context olsa da)
  11 |     if (await heading.count() > 0) return;
  12 | 
  13 |     // PIN ekranının gelmesini bekliyoruz
> 14 |     await expect(page.locator('text=Koç Girişi')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  15 |     await expect(pinInput).toBeVisible();
  16 | 
  17 |     // Yanlış PIN denemesi
  18 |     await pinInput.fill('0000');
  19 |     // Sonraki işlem (buton veya enter)
  20 |     const loginButton = page.locator('button', { hasText: 'Giriş Yap' });
  21 |     if (await loginButton.count() > 0) {
  22 |         await loginButton.click();
  23 |     } else {
  24 |         await pinInput.press('Enter');
  25 |     }
  26 | 
  27 |     // Panel başlığı görüntülenMemeli
  28 |     await expect(heading).not.toBeVisible();
  29 |   });
  30 | });
  31 | 
```