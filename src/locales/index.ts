import { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { tr } from './tr'
import { en } from './en'

// Expose `admin` block also under `portal.admin` so components can use t.portal.admin.*
// (admin is defined as a top-level sibling in the locale files)
type RawDict = typeof tr
type AdminPatched<T extends RawDict> = Omit<T, 'portal'> & { portal: T['portal'] & { admin: T['admin'] } }
function patchAdmin<T extends RawDict>(d: T): AdminPatched<T> {
  return { ...d, portal: { ...d.portal, admin: d.admin } } as AdminPatched<T>
}

const trFull = patchAdmin(tr)
const enFull = patchAdmin(en as unknown as typeof tr)

export type Dictionary = typeof trFull
export type LanguageCode = 'tr' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ar' | 'ko' | 'hi'

// Eagerly loaded baseline — TR (primary) + EN (fallback). ~90KB raw.
const eager: Partial<Record<LanguageCode, Dictionary>> = {
  tr: trFull,
  en: enFull,
}

// Runtime cache of lazily imported locales.
const cache: Partial<Record<LanguageCode, Dictionary>> = { ...eager }

// Dynamic loaders — each becomes its own code-split chunk via Vite.
const loaders: Record<Exclude<LanguageCode, 'tr' | 'en'>, () => Promise<{ [k: string]: unknown }>> = {
  es: () => import('./es'),
  fr: () => import('./fr'),
  de: () => import('./de'),
  it: () => import('./it'),
  pt: () => import('./pt'),
  ru: () => import('./ru'),
  zh: () => import('./zh'),
  ja: () => import('./ja'),
  ar: () => import('./ar'),
  ko: () => import('./ko'),
  hi: () => import('./hi'),
}

/** In-flight promise map so concurrent consumers share a single import. */
const pending: Partial<Record<LanguageCode, Promise<Dictionary>>> = {}

async function loadLocale(code: LanguageCode): Promise<Dictionary> {
  if (cache[code]) return cache[code] as Dictionary
  if (code === 'tr' || code === 'en') return cache[code] as Dictionary
  if (pending[code]) return pending[code] as Promise<Dictionary>
  const p = loaders[code]().then((mod) => {
    const raw = (mod[code] ?? Object.values(mod)[0]) as typeof tr
    const patched = patchAdmin(raw as unknown as typeof tr)
    cache[code] = patched
    delete pending[code]
    return patched
  })
  pending[code] = p
  return p
}

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
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
]

// Locale string mapping for Intl APIs (date, number, currency)
export const LOCALE_MAP: Record<string, string> = {
  tr: 'tr-TR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
  it: 'it-IT', pt: 'pt-BR', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP',
  ar: 'ar-SA', ko: 'ko-KR', hi: 'hi-IN',
}

// Currency per language (admin panel)
export const CURRENCY_MAP: Record<string, string> = {
  tr: '₺', en: '$', es: '€', fr: '€', de: '€',
  it: '€', pt: 'R$', ru: '₽', zh: '¥', ja: '¥',
  ar: 'ر.س', ko: '₩', hi: '₹',
}

function isKnownLang(code: string): code is LanguageCode {
  return code in LOCALE_MAP
}

/**
 * useTranslation — synchronous by contract.
 * TR+EN are always available immediately. Other locales resolve asynchronously
 * and fall back to EN (then TR) until the dynamic chunk lands. On resolution,
 * state updates and the component re-renders with the real dictionary.
 */
export function useTranslation() {
  const { language } = useStore()
  const code: LanguageCode = isKnownLang(language) ? language : 'tr'
  const [dict, setDict] = useState<Dictionary>(() => cache[code] ?? enFull ?? trFull)

  useEffect(() => {
    const cached = cache[code]
    if (cached) {
      setDict(cached)
      return
    }
    let cancelled = false
    loadLocale(code).then((d) => {
      if (!cancelled) setDict(d)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  const locale = LOCALE_MAP[code] || 'tr-TR'
  const currency = CURRENCY_MAP[code] || '₺'
  return { t: dict, language: code, locale, currency }
}

/** Preload a locale without switching to it (e.g. on hover of a picker item). */
export function preloadLocale(code: LanguageCode): Promise<Dictionary> {
  return loadLocale(code)
}
