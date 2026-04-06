import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { getLandingData } from '../../data/landingData';
import { useStore } from '../../stores/useStore';

export default function Testimonials() {
  const { darkMode, language } = useStore();
  const dm = darkMode;
  const { testimonials } = getLandingData(language);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(prev => (prev + 1) % testimonials.length), 6000);
  };

  return (
    <section id="sonuclar" className="py-32 md:py-40 bg-bg-alt border-y border-text-main/5">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="text-center md:text-left mb-20">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
            {language === 'tr' ? 'Sonuçlar' : 'Results'}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] text-text-main">
            {language === 'tr' ? 'Onların hikayesi, senin motivasyonun.' : 'Their story, your motivation.'}
          </motion.h2>
        </RevealSection>

        <RevealSection>
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid md:grid-cols-[1.4fr_1fr] gap-12 lg:gap-24 items-center"
                >
                  {/* Quote Container */}
                  <div className={`relative p-10 md:p-16 rounded-[2.5rem] border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-white shadow-2xl'}`}>
                    <div className="absolute top-8 right-12 text-[8rem] font-display font-bold leading-none select-none text-primary/10 opacity-20">"</div>
                    
                    <div className={`inline-flex px-5 py-2 rounded-full text-[0.75rem] font-bold tracking-widest uppercase mb-10 ${dm ? 'bg-secondary/20 text-secondary' : 'bg-secondary/10 text-secondary'}`}>
                      {testimonials[active].metric}
                    </div>
                    
                    <p className={`font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.45] font-medium mb-12 italic ${dm ? 'text-white/90' : 'text-text-main/80'}`}>
                      "{testimonials[active].text}"
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[1.1rem] font-bold shadow-xl">
                        {testimonials[active].name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div className="text-[1.1rem] font-bold text-text-main">{testimonials[active].name}</div>
                        <div className="text-[0.8rem] uppercase tracking-widest text-text-main/40 mt-1">{testimonials[active].role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Visual Side */}
                  <div className="flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1, type: 'spring' }}
                      className={`text-[clamp(5rem,15vw,12rem)] font-display font-bold tracking-tighter leading-none ${dm ? 'text-white/5' : 'text-text-main/[0.04]'}`}
                    >
                      {testimonials[active].metric.split(' ')[0]}
                    </motion.div>
                    <div className="text-[0.85rem] uppercase tracking-[0.4em] mt-2 text-text-main/20 font-bold">
                      {language === 'tr' ? 'Kanıtlanmış Sonuç' : 'Proven Result'}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Navigation */}
            <div className="flex gap-4 justify-center mt-16">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`group relative h-2 cursor-pointer transition-all duration-700 border-none outline-none overflow-hidden ${
                    i === active ? 'w-12 rounded-full' : 'w-2 rounded-full bg-text-main/10'
                  }`}
                  aria-label={`Story ${i + 1}`}
                >
                  {i === active && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute inset-0 bg-primary"
                    />
                  )}
                  {i !== active && (
                    <div className={`absolute inset-0 bg-text-main/20 group-hover:bg-primary/40 transition-colors`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
