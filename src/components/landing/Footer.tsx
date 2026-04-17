import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { tenantConfig } from '../../config/tenant';
import { getLandingData } from '../../data/landingData';
import { useTranslation } from '../../locales';
import LegalModal from '../LegalModals';

export default function Footer() {
  const { darkMode, language } = useStore();
  const dm = darkMode;
  const currentYear = new Date().getFullYear();
  const { navigationLinks } = getLandingData(language);
  const { t } = useTranslation();
  const [legalModal, setLegalModal] = useState<'kvkk' | 'terms' | null>(null);

  const SOCIALS = [
    { name: 'Instagram', url: `https://instagram.com/${tenantConfig.brand.contact.socials.instagram.replace('@', '')}`, icon: '📸' },
    { name: 'WhatsApp', url: `https://wa.me/${tenantConfig.brand.contact.phone.replace(/[^0-9]/g, '')}`, icon: '💬' },
  ];

  return (
    <footer className="py-24 bg-bg border-t border-text-main/5 relative">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-16 md:gap-24 mb-24">
          <div className="space-y-8">
            <a href="#" className="font-display text-[1.8rem] font-bold no-underline tracking-tighter text-text-main group">
              {tenantConfig.brand.name}
            </a>
            <p className="text-[1.1rem] leading-relaxed text-text-main/40 max-w-[400px] font-medium">
              {t.hero.desc}
            </p>
            <div className="flex gap-4">
              {SOCIALS.map(s => (
                <motion.a
                  key={s.name}
                  whileHover={{ scale: 1.1, y: -4 }}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg border transition-all duration-500 no-underline ${
                    dm ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/5 text-text-main'
                  }`}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[0.75rem] font-bold uppercase tracking-widest text-primary">
              {t.footer.nav}
            </h3>
            <nav className="flex flex-col gap-5">
              {navigationLinks.map(l => (
                <a key={l.id} href={`#${l.id}`} className="no-underline text-[1.05rem] font-bold text-text-main/40 hover:text-primary transition-all duration-300">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            <h3 className="text-[0.75rem] font-bold uppercase tracking-widest text-primary">{t.nav.contact}</h3>
            <div className="flex flex-col gap-6">
              <a href={`mailto:${tenantConfig.brand.contact.email}`} className="no-underline text-[1.05rem] font-bold text-text-main/40 hover:text-primary transition-all duration-300">
                {tenantConfig.brand.contact.email}
              </a>
              <span className="text-[1.3rem] font-display font-bold text-text-main">
                {tenantConfig.brand.contact.phone}
              </span>
              <div className="pt-2">
                <span className={`inline-flex px-4 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-tighter ${dm ? 'bg-green-500/10 text-green-500' : 'bg-green-500/10 text-green-700'}`}>
                  {t.contact.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-text-main/5 gap-8">
          <div className="text-[0.85rem] font-medium text-text-main/30">
            © {currentYear} {tenantConfig.brand.name}. {t.footer.rights}
          </div>
          <div className="flex gap-10">
            <button
              onClick={() => setLegalModal('terms')}
              className="bg-transparent border-none cursor-pointer text-[0.8rem] font-bold uppercase tracking-widest text-text-main/20 hover:text-text-main transition-colors p-0"
            >
              {t.footer.terms}
            </button>
            <button
              onClick={() => setLegalModal('kvkk')}
              className="bg-transparent border-none cursor-pointer text-[0.8rem] font-bold uppercase tracking-widest text-text-main/20 hover:text-text-main transition-colors p-0"
            >
              {t.footer.privacy}
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      <LegalModal
        isOpen={legalModal !== null}
        onClose={() => setLegalModal(null)}
        type={legalModal || 'kvkk'}
      />
    </footer>
  );
}
