import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../stores/useStore';
import { tenantConfig } from '../../config/tenant';

export default function PortalHeader() {
  const { darkMode: dm, toggleDarkMode, habits } = useStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Günaydın');
    else if (h < 18) setGreeting('İyi Günler');
    else setGreeting('İyi Akşamlar');
  }, []);

  const doneCount = habits.filter(Boolean).length;

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b transition-all duration-500 ${
      dm ? 'bg-bg/80 border-white/5' : 'bg-white/80 border-black/5'
    }`}>
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group no-underline">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">PT</span>
          </div>
          <div>
            <span className="block font-display font-bold text-lg text-text-main leading-tight">
              {tenantConfig.brand.name}
            </span>
            <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-text-main/30 font-bold">
              Rookie Tier · Sporcu Portalı
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[0.8rem] font-bold text-text-main opacity-40 uppercase tracking-widest leading-none">
              {greeting}, Şampiyon
            </span>
            <span className={`text-[0.7rem] font-bold mt-1.5 ${doneCount === 4 ? 'text-secondary' : 'text-primary'}`}>
              {doneCount}/4 Hedef Tamamlandı
            </span>
          </div>

          <div className="h-8 w-px bg-text-main/10 hidden md:block" />

          <button
            onClick={toggleDarkMode}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border-none cursor-pointer ${
              dm ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-text-main hover:bg-black/10'
            }`}
          >
            {dm ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21a9 9 0 1 1 9-9 9 9 0 0 1-9 9zM12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
