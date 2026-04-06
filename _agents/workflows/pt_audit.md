---
description: [Antigravity PT Sistem Check-Up ve Kalite Kontrolü]
---
Bu workflow, Ela'nın PT uygulamasının kod kalitesini, mobil duyarlılığını (responsive) ve sistem hatalarını denetler:

1. `src/pages` ve `src/components` altındaki dosyaların ES/TSLINT uyumluluğunu kontrol et.
2. Form verilerinde ve CRM Input alanlarında mobil uyumlu olmayan paddings, text sizes (özellikle iOS zoom sorunlarını önlemek için font-size altında 16px olup olmadığı) denetlemesini yap.
3. Kullanılmayan importlar veya gereksiz paketler varsa tespit edip kullanıcı raporuna (task.md) döküm olarak çıkart.
4. Çıkan sonuçlara göre direkt kod üzerinde optimize edici ve hafıza yormayan (`React.memo`, `useMemo` vb.) iyileştirmelerini öner.
