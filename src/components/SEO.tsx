import { useEffect } from 'react';
import { tenantConfig } from '../config/tenant';
import { useTranslation, LANGUAGES } from '../locales';
import { getLandingData } from '../data/landingData';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
}

const SEO_DESCRIPTIONS: Record<string, { title: string; description: string; keywords: string; locale: string }> = {
  tr: {
    title: `${tenantConfig.brand.fullName} — Kişiye Özel Online Koçluk`,
    description: 'Profesyonel voleybolcu Ela Ebeoğlu ile bilimsel temelli, kişiye özel antrenman ve beslenme programları.',
    keywords: 'personal training, voleybol antrenmanı, online koçluk, fitness, kişiye özel program, Ela Ebeoğlu',
    locale: 'tr_TR',
  },
  en: {
    title: `${tenantConfig.brand.fullName} — Personalized Online Coaching`,
    description: 'Science-based, personalized training and nutrition programs with professional volleyball player Ela Ebeoğlu.',
    keywords: 'personal training, volleyball training, online coaching, fitness, custom program, Ela Ebeoğlu',
    locale: 'en_US',
  },
  es: {
    title: `${tenantConfig.brand.fullName} — Entrenamiento Personal Online`,
    description: 'Programas de entrenamiento y nutrición personalizados con base científica con la jugadora profesional Ela Ebeoğlu.',
    keywords: 'entrenamiento personal, voleibol, coaching online, fitness, programa personalizado, Ela Ebeoğlu',
    locale: 'es_ES',
  },
  fr: {
    title: `${tenantConfig.brand.fullName} — Coaching Personnel en Ligne`,
    description: 'Programmes d\'entraînement et de nutrition personnalisés avec la volleyeuse professionnelle Ela Ebeoğlu.',
    keywords: 'entraînement personnel, volleyball, coaching en ligne, fitness, programme personnalisé, Ela Ebeoğlu',
    locale: 'fr_FR',
  },
  de: {
    title: `${tenantConfig.brand.fullName} — Personalisiertes Online-Coaching`,
    description: 'Wissenschaftlich fundierte, personalisierte Trainings- und Ernährungsprogramme mit Profi-Volleyballerin Ela Ebeoğlu.',
    keywords: 'Personal Training, Volleyball, Online-Coaching, Fitness, individuelles Programm, Ela Ebeoğlu',
    locale: 'de_DE',
  },
  it: {
    title: `${tenantConfig.brand.fullName} — Coaching Personale Online`,
    description: 'Programmi di allenamento e nutrizione personalizzati con la pallavolista professionista Ela Ebeoğlu.',
    keywords: 'personal training, pallavolo, coaching online, fitness, programma personalizzato, Ela Ebeoğlu',
    locale: 'it_IT',
  },
  pt: {
    title: `${tenantConfig.brand.fullName} — Treinamento Personal Online`,
    description: 'Programas de treino e nutrição personalizados com a jogadora profissional de vôlei Ela Ebeoğlu.',
    keywords: 'personal training, vôlei, coaching online, fitness, programa personalizado, Ela Ebeoğlu',
    locale: 'pt_BR',
  },
  ru: {
    title: `${tenantConfig.brand.fullName} — Персональный Онлайн-Тренинг`,
    description: 'Научно обоснованные, персонализированные программы тренировок и питания с профессиональной волейболисткой Эла Эбеоглу.',
    keywords: 'персональный тренинг, волейбол, онлайн-коучинг, фитнес, индивидуальная программа, Ela Ebeoğlu',
    locale: 'ru_RU',
  },
  zh: {
    title: `${tenantConfig.brand.fullName} — 个性化在线教练`,
    description: '与专业排球运动员Ela Ebeoğlu一起进行科学、个性化的训练和营养计划。',
    keywords: '私人训练, 排球训练, 在线教练, 健身, 定制计划, Ela Ebeoğlu',
    locale: 'zh_CN',
  },
  ja: {
    title: `${tenantConfig.brand.fullName} — パーソナライズドオンラインコーチング`,
    description: 'プロバレーボール選手Ela Ebeoğluによる科学に基づいた個別トレーニングと栄養プログラム。',
    keywords: 'パーソナルトレーニング, バレーボール, オンラインコーチング, フィットネス, カスタムプログラム, Ela Ebeoğlu',
    locale: 'ja_JP',
  },
  ar: {
    title: `${tenantConfig.brand.fullName} — تدريب شخصي عبر الإنترنت`,
    description: 'برامج تدريب وتغذية مخصصة قائمة على العلم مع لاعبة الكرة الطائرة المحترفة إيلا إبيوغلو.',
    keywords: 'تدريب شخصي, كرة طائرة, تدريب عبر الإنترنت, لياقة, برنامج مخصص, Ela Ebeoğlu',
    locale: 'ar_SA',
  },
  ko: {
    title: `${tenantConfig.brand.fullName} — 맞춤형 온라인 코칭`,
    description: '프로 배구 선수 Ela Ebeoğlu와 함께하는 과학 기반 맞춤형 트레이닝 및 영양 프로그램.',
    keywords: '퍼스널 트레이닝, 배구, 온라인 코칭, 피트니스, 맞춤 프로그램, Ela Ebeoğlu',
    locale: 'ko_KR',
  },
  hi: {
    title: `${tenantConfig.brand.fullName} — व्यक्तिगत ऑनलाइन कोचिंग`,
    description: 'पेशेवर वॉलीबॉल खिलाड़ी Ela Ebeoğlu के साथ विज्ञान-आधारित, व्यक्तिगत प्रशिक्षण और पोषण कार्यक्रम।',
    keywords: 'पर्सनल ट्रेनिंग, वॉलीबॉल, ऑनलाइन कोचिंग, फिटनेस, कस्टम प्रोग्राम, Ela Ebeoğlu',
    locale: 'hi_IN',
  },
};

export default function SEO({
  title,
  description,
  canonical = 'https://pt.kozbeylikonagi.com.tr',
  ogImage = '/ela_real_30.png',
  type = 'website',
}: SEOProps) {
  const { language } = useTranslation();
  const { faqItems } = getLandingData(language);
  const seoData = SEO_DESCRIPTIONS[language] || SEO_DESCRIPTIONS['tr'];

  const finalTitle = title || seoData.title;
  const finalDesc = description || seoData.description;

  useEffect(() => {
    document.title = finalTitle;
    document.documentElement.lang = language;

    const metaTags: Record<string, string> = {
      description: finalDesc,
      'og:title': finalTitle,
      'og:description': finalDesc,
      'og:image': ogImage.startsWith('http') ? ogImage : `${canonical}${ogImage}`,
      'og:url': canonical,
      'og:type': type,
      'og:site_name': tenantConfig.brand.fullName,
      'og:locale': seoData.locale,
      'twitter:card': 'summary_large_image',
      'twitter:title': finalTitle,
      'twitter:description': finalDesc,
      'twitter:image': ogImage.startsWith('http') ? ogImage : `${canonical}${ogImage}`,
      'robots': 'index, follow, max-image-preview:large, max-snippet:-1',
      'author': tenantConfig.brand.name,
      'keywords': seoData.keywords,
    };

    // Add alternate locales for all languages
    const alternateLocales = LANGUAGES
      .filter(l => l.code !== language)
      .map(l => SEO_DESCRIPTIONS[l.code]?.locale)
      .filter(Boolean);

    alternateLocales.forEach((locale, i) => {
      metaTags[`og:locale:alternate_${i}`] = locale!;
    });

    Object.entries(metaTags).forEach(([key, value]) => {
      const isOg = key.startsWith('og:');
      const isTwitter = key.startsWith('twitter:');

      let selector: string;
      if (isOg) selector = `meta[property="${key}"]`;
      else if (isTwitter) selector = `meta[name="${key}"]`;
      else selector = `meta[name="${key}"]`;

      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        if (isOg) el.setAttribute('property', key);
        else el.setAttribute('name', key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    });

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    // Hreflang links for multilingual SEO
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    LANGUAGES.forEach(lang => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang.code);
      link.setAttribute('href', `${canonical}?lang=${lang.code}`);
      document.head.appendChild(link);
    });
    const defaultLink = document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', canonical);
    document.head.appendChild(defaultLink);

    // JSON-LD Structured Data
    const existingLd = document.querySelector('script[data-seo="ld"]');
    if (existingLd) existingLd.remove();

    // FAQ Schema (FAQPage)
    const existingFaqLd = document.querySelector('script[data-seo="faq-ld"]');
    if (existingFaqLd) existingFaqLd.remove();

    if (faqItems.length > 0) {
      const faqScript = document.createElement('script');
      faqScript.setAttribute('type', 'application/ld+json');
      faqScript.setAttribute('data-seo', 'faq-ld');
      faqScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      });
      document.head.appendChild(faqScript);
    }

    // LocalBusiness Schema
    const ldScript = document.createElement('script');
    ldScript.setAttribute('type', 'application/ld+json');
    ldScript.setAttribute('data-seo', 'ld');
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: tenantConfig.brand.fullName,
      description: finalDesc,
      url: canonical,
      image: ogImage.startsWith('http') ? ogImage : `${canonical}${ogImage}`,
      telephone: tenantConfig.brand.contact.phone,
      email: tenantConfig.brand.contact.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'İstanbul',
        addressCountry: 'TR',
      },
      sameAs: [
        `https://instagram.com/${tenantConfig.brand.contact.socials.instagram.replace('@', '')}`,
      ],
      priceRange: '₺₺',
      availableLanguage: LANGUAGES.map(l => l.name),
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '21:00',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '20',
        bestRating: '5',
      },
    });
    document.head.appendChild(ldScript);

    return () => {
      const ld = document.querySelector('script[data-seo="ld"]');
      if (ld) ld.remove();
      const faqLd = document.querySelector('script[data-seo="faq-ld"]');
      if (faqLd) faqLd.remove();
      document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    };
  }, [finalTitle, finalDesc, canonical, ogImage, type, language, seoData.locale, seoData.keywords, faqItems]);

  return null;
}
