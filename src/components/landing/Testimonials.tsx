import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { getLandingData } from '../../data/landingData';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

export default function Testimonials() {
  const { darkMode, language } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;
  const { testimonials } = getLandingData(language);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [testimonials.length]);

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
            {t.testimonials.badge}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] text-text-main">
            {t.testimonials.title}
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
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[1.1rem] font-bold shadow-xl overflow-hidden shadow-black/20">
                        {testimonials[active].image ? (
                          <img src={testimonials[active].image} alt={testimonials[active].name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          testimonials[active].name.split(' ').map(w => w[0]).join('')
                        )}
                      </div>
                      <div>
                        <div className="text-[1.1rem] font-bold text-text-main">{testimonials[active].name}</div>
                        <div className="text-[0.8rem] uppercase tracking-widest text-text-main/40 mt-1">{testimonials[active].role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Visual Side — High Fidelity Result Image */}
                  <div className="relative group/image h-full min-h-[400px] flex items-center justify-center overflow-hidden rounded-[2.5rem]">
                    {/* Atmospheric Background Metric */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 1.2 }}
                      className={`absolute inset-0 flex items-center justify-center font-display font-black tracking-tighter leading-none select-none pointer-events-none ${dm ? 'text-white/[0.03]' : 'text-text-main/[0.03]'}`}
                      style={{ fontSize: '15rem' }}
                    >
                      {testimonials[active].metric.split(' ')[0]}
                    </motion.div>

                    {/* Primary Result Image */}
                    <motion.div 
                      initial={{ y: 40, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full max-h-[500px] z-10"
                    >
                      <div className={`absolute inset-0 rounded-[2rem] border-2 ${dm ? 'border-primary/20 bg-primary/5' : 'border-primary/10 bg-primary/5'} backdrop-blur-sm -rotate-2 scale-105 transition-transform duration-700 group-hover/image:rotate-0 group-hover/image:scale-110`} />
                      <img 
                        src={testimonials[active].image} 
                        alt={testimonials[active].name} 
                        className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10 border border-white/10"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-3xl shadow-xl z-20 flex flex-col items-center">
                        <span className="text-2xl font-black">{testimonials[active].metric.split(' ')[0]}</span>
                        <span className="text-[0.65rem] uppercase tracking-widest opacity-80 mt-1">{testimonials[active].metric.split(' ').slice(1).join(' ')}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-16">
              {testimonials.map((_: unknown, i: number) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-500 ${
                    i === active
                      ? 'bg-primary scale-125 shadow-lg shadow-primary/30'
                      : dm ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
} 