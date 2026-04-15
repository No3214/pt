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

// Expose `admin` block also under `portal.admin` so components can use t.portal.admin.*
// (admin is defined as a top-level sibling in the locale files)
type RawDict = typeof tr
type AdminPatched<T extends RawDict> = Omit<T, 'portal'> & { portal: T['portal'] & { admin: T['admin'] } }
function patchAdmin<T extends RawDict>(d: T): AdminPatched<T> {
  return { ...d, portal: { ...d.portal, admin: d.admin } } as AdminPatched<T>
}

const trFull = patchAdmin(tr)

const dictionaries: Record<string, typeof trFull> = {
  tr: trFull,
  en: patchAdmin(en as unknown as typeof tr),
  es: patchAdmin(es as unknown as typeof tr),
  fr: patchAdmin(fr as unknown as typeof tr),
  de: patchAdmin(de as unknown as typeof tr),
  it: patchAdmin(it as unknown as typeof tr),
  pt: patchAdmin(pt as unknown as typeof tr),
  ru: patchAdmin(ru as unknown as typeof tr),
  zh: patchAdmin(zh as unknown as typeof tr),
  ja: patchAdmin(ja as unknown as typeof tr),
  ar: patchAdmin(ar as unknown as typeof tr),
  ko: patchAdmin(ko as unknown as typeof tr),
  hi: patchAdmin(hi as unknown as typeof tr),
};

export type Dictionary = typeof trFull;
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
