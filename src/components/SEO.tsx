import { useEffect } from 'react';
import { tenantConfig } from '../config/tenant';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
}

export default function SEO({
  title = `${tenantConfig.brand.fullName} — Kişiye Özel Online Koçluk`,
  description = 'Profesyonel voleybolcu Ela Ebeoğlu ile bilimsel temelli, kişiye özel antrenman ve beslenme programları. Voleybol performans, güç antrenmanı ve online koçluk hizmetleri.',
  canonical = 'https://pt.kozbeylikonagi.com.tr',
  ogImage = '/ela_real_30.png',
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta tags
    const metaTags: Record<string, string> = {
      description,
      'og:title': title,
      'og:description': description,
      'og:image': ogImage.startsWith('http') ? ogImage : `${canonical}${ogImage}`,
      'og:url': canonical,
      'og:type': type,
      'og:site_name': tenantConfig.brand.fullName,
      'og:locale': 'tr_TR',
      'og:locale:alternate': 'en_US',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage.startsWith('http') ? ogImage : `${canonical}${ogImage}`,
      'robots': 'index, follow, max-image-preview:large, max-snippet:-1',
      'author': tenantConfig.brand.name,
      'keywords': 'personal training, voleybol antrenmanı, online koçluk, fitness, kişiye özel program, Ela Ebeoğlu, volleyball training, strength training, İstanbul PT',
    };

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

    // JSON-LD Structured Data
    const existingLd = document.querySelector('script[data-seo="ld"]');
    if (existingLd) existingLd.remove();

    const ldScript = document.createElement('script');
    ldScript.setAttribute('type', 'application/ld+json');
    ldScript.setAttribute('data-seo', 'ld');
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: tenantConfig.brand.fullName,
      description,
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
    };
  }, [title, description, canonical, ogImage, type]);

  return null;
}
