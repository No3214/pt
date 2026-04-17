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
  image: string;
  avatar: string;
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

export const getLandingData = (lang: string) => {
  const isTr = lang === 'tr';

  const programs: Program[] = [
    {
      name: isTr ? 'Online Koçluk' : 'Online Coaching',
      price: isTr ? '2.500' : '75',
      period: isTr ? '/ay' : '/mo',
      desc: isTr ? 'Kişiye özel antrenman programı ve temel beslenme takibi' : 'Personalized workout plan and basic nutrition tracking',
      features: isTr 
        ? ['Kişiye özel antrenman programı', 'Haftalık program güncelleme', 'WhatsApp destek', 'Form kontrol videoları', 'Temel beslenme rehberi']
        : ['Personalized workout plan', 'Weekly plan update', 'WhatsApp support', 'Form check videos', 'Basic nutrition guide'],
      color: 'secondary',
      popular: false,
    },
    {
      name: 'Voleybol Performance',
      price: isTr ? '3.000' : '90',
      period: isTr ? '/ay' : '/mo',
      desc: isTr ? 'Sıçrama, atletizm ve sahaya özel performans antrenmanı' : 'Vertical jump, athleticism and court-specific training',
      features: isTr 
        ? ['Online Koçluk dahil', 'Sıçrama & patlayıcılık protokolü', 'Pozisyona özel antrenman', 'Video analiz & geri bildirim', 'Sakatlık önleme programı', 'Haftalık 1:1 görüntülü görüşme']
        : ['Online Coaching included', 'Jump & explosivity protocol', 'Position-specific training', 'Video analysis & feedback', 'Injury prevention program', 'Weekly 1:1 video call'],
      color: 'primary',
      popular: true,
      featured: true,
    },
    {
      name: isTr ? 'Premium Büyüme' : 'Premium Growth',
      price: isTr ? '5.500' : '150',
      period: isTr ? '/ay' : '/mo',
      desc: isTr ? 'TDEE destekli tam beslenme planı ile bütüncül koçluk' : 'Holistic coaching with TDEE-backed full nutrition plan',
      features: isTr 
        ? ['Voleybol Performance dahil', 'TDEE bazlı beslenme planı', 'Günlük makro takibi', 'Danışan portalı erişimi', 'Supplement rehberliği', '7/24 öncelikli destek', 'Aylık vücut analizi']
        : ['Volleyball Performance included', 'TDEE-based nutrition plan', 'Daily macro tracking', 'Client portal access', 'Supplement guidance', '24/7 priority support', 'Monthly body analysis'],
      color: 'accent',
      popular: false,
    },
  ];

  // Testimonial impact visual'ları: danışan gizliliği için Ela'nın gerçek
  // antrenman fotoğrafları kullanılır (coach perspektifi). Yazar avatarı
  // için hiper realistik AI üretimi temsili görseller kullanılır.
  const testimonials: Testimonial[] = [
    {
      text: isTr ? 'Sıçrama yüksekliğim 3 ayda 12cm arttı. Ela hocanın sistemi kesinlikle farklı klasmanda.' : 'My vertical jump increased 12cm in 3 months. Coach Ela\'s system is definitely in a different league.',
      name: 'Ayşe K.', role: isTr ? 'Voleybolcu' : 'Volleyball Player', metric: isTr ? '+12cm sıçrama' : '+12cm jump', image: '/ela_real_22.webp', avatar: '/images/testimonials/ayse.png'
    },
    {
      text: isTr ? 'Sakatsız, çok güçlü bir sezon geçiriyorum. Kuvvet antrenmanları inanılmaz etkili.' : 'I\'m having an injury-free, very strong season. The strength training is incredibly effective.',
      name: 'Deniz Y.', role: isTr ? 'Profesyonel Sporcu' : 'Professional Athlete', metric: isTr ? 'Sıfır Sakatlık' : 'Zero Injury', image: '/ela_real_25.webp', avatar: '/images/testimonials/deniz.png'
    },
    {
      text: isTr ? 'Kendime güvenim ve sahadaki çevikliğim seviye atladı. Tamamen maç performansıma özel program.' : 'My confidence and agility on the court leveled up. A program completely tailored to my match performance.',
      name: 'Selin B.', role: 'Fitness & Voleybol', metric: isTr ? '+8cm Mobilite' : '+8cm Mobility', image: '/ela_real_26.webp', avatar: '/images/testimonials/selin.png'
    },
  ];

  const faqItems: FAQItem[] = isTr ? [
    { q: 'Programa nasıl başlarım?', a: 'Başvuru formunu doldurduktan sonra WhatsApp üzerinden iletişime geçiyorum. Ücretsiz 15 dakikalık tanışma görüşmesinde hedeflerini konuşup, sana uygun programı belirliyoruz.' },
    { q: 'Online antrenman nasıl işliyor?', a: 'Sana özel hazırladığım program, video açıklamalı egzersizlerle uygulamanda gönderiliyor. Haftalık check-in\'lerle formu kontrol edip, programı gerektiğinde güncelliyorum.' },
    { q: 'Beslenme planı dahil mi?', a: 'Online Koçluk paketinde temel beslenme takibi var. Premium Büyüme paketinde ise günlük TDEE hesaplı tam beslenme planı, makro takibi ve birebir beslenme danışmanlığı dahil.' },
    { q: 'Voleybol oynamıyorum, katılabilir miyim?', a: 'Elbette! Voleybol Performance paketi sahaya özel olsa da, Online Koçluk ve Premium Büyüme paketleri her seviye için uygun. Kuvvet, postür ve genel fitness hedeflerine yönelik çalışıyoruz.' },
    { q: 'Sonuçları ne zaman görürüm?', a: 'Disiplinli takipte ilk 4 haftada gözle görülür değişim başlıyor. 3 aylık süreçte ciddi dönüşümler yaşanıyor. Her danışanın süreci farklı, ama tutarlılık her zaman sonuç verir.' },
  ] : [
    { q: 'How do I start the program?', a: 'After you fill out the application form, I contact you via WhatsApp. We discuss your goals in a free 15-minute introductory call and determine the suitable program.' },
    { q: 'How does online training work?', a: 'Your personalized program is sent via the app with video-explained exercises. I check your form with weekly check-ins and update the program when necessary.' },
    { q: 'Is a nutrition plan included?', a: 'Basic nutrition tracking is included in Online Coaching. The Premium Growth package includes a full TDEE-calculated nutrition plan, macro tracking, and 1-on-1 nutrition consulting.' },
    { q: 'I don\'t play volleyball, can I join?', a: 'Of course! Although the Volleyball Performance package is court-specific, Online Coaching and Premium Growth are suitable for all levels. We target strength, posture, and general fitness goals.' },
    { q: 'When will I see results?', a: 'With disciplined tracking, visible changes start in the first 4 weeks. Serious transformations occur over a 3-month period. Consistency always yields results.' },
  ];

  const landingStats: Stat[] = [
    { value: 20, suffix: '+', label: isTr ? 'Aktif Danışan' : 'Active Clients' },
    { value: 8, suffix: '+', label: isTr ? 'Yıl Voleybol' : 'Years Volleyball' },
    { value: 96, suffix: '', label: isTr ? 'Egzersiz Kütüphanesi' : 'Exercise Library' },
    { value: 100, suffix: '%', label: isTr ? 'Memnuniyet' : 'Satisfaction' },
  ];

  const navigationLinks = [
    { id: 'hakkinda', label: isTr ? 'Hakkında' : 'About' },
    { id: 'galeri', label: isTr ? 'Galeri' : 'Gallery' },
    { id: 'programlar', label: isTr ? 'Programlar' : 'Programs' },
    { id: 'sonuclar', label: isTr ? 'Sonuçlar' : 'Results' },
    { id: 'faqs', label: isTr ? 'SSS' : 'FAQs' },
    { id: 'iletisim', label: isTr ? 'İletişim' : 'Contact' },
  ];

  return {
    programs,
    testimonials,
    faqItems,
    landingStats,
    navigationLinks,
  };
};
