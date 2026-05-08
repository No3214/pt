import { useState } from 'react';
import { RevealSection, fadeUp } from './LandingUI';
import { getLandingData } from '../../data/landingData';
import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import ShineBorder from '../animations/3d/ShineBorder';

export default function Programs() {
  const { darkMode, language } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const dm = darkMode;
  const { programs } = getLandingData(language);

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'volleyball', label: 'Voleybol' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'rehab', label: 'Rehabilitasyon' },
    { id: 'mental', label: 'Zihinsel Performans' }
  ];

  return (
    <section id="programlar" className="py-32 md:py-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="text-center mb-20">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">
            ARENA MARKETPLACE
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em] text-text-main mb-12">
            Hedefine Uygun <br /> <span className="text-primary">Eğitimi Seç.</span>
          </motion.h2>

          {/* Marketplace Category Filters */}
          <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[0.8rem] font-bold tracking-widest transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-transparent text-text-main/40 border-text-main/10 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex h-full"
            >
              <ShineBorder
                borderRadius={40}
                borderWidth={p.popular ? 1.6 : 0}
                duration={p.popular ? 10 : 20}
                color={p.popular ? ['#C8A97E', '#D4A574', '#8B7355'] : 'transparent'}
                className="w-full h-full"
              >
              <div
                className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 h-full w-full ${
                  p.popular
                    ? `${dm ? 'bg-primary/10 border-primary/30 shadow-2xl' : 'bg-primary/5 border-primary/20 shadow-2xl shadow-primary/10'}`
                    : `${dm ? 'border-text-main/10 bg-text-main/[0.03]' : 'border-text-main/10 bg-white'}`
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary text-white text-[0.75rem] font-bold uppercase tracking-widest shadow-xl">
                    POPÜLER SEÇİM
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.6rem] font-black uppercase tracking-widest">
                      {i % 2 === 0 ? "Voleybol" : "Performance"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                      <span>★</span> 4.9
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 text-text-main">{p.name}</h3>
                  <p className="text-[0.85rem] leading-relaxed text-text-main/40 font-medium line-clamp-2">{p.desc}</p>
                </div>

                {/* Marketplace Enrollment Meta */}
                <div className="flex items-center gap-4 mb-8 text-[0.7rem] font-bold uppercase tracking-widest text-text-main/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary">👤</span> {Math.floor(Math.random() * 200) + 50} Katılımcı
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary">🕒</span> 12 Hafta
                  </div>
                </div>

                {/* Coach Badge */}
                <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-text-main/[0.02] border border-text-main/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-sand/20">
                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Coach" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-black uppercase tracking-widest text-text-main/30 leading-none mb-1">Eğitmen</p>
                    <p className="text-[0.75rem] font-bold text-text-main">{i === 1 ? "Baş Antrenör" : "Elite Network Coach"}</p>
                  </div>
                </div>

                <div className="mb-10 space-y-3.5 flex-1">
                  {p.features.slice(0, 4).map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="mt-1 w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[0.85rem] text-text-main/50 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-text-main/5">
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-lg font-bold text-text-main/30">₺</span>
                    <span className="text-5xl font-bold tracking-tighter text-text-main">{p.price}</span>
                    <span className="text-[0.9rem] font-medium text-text-main/30">/tek sefer</span>
                  </div>

                  <a href="#iletisim"
                    className={`block text-center py-5 rounded-2xl text-[1rem] font-bold no-underline transition-all duration-500 ${
                      p.popular
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50'
                        : `bg-text-main text-bg hover:opacity-90`
                    }`}>
                    Eğitime Kaydol
                  </a>
                </div>
              </div>
              </ShineBorder>
            </motion.div>
          ))}
        </RevealSection>
      </div>
    </section>
  );
}
