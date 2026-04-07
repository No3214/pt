import { useState } from 'react';
import { RevealSection, fadeUp } from './LandingUI';
import { getLandingData } from '../../data/landingData';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

export default function Programs() {
  const { darkMode, language } = useStore();
  const [showComparison, setShowComparison] = useState(false);
  const dm = darkMode;
  const { programs } = getLandingData(language);
  const { t } = useTranslation();

  return (
    <section id="programlar" className="py-32 md:py-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="text-center mb-24">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">
            {t.programs.badge}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em] text-text-main mb-8">
            {t.programs.title}
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
        </RevealSection>

        <RevealSection className="grid md:grid-cols-3 gap-8 items-stretch">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="flex h-full"
            >
              <div
                className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 h-full w-full ${
                  p.popular
                    ? `${dm ? 'bg-primary/10 border-primary/30 shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.15)]' : 'bg-primary/5 border-primary/20 shadow-2xl shadow-primary/10'}`
                    : `${dm ? 'border-text-main/10 bg-text-main/[0.03]' : 'border-text-main/10 bg-white'}`
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary text-white text-[0.75rem] font-bold uppercase tracking-widest shadow-xl">
                    {language === 'tr' ? 'En Popüler' : 'Most Popular'}
                  </div>
                )}

                <div className="mb-10">
                  <h3 className="font-display text-2xl font-bold mb-3 text-text-main">{p.name}</h3>
                  <p className="text-[0.95rem] leading-relaxed text-text-main/40 font-medium">{p.desc}</p>
                </div>

                <div className="mb-12 space-y-4 flex-1">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="mt-1.5 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[0.92rem] text-text-main/60 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-lg font-bold text-text-main/30">₺</span>
                    <span className="text-5xl font-bold tracking-tighter text-text-main">{p.price}</span>
                    <span className="text-[0.9rem] font-medium text-text-main/30">/ay</span>
                  </div>
                  
                  <a href="#iletisim"
                    className={`block text-center py-5 rounded-2xl text-[1rem] font-bold no-underline transition-all duration-500 ${
                      p.popular
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark'
                        : `border-2 border-primary/10 text-text-main/70 hover:border-primary/30 hover:text-text-main`
                    }`}>
                    {p.popular ? t.hero.btnStart : t.programs.btnPurchase}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </RevealSection>

        <RevealSection className="mt-20 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[0.85rem] font-bold uppercase tracking-widest text-text-main/50 hover:text-primary transition-all duration-300 border border-text-main/10 hover:border-primary/20 bg-text-main/[0.02]"
          >
            {showComparison ? (language === 'tr' ? 'Kıyaslamayı Kapat' : 'Close Comparison') : (language === 'tr' ? 'Tüm Özellikleri Kıyasla' : 'Compare All Features')}
            <svg className={`w-4 h-4 transition-transform duration-500 ${showComparison ? 'rotate-180' : 'group-hover:translate-y-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </RevealSection>

        {/* Comparison Reveal */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 overflow-hidden rounded-[2.5rem] border border-text-main/5 bg-text-main/[0.01] p-4 md:p-10"
            >
              <table className="w-full min-w-[600px] text-left text-[0.95rem]">
                <thead>
                  <tr className="border-b border-text-main/5">
                    <th className="p-6 font-bold text-text-main/30 uppercase tracking-[0.2em] text-[0.7rem]">{language === 'tr' ? 'Özellikler' : 'Features'}</th>
                    {programs.map(p => (
                      <th key={p.name} className={`p-6 font-bold text-[1.2rem] ${p.popular ? 'text-primary' : 'text-text-main'}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-text-main/60">
                  {(language === 'tr' ? [
                    { feature: 'Kişiye Özel Antrenman', v: ['check', 'check', 'check'] },
                    { feature: 'Haftalık Check-in', v: ['check', 'check', 'check'] },
                    { feature: 'WhatsApp Destek', v: ['check', 'check', 'check'] },
                    { feature: 'Sıçrama & Atletizm', v: ['no', 'check', 'check'] },
                    { feature: 'Video Analiz', v: ['no', 'check', 'check'] },
                    { feature: 'Beslenme Takibi', v: ['no', 'no', 'check'] },
                    { feature: '7/24 VIP Erişim', v: ['no', 'no', 'check'] },
                  ] : [
                    { feature: 'Custom Training', v: ['check', 'check', 'check'] },
                    { feature: 'Weekly Check-in', v: ['check', 'check', 'check'] },
                    { feature: 'WhatsApp Support', v: ['check', 'check', 'check'] },
                    { feature: 'Jump & Athleticism', v: ['no', 'check', 'check'] },
                    { feature: 'Video Analysis', v: ['no', 'check', 'check'] },
                    { feature: 'Nutrition Tracking', v: ['no', 'no', 'check'] },
                    { feature: '24/7 VIP Access', v: ['no', 'no', 'check'] },
                  ]).map((row, i) => (
                    <tr key={i} className="border-b border-text-main/[0.02] last:border-0 hover:bg-text-main/[0.01] transition-all">
                      <td className="p-6 font-semibold">{row.feature}</td>
                      {row.v.map((v, j) => (
                        <td key={j} className={`p-6 text-center ${j === 1 ? 'bg-primary/[0.01]' : ''}`}>
                          {v === 'check' ? <span className="text-secondary text-2xl">✓</span> : <span className="text-text-main/10 text-xl">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
