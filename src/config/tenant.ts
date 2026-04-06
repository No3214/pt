export const tenantConfig = {
  brand: {
    name: 'Ela Ebeoğlu',
    fullName: 'Ela Ebeoğlu Performance',
    tagline: 'Güçlü ol. Kendine güven.',
    logo: '/ela_hero.png',
    contact: {
      email: 'iletisim@elaebeoglu.com',
      phone: '+90 536 248 68 49',
      socials: {
        instagram: '@elaebeoglu',
        whatsapp: '+905362486849'
      }
    }
  },
  theme: {
    colors: {
      primary: '#C2684A', // Terracotta
      secondary: '#7A9E82', // Sage
      accent: '#4A6D88', // Coast
      bg: '#FAF6F1', // Creamy White
      bgAlt: '#F5F0EA',
      textMain: '#1C1917', // Dark Stone
      textMuted: '#78716C',
      sand: '#D4B483' // Rich Sand
    },
    darkTheme: {
      bg: '#0A0A0A',
      bgAlt: '#121212',
      textMain: '#FAFAF9',
      textMuted: '#A8A29E',
      sand: '#E6C9A8'
    }
  }
};

export type TenantConfig = typeof tenantConfig;
