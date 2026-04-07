import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Auto-detect browser language on first visit
const SUPPORTED_LANGS = ['tr', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar', 'ko', 'hi'];

function detectBrowserLanguage(): string {
  // Check URL param first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

  // Check if user already has a saved preference (Zustand persist)
  try {
    const stored = JSON.parse(localStorage.getItem('pt-app-storage') || '{}');
    if (stored?.state?.language && SUPPORTED_LANGS.includes(stored.state.language)) {
      return stored.state.language;
    }
  } catch { /* ignore */ }

  // Detect from browser
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const code = lang.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGS.includes(code)) return code;
  }

  return 'tr'; // Default
}

// Set detected language in Zustand store before render
const detectedLang = detectBrowserLanguage();
try {
  const stored = JSON.parse(localStorage.getItem('pt-app-storage') || '{}');
  if (!stored?.state?.language || !SUPPORTED_LANGS.includes(stored.state.language)) {
    const newStored = { ...stored, state: { ...(stored.state || {}), language: detectedLang } };
    localStorage.setItem('pt-app-storage', JSON.stringify(newStored));
  }
} catch { /* ignore */ }

// Set HTML dir for RTL languages
document.documentElement.dir = detectedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = detectedLang;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
