import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useStore } from '../../stores/useStore';
import { navigationLinks } from '../../data/landingData';
import { tenantConfig } from '../../config/tenant';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dm = darkMode;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            <button onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-none cursor-pointer ${dm ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-text-main hover:bg-black/10'}`}
              aria-label="Tema değiştir">
              {dm ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 1 9-9 9 9 0 0 1-9 9zM12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              )}
            </button>
            <a href="/admin" className={`hidden md:inline-flex items-center px-6 py-3 rounded-full text-[0.8rem] font-bold tracking-widest uppercase no-underline transition-all duration-500 border-2 ${dm ? 'border-primary/20 text-white hover:bg-primary/10' : 'border-primary/10 text-text-main hover:bg-primary/5'}`}>
              Giriş Yap
            </a>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden bg-transparent border-none cursor-pointer p-2 z-[101]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
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
              className={`md:hidden fixed inset-0 flex flex-col items-center justify-center gap-10 z-[100] backdrop-blur-3xl ${dm ? 'bg-bg/95' : 'bg-bg/95'}`}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <a href="/admin" onClick={() => setMenuOpen(false)}
                  className="mt-10 px-10 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[0.85rem] shadow-2xl inline-block no-underline">
                  Yönetim Paneli
                </a>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
}
