import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { getLandingData, type Testimonial } from '../../data/landingData';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

/* ═══════════════ Brand gradients ═══════════════ */
const GRADIENTS: Record<string, { from: string; to: string; mid: string; fg: string }> = {
  primary:   { from: '#C2684A', to: '#E89572', mid: '#D57A5E', fg: '#FFFFFF' },
  secondary: { from: '#7A9E82', to: '#A8C5AE', mid: '#91B198', fg: '#FFFFFF' },
  accent:    { from: '#4A6D88', to: '#7A9BB3', mid: '#62849E', fg: '#FFFFFF' },
  sand:      { from: '#D4B483', to: '#E8D0A8', mid: '#DEC296', fg: '#3A2E1F' },
};

/* ═══════════════ Animated metric counter ═══════════════ */
function AnimatedMetric({ value, color }: { value: string; color: string }) {
  const num = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  const prefix = value.startsWith('+') ? '+' : '';
  const suffix = value.replace(/^[+-]?[\d.]+/, '');
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(eased * num);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [num]);

  const rendered = num % 1 === 0 ? Math.round(display).toString() : display.toFixed(1);
  return (
    <span
      className="font-display font-black leading-none tracking-tighter tabular-nums"
      style={{ color, fontSize: 'clamp(4rem, 9vw, 7rem)' }}
    >
      {prefix}{isNaN(num) || num === 0 ? value.split(/\s/)[0] : `${rendered}${suffix}`}
    </span>
  );
}

/* ═══════════════ Premium animated testimonial visual ═══════════════ */
function TestimonialVisual({ t }: { t: Testimonial }) {
  const acc = t.accent || 'primary';
  const p = GRADIENTS[acc];
  const [metricValue, ...metricRest] = t.metric.split(' ');

  return (
    <div className="relative w-full h-full rounded-[2rem] shadow-2xl overflow-hidden z-10 border border-white/10">
      {/* Animated conic gradient background */}
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, ${p.from}, ${p.mid}, ${p.to}, ${p.mid}, ${p.from})`,
          filter: 'blur(2px)',
        }}
      />
      {/* Color-matched solid overlay so conic mostly shows through as tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${p.from}ee 0%, ${p.to}ee 100%)`,
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${p.fg} 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, ${p.fg} 0 1px, transparent 1px 40px)`,
        }}
      />

      {/* Floating particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 3) * 3,
            height: 6 + (i % 3) * 3,
            background: p.fg,
            left: `${15 + i * 18}%`,
            top: `${20 + (i * 37) % 60}%`,
            opacity: 0.35,
          }}
          animate={{
            y: [0, -14, 0],
            opacity: [0.2, 0.55, 0.2],
          }}
          transition={{
            duration: 3.6 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Pulsing glow behind avatar */}
      <motion.div
        className="absolute top-[22%] left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl"
        style={{ background: p.fg }}
        animate={{ opacity: [0.18, 0.38, 0.18], scale: [0.9, 1.08, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Radial corner glow */}
      <motion.div
        className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 rounded-full blur-3xl"
        style={{ background: p.fg }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbiting volleyball dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-[74%] h-[74%]">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-lg"
            style={{ background: p.fg, boxShadow: `0 0 20px ${p.fg}` }}
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
        {t.avatar && (
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Rotating ring */}
            <motion.div
              className="absolute -inset-3 rounded-full border-2"
              style={{ borderColor: p.fg, opacity: 0.45, borderStyle: 'dashed' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.img
              src={t.avatar}
              alt={t.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover shadow-2xl border-4 relative z-10"
              style={{ borderColor: p.fg }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedMetric value={metricValue} color={p.fg} />
        </motion.div>

        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-3 text-[0.82rem] uppercase tracking-[0.28em] font-semibold"
          style={{ color: p.fg, opacity: 0.88 }}
        >
          {metricRest.join(' ')}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 h-[2px] rounded-full"
          style={{ background: p.fg, opacity: 0.65, width: 72, transformOrigin: 'center' }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-4 text-[0.72rem] uppercase tracking-[0.24em] font-medium"
          style={{ color: p.fg, opacity: 0.78 }}
        >
          {t.role}
        </motion.div>
      </div>

      {/* Premium shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-120%' }}
        animate={{ x: '120%' }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${p.fg}22 50%, transparent 70%)`,
        }}
      />
    </div>
  );
}

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
                      {/* AI generated avatar for hyper realistic representation */}
                      {testimonials[active].avatar ? (
                        <img 
                          src={testimonials[active].avatar} 
                          alt={testimonials[active].name} 
                          className="w-16 h-16 rounded-full object-cover shadow-xl shadow-black/20 border-2 border-white/10"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[1.1rem] font-bold shadow-xl shadow-black/20 tracking-wider"
                          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                          aria-hidden
                        >
                          {testimonials[active].name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="text-[1.1rem] font-bold text-text-main">{testimonials[active].name}</div>
                        <div className="text-[0.8rem] uppercase tracking-widest text-text-main/40 mt-1">{testimonials[active].role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Visual Side — Branded gradient card with metric focus */}
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

                    {/* Primary Result Visual */}
                    <motion.div
                      initial={{ y: 40, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full max-h-[500px] z-10"
                    >
                      <div className={`absolute inset-0 rounded-[2rem] border-2 ${dm ? 'border-primary/20 bg-primary/5' : 'border-primary/10 bg-primary/5'} backdrop-blur-sm -rotate-2 scale-105 transition-transform duration-700 group-hover/image:rotate-0 group-hover/image:scale-110`} />

                      {testimonials[active].image ? (
                        <img
                          src={testimonials[active].image}
                          alt={`${testimonials[active].name} - Müşteri başarı fotoğrafı`}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10 border border-white/10"
                        />
                      ) : (
                        <TestimonialVisual t={testimonials[active]} />
                      )}

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

            {/* Gizlilik notu — danışan anonimliği için AI destekli temsili görseller kullanılmıştır */}
            <p className={`mt-10 text-center text-[0.72rem] uppercase tracking-[0.18em] ${dm ? 'text-white/30' : 'text-text-main/35'}`}>
              {language === 'tr'
                ? 'Gerçek danışan geri bildirimleri — gizlilik için isimler kısaltılmış ve temsili görseller kullanılmıştır.'
                : 'Real client testimonials — names abbreviated and representative imagery used for privacy.'}
            </p>

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