---
description: [Tam Otomatik Cloudflare Deploy Süreci]
---
Bu workflow uygulandığında, Antigravity aşağıdaki adımları sırasıyla çalıştırmalıdır:

1. İlk olarak VITE build testini yap (sıfır TypeScript/React hatası olduğundan emin ol).
// turbo
2. Build komutunu çalıştır: `npx vite build`
3. Eğer build başarılıysa tüm değişiklikleri git'e ekle: `git add .`
4. Temiz bir commit mesajı ile kaydet: `git commit -m "chore(deploy): auto-deployment via Antigravity skill"`
// turbo
5. Tüm güncellemeleri uzak sunucuya aktar: `git push origin main`
6. Kullanıcıya: "Yeni versiyon Cloudflare a başarıyla aktarıldı, CI/CD pipeline'ı tetiklendi." bilgisini ver.
