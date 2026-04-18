import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import {
  Counter,
  AnimatedHeading,
  fadeUp,
  staggerContainer
} from './LandingUI';
import MagneticButton from '../animations/MagneticButton';
import { tenantConfig } from '../../config/tenant';
import { useTranslation } from '../../locales';
import { VolleyballFloaters, VolleyballSpike } from '../animations/Volleyball';
import GradientText from '../animations/GradientText';
import Spotlight from '../animations/3d/Spotlight';

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
      {/* Parallax Background — ARENA branded animated scene */}
      <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale, willChange: 'transform, opacity' }} className="absolute inset-0 -z-10 image-grain overflow-hidden">
        {/* rotating conic brand gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-[20%] opacity-[0.22]"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(194,104,74,0.6), rgba(122,158,130,0.4), rgba(74,109,136,0.5), rgba(212,180,131,0.35), rgba(194,104,74,0.6))',
            filter: 'blur(60px)',
          }}
        />
        {/* sweeping diagonal line */}
        <motion.div
          initial={{ x: '-30%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 14, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], repeatDelay: 2 }}
          className="absolute top-0 left-0 w-[40%] h-full opacity-[0.08]"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)' }}
        />
        {/* brand gradient veil */}
        <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-b from-bg via-bg/60 to-bg' : 'bg-gradient-to-b from-bg via-bg/40 to-bg'}`} />
      </motion.div>

      {/* Premium Spotlight — Aceternity/Magic UI tarzi */}
      <Spotlight
        className="absolute -top-40 left-0 md:-top-20 md:left-60 -z-[4]"
        color={dm ? '#D4A574' : '#C8A97E'}
        opacity={dm ? 0.48 : 0.38}
      />

      {/* Ikinci spotlight — sag alt, sicak akcent */}
      <Spotlight
        className="absolute top-[30%] right-0 md:top-[20%] md:right-40 -z-[4]"
        color={dm ? '#C8A97E' : '#D4A574'}
        opacity={dm ? 0.32 : 0.24}
      />

      {/* Voleybol dekoratif floaters — marka teması (ARENA voleybol koduna bagli) */}
      <VolleyballFloaters opacity={dm ? 0.22 : 0.18} />

      {/* Spike yörüngesi — hero'da tek loop dikkat çekici */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-[2]">
        <VolleyballSpike
          size={48}
          duration={2.6}
          delay={1.4}
          from={{ x: '5%', y: '14%' }}
          arc={140}
        />
      </div>

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
              <GradientText
                from="var(--color-primary)"
                via="var(--color-secondary)"
                to="var(--color-primary)"
                duration={7}
              >
                <AnimatedHeading text={t.hero.title2} />
              </GradientText>
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
              <a href="#programlar" className={`text-[0.88rem] font-medium underline underline-offset-4 decoration-1 transition-all duration-300 hero-secondary-link ${dm ? "text-text-main/50 hover:text-text-main/80 decoration-text-main/20" : "text-text-main/40 hover:text-text-main/70 decoration-text-main/15"}`}>
                  {t.hero.btnPrograms}
                </a>
            
            <motion.div variants={fadeUp} custom={6} className="flex flex-wrap gap-4 mt-10 hero-micro-authority">
              {["Profesyonel Voleybolcu", "Kisisel Planlama", "Portal Destekli Takip"].map((item, i) => (
                <span key={i} className={`text-[0.72rem] uppercase tracking-[0.12em] font-medium px-3 py-1.5 rounded-full ${dm ? "bg-white/5 text-text-main/40 border border-white/10" : "bg-black/[0.03] text-text-main/35 border border-black/5"}`}>{item}</span>
              ))}
            </motion.div>
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
              {/* rotating conic brand background */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-[30%]"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, #C2684A, #7A9E82, #4A6D88, #D4B483, #C2684A)',
                  filter: 'blur(12px)',
                }}
              />
              {/* solid tint overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(165deg, rgba(194,104,74,0.55) 0%, rgba(122,158,130,0.35) 45%, rgba(74,109,136,0.6) 100%)',
                }}
              />
              {/* grid texture */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.09] mix-blend-overlay"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />
              {/* floating particles */}
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/60"
                  style={{
                    width: `${4 + (i % 3) * 2}px`,
                    height: `${4 + (i % 3) * 2}px`,
                    left: `${12 + i * 12}%`,
                    top: `${18 + (i * 11) % 70}%`,
                    filter: 'blur(0.5px)',
                  }}
                  animate={{
                    y: [0, -24, 0],
                    opacity: [0.3, 0.85, 0.3],
                  }}
                  transition={{
                    duration: 5 + (i % 4),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.55,
                  }}
                />
              ))}
              {/* center pulsing spotlight */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.35, 0.6, 0.35],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(194,104,74,0.15) 40%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />
              {/* orbiting volleyball */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 w-[62%] h-[62%] -translate-x-1/2 -translate-y-1/2"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.8)]">
                  <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #D4B483)' }} />
                </div>
              </motion.div>
              {/* central ARENA monogram with motion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-6 rounded-full border border-white/30 border-dashed"
                    />
                    <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                      <span className="font-display text-5xl font-semibold text-white tracking-tight">A</span>
                    </div>
                  </div>
                  <span className="mt-5 text-white/90 text-[0.68rem] uppercase tracking-[0.4em] font-medium">
                    {tenantConfig.brand.name}
                  </span>
                  <span className="mt-1.5 text-white/60 text-[0.6rem] uppercase tracking-[0.3em]">
                    Performance System
                  </span>
                </motion.div>
              </motion.div>
              {/* corner radial accent */}
              <motion.div
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212,180,131,0.55) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-t from-bg/50 via-transparent' : 'bg-gradient-to-t from-bg/30 via-transparent'}`} />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
              {/* recurring shimmer sweep */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 3, repeat: Infinity, ease: [0.16, 1, 0.3, 1], repeatDelay: 4 }}
                style={{ willChange: 'transform' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]"
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              viewport={{ once: true }}
              className={`absolute -right-10 top-[52%] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl ${dm ? 'bg-white/10 border border-white/10' : 'bg-white/90 border border-black/5'}`}>
              <div className="text-3xl font-semibold text-primary"><Counter target={98} suffix="%" /></div>
              <div className={`text-[0.7rem] uppercase tracking-[0.12em] mt-1 ${dm ? 'text-white/50' : 'text-text-main/40'}`}>{t.hero.kpi.success}</div>
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
