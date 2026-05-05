# ARENA Performance Implementation Backlog

Bu backlog, projenin ücretli SaaS olarak satışa hazır hale gelmesi için önceliklendirilmiş geliştirme planıdır.

## P0 — Ücretli SaaS için zorunlu temel

### 1. Supabase Auth ve rol bazlı erişim

Amaç: Frontend PIN mantığını kaldırıp gerçek kullanıcı, organizasyon ve rol sistemine geçmek.

Yapılacaklar:

- Supabase Auth login/register akışı oluştur.
- owner, admin, coach, staff, student rollerini tanımla.
- `organizations` ve `organization_members` tablolarını ekle.
- Admin panel erişimini role göre kontrol et.
- Öğrenci portalını öğrenci hesabına bağla.
- Mevcut local demo kullanıcıları gerçek DB kayıtlarına taşı.

Kabul kriteri:

- Koç başka organizasyonun öğrencisini göremez.
- Öğrenci sadece kendi portalını görür.
- Owner tüm organizasyonu yönetir.
- Admin PIN tek başına yeterli auth yöntemi olmaktan çıkar.

### 2. Multi-tenant veri modeli

Amaç: Aynı uygulama içinde birden fazla PT, salon veya akademinin güvenli şekilde çalışması.

Yapılacaklar:

- Ana tablolara `organization_id` ekle.
- Paket, ödeme, öğrenci, program, kurs, mesaj ve raporları organizasyon bazlı izole et.
- RLS politikalarını organization membership üzerinden yeniden yaz.
- Tenant branding ayarlarını DB’ye taşı.

Kabul kriteri:

- Her organizasyon kendi logo, renk, iletişim ve domain ayarlarını yönetebilir.
- Bir organizasyon başka organizasyon verisine SQL veya frontend üzerinden erişemez.

### 3. Ödeme altyapısı

Amaç: Koçların ve salonların gerçek ödeme alabilmesi.

Yapılacaklar:

- `payment_providers` tablosu oluştur.
- `checkout_sessions` tablosu oluştur.
- `payments` tablosunu provider transaction id ile genişlet.
- Webhook event log ekle.
- Paket satın alma linki oluştur.
- Ödeme başarılı olunca subscription veya content access otomatik aç.
- Ödeme başarısız olursa kullanıcıya yeniden ödeme linki sun.

Kabul kriteri:

- Paket oluşturulur.
- Satış linki üretilir.
- Öğrenci ödeme yapar.
- Webhook ödeme sonucunu kaydeder.
- Öğrenci portal erişimi otomatik açılır.
- Ödeme statüsü frontend tarafından değiştirilemez.

### 4. KVKK ve onam kayıtları

Amaç: Sağlık ve ölçüm verilerinin yasal riskini azaltmak.

Yapılacaklar:

- Aydınlatma metni versiyonlama.
- Açık rıza kayıtları.
- Sağlık verisi işleme rızası.
- Kullanıcı veri silme talebi kaydı.
- Audit log.

Kabul kriteri:

- Öğrenci sağlık/ölçüm verisi girmeden önce onam verir.
- Onam tarihi, metin versiyonu ve IP/user agent kaydedilir.

## P1 — Para kazandıran MVP

### 5. Paket oluşturma ve satış linki

Yapılacaklar:

- Admin panelde paket formu.
- Paket tipi: PT seans, online koçluk, grup ders, kurs, üyelik.
- Fiyat, para birimi, süre, seans sayısı, özellikler.
- Public checkout page.
- WhatsApp paylaşım butonu.

Kabul kriteri:

- Koç 2 dakika içinde paket oluşturup ödeme linki gönderebilir.

### 6. Öğrenci aktivasyon akışı

Yapılacaklar:

- Ödeme sonrası magic link veya hesap oluşturma.
- Öğrenci onboarding formu.
- İlk ölçüm formu.
- Program atanması.
- Welcome notification.

Kabul kriteri:

- Ödeme yapan öğrenci manuel işlem olmadan portala girebilir.

### 7. Gerçek Payment Dashboard

Yapılacaklar:

- Demo payment üretimini kaldır.
- DB payments ve subscriptions verisini göster.
- Paid, pending, failed, overdue, refunded filtreleri.
- MRR, tahsilat, bekleyen ödeme, geciken ödeme kartları.
- Paket bitiş ve yenileme uyarısı.

Kabul kriteri:

- Dashboard gerçek ödeme verisiyle çalışır.

### 8. Workout plan atama

Yapılacaklar:

- Program builder’dan öğrenciye program ata.
- Hareket, set, tekrar, RPE, not ve video bağlantısı.
- Öğrenci tamamlandı olarak işaretleyebilir.
- Koç completion raporu görür.

Kabul kriteri:

- Öğrenci portaldan günlük antrenmanını takip eder.

### 9. Progress ve ölçüm

Yapılacaklar:

- Kilo, vücut ölçüleri, progress photo.
- Önce/sonra karşılaştırma.
- Haftalık ölçüm hatırlatma.
- Koç yorumu.

Kabul kriteri:

- Koç öğrenci gelişimini grafik ve fotoğraf üzerinden takip eder.

### 10. WhatsApp şablonları

Yapılacaklar:

- Hoş geldin.
- Ödeme hatırlatma.
- Ölçüm hatırlatma.
- Program hatırlatma.
- Paket yenileme.
- 3 gündür giriş yapmadın.

Kabul kriteri:

- Koç tek tıkla öğrenciye kişiselleştirilmiş WhatsApp mesajı gönderebilir.

## P2 — AI ve otomasyon

### 11. AI Program Builder

Yapılacaklar:

- Hedef, seviye, ekipman, gün sayısı ve sağlık notuna göre program taslağı.
- Koç onaylamadan öğrenciye gönderilmez.
- Hareket alternatifi önerisi.

Kabul kriteri:

- Koç 10 dakikalık işi 1-2 dakikaya indirir.

### 12. AI Weekly Check-in

Yapılacaklar:

- Öğrenci verilerini özetle.
- Riskli öğrencileri işaretle.
- Koça mesaj taslağı üret.
- Kilo, uyku, enerji, antrenman uyumu ve ödeme durumunu birleştir.

Kabul kriteri:

- Koç haftalık öğrenci takibini tek ekranda yapar.

### 13. Churn risk skoru

Yapılacaklar:

- Giriş sıklığı.
- Kaçırılan antrenman.
- Geciken ödeme.
- Düşen enerji/motivasyon.
- Cevapsız mesaj.

Kabul kriteri:

- Sistem riskli öğrencileri erken gösterir.

## P3 — Gym ve studio operasyonları

### 14. Çoklu eğitmen

Yapılacaklar:

- Eğitmen daveti.
- Eğitmen bazlı öğrenci atama.
- Eğitmen yetki sınırı.
- Eğitmen gelir raporu.

### 15. Ders rezervasyonu

Yapılacaklar:

- Grup ders oluşturma.
- Kapasite.
- Bekleme listesi.
- İptal süresi.
- QR check-in.

### 16. PT seans ve komisyon

Yapılacaklar:

- Seans paketi.
- Kalan seans.
- Seans düşme.
- Eğitmen komisyon yüzdesi.
- Salon gelir raporu.

## P4 — Online eğitim/LMS

### 17. Kurs sistemi

Yapılacaklar:

- Course, module, lesson modeli.
- Video, PDF ve link dersleri.
- Course progress.
- Access control.
- Sertifika hazırlığı.

### 18. Eğitim satışı

Yapılacaklar:

- Tek seferlik kurs satışı.
- Aylık eğitim aboneliği.
- Bundle: kurs + 1-1 koçluk.
- Kurs sonrası upsell.

### 19. Canlı eğitim

Yapılacaklar:

- Zoom, Google Meet, Teams linki.
- Katılımcı limiti.
- Hatırlatma.
- Kayıt linki.

## P5 — White-label ve globalleşme

### 20. White-label tenant branding

Yapılacaklar:

- Logo.
- Renkler.
- Custom domain.
- Email sender.
- Branded portal.

### 21. Global ödeme

Yapılacaklar:

- Stripe destekli ülkeler için provider adapter.
- Çoklu para birimi.
- Vergi/fatura entegrasyonu için adapter yapısı.

### 22. Marketplace

Yapılacaklar:

- Eğitmen profilleri.
- Public program/kurs listesi.
- Komisyon sistemi.
- Affiliate link.

## İlk sprint önerisi

Sprint 1 hedefi: Güvenli SaaS iskeleti.

- organizations
- organization_members
- role based auth
- RLS update
- packages gerçek DB bağlantısı
- checkout_sessions tablosu
- public package checkout page tasarımı

Sprint 2 hedefi: İlk gerçek tahsilat.

- iyzico veya PayTR adapter
- webhook event log
- payment status update
- subscription activation
- student portal invite
- payment dashboard gerçek veri

Sprint 3 hedefi: Öğrenci değeri.

- onboarding
- workout assignment
- measurement form
- progress photo
- WhatsApp templates

Sprint 4 hedefi: AI farkı.

- AI program builder
- weekly check-in summary
- churn risk cards
- message drafts
