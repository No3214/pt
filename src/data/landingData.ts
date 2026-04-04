export interface Program {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  color: 'primary' | 'secondary' | 'accent';
  popular: boolean;
  featured?: boolean;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  metric: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const programs: Program[] = [
  {
    name: 'Online Koçluk',
    price: '2.500',
    period: '/ay',
    desc: 'Kişiye özel antrenman programı ve temel beslenme takibi',
    features: ['Kişiye özel antrenman programı', 'Haftalık program güncelleme', 'WhatsApp destek', 'Form kontrol videoları', 'Temel beslenme rehberi'],
    color: 'secondary',
    popular: false,
  },
  {
    name: 'Voleybol Performance',
    price: '3.000',
    period: '/ay',
    desc: 'Sıçrama, atletizm ve sahaya özel performans antrenmanı',
    features: ['Online Koçluk dahil', 'Sıçrama & patlayıcılık protokolü', 'Pozisyona özel antrenman', 'Video analiz & geri bildirim', 'Sakatlık önleme programı', 'Haftalık 1:1 görüntülü görüşme'],
    color: 'primary',
    popular: true,
    featured: true,
  },
  {
    name: 'Premium Büyüme',
    price: '5.500',
    period: '/ay',
    desc: 'TDEE destekli tam beslenme planı ile bütüncül koçluk',
    features: ['Voleybol Performance dahil', 'TDEE bazlı beslenme planı', 'Günlük makro takibi', 'Danışan portalı erişimi', 'Supplement rehberliği', '7/24 öncelikli destek', 'Aylık vücut analizi'],
    color: 'accent',
    popular: false,
  },
];

export const testimonials: Testimonial[] = [
  { text: 'Sadece antrenman değil, disiplin öğreten bir süreçti. Vücudumdaki değişime inanamıyorum.', name: 'Ayşe K.', role: 'Voleybolcu', metric: '+12kg squat' },
  { text: 'Ela\'nın programlarıyla 3 ayda dikey sıçramam 8 cm arttı. Gerçekten fark yaratan biri.', name: 'Deniz Y.', role: 'Amatör Voleybolcu', metric: '+8cm sıçrama' },
  { text: 'Beslenme planım ve antrenmanlarım o kadar uyumluydu ki, ilk kez sürdürülebilir bir değişim yaşadım.', name: 'Selin B.', role: 'Fitness', metric: '-4kg yağ' },
];

export const faqItems: FAQItem[] = [
  { q: 'Programa nasıl başlarım?', a: 'Başvuru formunu doldurduktan sonra WhatsApp üzerinden iletişime geçiyorum. Ücretsiz 15 dakikalık tanışma görüşmesinde hedeflerini konuşup, sana uygun programı belirliyoruz.' },
  { q: 'Online antrenman nasıl işliyor?', a: 'Sana özel hazırladığım program, video açıklamalı egzersizlerle uygulamanda gönderiliyor. Haftalık check-in\'lerle formu kontrol edip, programı gerektiğinde güncelliyorum.' },
  { q: 'Beslenme planı dahil mi?', a: 'Online Koçluk paketinde temel beslenme takibi var. Premium Büyüme paketinde ise günlük TDEE hesaplı tam beslenme planı, makro takibi ve birebir beslenme danışmanlığı dahil.' },
  { q: 'Voleybol oynamıyorum, katılabilir miyim?', a: 'Elbette! Voleybol Performance paketi sahaya özel olsa da, Online Koçluk ve Premium Büyüme paketleri her seviye için uygun. Kuvvet, postür ve genel fitness hedeflerine yönelik çalışıyoruz.' },
  { q: 'Sonuçları ne zaman görürüm?', a: 'Disiplinli takipte ilk 4 haftada gözle görülür değişim başlıyor. 3 aylık süreçte ciddi dönüşümler yaşanıyor. Her danışanın süreci farklı, ama tutarlılık her zaman sonuç verir.' },
];

export const landingStats: Stat[] = [
  { value: 20, suffix: '+', label: 'Aktif Danışan' },
  { value: 8, suffix: '+', label: 'Yıl Voleybol' },
  { value: 96, suffix: '', label: 'Egzersiz Kütüphanesi' },
  { value: 100, suffix: '%', label: 'Memnuniyet' },
];

export const navigationLinks = [
  { id: 'hakkinda', label: 'Hakkında' },
  { id: 'programlar', label: 'Programlar' },
  { id: 'sonuclar', label: 'Sonuçlar' },
  { id: 'faq', label: 'SSS' },
  { id: 'iletisim', label: 'İletişim' },
];
