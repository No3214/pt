import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../stores/useStore';
import { getLandingData } from '../../data/landingData';
import { useTranslation, LANGUAGES } from '../../locales';
import { tenantConfig } from '../../config/tenant';

export default function Navbar() {
  const { darkMode, toggleDarkMode, language, setLanguage } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const dm = darkMode;
  const { navigationLinks } = getLandingData(language);
  const { t } = useTranslation();

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  // Set dir attribute for RTL languages
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          scrolled
            ? `backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.05)] ${dm ? 'bg-bg/90' : 'bg-bg/80'}`
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-5 flex justify-between items-center">
          {/* Logo / Brand Name */}
          <a href="#" className="font-display text-[1.6rem] font-bold no-underline tracking-tighter text-text-main group">
            {tenantConfig.brand.name}
            <span className="block h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navigationLinks.map(item => (
              <a key={item.id} href={`#${item.id}`}
                className={`no-underline text-[0.85rem] font-bold tracking-widest uppercase transition-all duration-500 hover:text-primary ${dm ? 'text-white/40' : 'text-text-main/40'}`}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex gap-4 items-center">
            {/* Language Dropdown - Desktop */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[0.75rem] font-bold tracking-wider transition-all cursor-pointer border ${dm ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/[0.03] border-black/5 text-text-main hover:bg-black/5'}`}
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.nativeName}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden z-50 ${dm ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/5'}`}
                  >
                    <div className="max-h-80 overflow-y-auto py-2">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer border-none text-sm ${
                            language === lang.code
                              ? 'bg-primary/10 text-primary font-bold'
                              : dm ? 'text-white/70 hover:bg-white/5 bg-transparent' : 'text-text-main/70 hover:bg-black/[0.03] bg-transparent'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="flex-1">{lang.nativeName}</span>
                          {language === lang.code && (
                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-none cursor-pointer ${dm ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-text-main hover:bg-black/10'}`}
              aria-label="Toggle theme">
              {dm ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 1 9-9 9 9 0 0 1-9 9zM12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              )}
            </button>
            <a href="/admin" className={`hidden md:inline-flex items-center px-6 py-3 rounded-full text-[0.8rem] font-bold tracking-widest uppercase no-underline transition-all duration-500 border-2 ${dm ? 'border-primary/20 text-white hover:bg-primary/10' : 'border-primary/10 text-text-main hover:bg-primary/5'}`}>
              {t.nav.portal}
            </a>

            {/* Mobile Menu Button */}
            <button className="md:hidden bg-transparent border-none cursor-pointer p-2 relative z-[101]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <div className="space-y-[6px]">
                <span className={`block w-6 h-[2px] rounded-full transition-all duration-500 bg-text-main ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                <span className={`block w-4 h-[2px] rounded-full transition-all duration-500 bg-text-main ml-auto ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-[2px] rounded-full transition-all duration-500 bg-text-main ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden fixed inset-0 flex flex-col items-center justify-center gap-8 z-[100] backdrop-blur-3xl overscroll-contain touch-none ${dm ? 'bg-bg/95' : 'bg-bg/95'}`}
            >
              {navigationLinks.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="no-underline text-3xl font-display font-bold tracking-tight text-text-main hover:text-primary transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              {/* Mobile Language Selector */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="w-64">
                <button
                  onClick={() => setMobileLangOpen(!mobileLangOpen)}
                  className="w-full px-6 py-3 rounded-full text-[0.85rem] font-bold uppercase tracking-widest border border-text-main/10 cursor-pointer bg-transparent text-text-main flex items-center justify-center gap-2"
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.nativeName}</span>
                  <svg className={`w-3 h-3 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileLangOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className={`rounded-2xl border max-h-48 overflow-y-auto ${dm ? 'bg-[#1a1a2e] border-white/10' : 'bg-white/90 border-black/5'}`}>
                        {LANGUAGES.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => { setLanguage(lang.code); setMobileLangOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer border-none text-sm ${
                              language === lang.code
                                ? 'bg-primary/10 text-primary font-bold'
                                : dm ? 'text-white/70 hover:bg-white/5 bg-transparent' : 'text-text-main/70 hover:bg-black/[0.03] bg-transparent'
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <a href="/admin" onClick={() => setMenuOpen(false)}
                  className="mt-2 px-10 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[0.85rem] shadow-2xl inline-block no-underline">
                  {t.nav.portal}
                </a>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
}
