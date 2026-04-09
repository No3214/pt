import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { 
  Counter, 
  MagneticButton, 
  AnimatedHeading, 
  fadeUp, 
  staggerContainer 
} from './LandingUI';
import { tenantConfig } from '../../config/tenant';
import { useTranslation } from '../../locales';

export default function Hero() {
  const { darkMode, language } = useStore();
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  const dm = darkMode;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale, willChange: 'transform, opacity' }} className="absolute inset-0 -z-10 image-grain">
        <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-b from-bg via-bg/60 to-bg' : 'bg-gradient-to-b from-bg via-bg/40 to-bg'}`} />
        <img src="/ela_real_32.png" alt="Ela antrenor arka plani" className="w-full h-full object-cover object-top opacity-[0.15] premium-image" loading="eager" decoding="async" />
      </motion.div>

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 -z-[5] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} custom={0}
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.15em] mb-10 ${dm ? 'bg-white/5 text-text-main/60 border border-text-main/10' : 'bg-black/[0.03] text-text-main/50 border border-black/[0.06]'}`}>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              {new Date().toLocaleString(language, { month: 'long', year: 'numeric' })} — {t.common.limitedSpots}
            </motion.div>

            <motion.h1 variants={staggerContainer} initial="hidden" animate="visible"
              className={`font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] mb-8 text-text-main`}>
              <AnimatedHeading text={t.hero.title1} />
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                <AnimatedHeading text={t.hero.title2} />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={4}
              className={`text-[1.1rem] leading-[1.8] max-w-[520px] mb-12 text-text-main/45`}>
              {t.hero.desc}
            </motion.p>

            <motion.div variants={fadeUp} custom={5} className="flex gap-4 flex-wrap">
              <MagneticButton href="#iletisim"
                className="group px-8 py-4 bg-primary text-white rounded-full text-[0.88rem] font-medium no-underline overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero.btnStart}
                  <motion.svg
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </span>
                <span className="absolute inset-0 bg-primary-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </MagneticButton>
              <MagneticButton href="#programlar"
                className={`px-8 py-4 rounded-full text-[0.88rem] font-medium no-underline border ${dm ? 'border-text-main/15 text-text-main/70 hover:text-text-main hover:border-text-main/30' : 'border-text-main/10 text-text-main/60 hover:text-text-main hover:border-text-main/25'}`}>
                {t.hero.btnPrograms}
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Hero Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] border border-text-main/5 shadow-2xl image-grain">
              <img src="/ela_real_30.png" alt={tenantConfig.brand.name} className="w-full h-full object-cover object-top premium-image" loading="eager" decoding="async" />
              <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-t from-bg/50 via-transparent' : 'bg-gradient-to-t from-bg/30 via-transparent'}`} />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
            </div>
            
            {/* Floating Metric Badges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
              className={`absolute -left-8 bottom-[20%] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl ${dm ? 'bg-white/10 border border-white/10' : 'bg-white/90 border border-black/5'}`}
            >
              <div className="text-3xl font-semibold text-primary"><Counter target={20} suffix="+" /></div>
              <div className={`text-[0.7rem] uppercase tracking-[0.12em] mt-1 ${dm ? 'text-white/50' : 'text-text-main/40'}`}>{t.hero.kpi.active}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              viewport={{ once: true }}
              className={`absolute -right-6 top-[15%] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl ${dm ? 'bg-white/10 border border-white/10' : 'bg-white/90 border border-black/5'}`}>
              <div className="text-3xl font-semibold text-secondary"><Counter target={5} suffix=".0" /></div>
              <div className={`text-[0.7rem] uppercase tracking-[0.12em] mt-1 ${dm ? 'text-white/50' : 'text-text-main/40'}`}>{t.hero.kpi.rating}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className={`text-[0.6rem] uppercase tracking-[0.25em] text-text-main/20`}>{t.common.scrollHint}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 ${dm ? 'border-text-main/20' : 'border-text-main/15'}`}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-1 h-1 rounded-full ${dm ? 'bg-text-main/60' : 'bg-text-main/40'}`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
