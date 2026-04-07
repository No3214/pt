import { useStore } from '../stores/useStore';
import { tr } from './tr';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { ru } from './ru';
import { zh } from './zh';
import { ja } from './ja';
import { ar } from './ar';
import { ko } from './ko';
import { hi } from './hi';

const dictionaries: Record<string, typeof tr> = {
  tr,
  en: en as unknown as typeof tr,
  es: es as unknown as typeof tr,
  fr: fr as unknown as typeof tr,
  de: de as unknown as typeof tr,
  it: it as unknown as typeof tr,
  pt: pt as unknown as typeof tr,
  ru: ru as unknown as typeof tr,
  zh: zh as unknown as typeof tr,
  ja: ja as unknown as typeof tr,
  ar: ar as unknown as typeof tr,
  ko: ko as unknown as typeof tr,
  hi: hi as unknown as typeof tr,
};

export type Dictionary = typeof tr;
export type LanguageCode = keyof typeof dictionaries;

export const LANGUAGES: { code: string; name: string; nativeName: string; flag: string }[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

// Locale string mapping for Intl APIs (date, number, currency)
export const LOCALE_MAP: Record<string, string> = {
  tr: 'tr-TR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
  it: 'it-IT', pt: 'pt-BR', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP',
  ar: 'ar-SA', ko: 'ko-KR', hi: 'hi-IN',
};

// Currency per language (admin panel)
export const CURRENCY_MAP: Record<string, string> = {
  tr: '₺', en: '$', es: '€', fr: '€', de: '€',
  it: '€', pt: 'R$', ru: '₽', zh: '¥', ja: '¥',
  ar: 'ر.س', ko: '₩', hi: '₹',
};

export function useTranslation() {
  const { language } = useStore();
  const t = dictionaries[language] || dictionaries['tr'];
  const locale = LOCALE_MAP[language] || 'tr-TR';
  const currency = CURRENCY_MAP[language] || '₺';
  return { t, language, locale, currency };
}
