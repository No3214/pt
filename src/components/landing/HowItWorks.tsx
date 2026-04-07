import { motion } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

const STEP_ICONS = [
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>,
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>,
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
];

export default function HowItWorks() {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;
  const steps = t.howItWorks.steps.map((step, i) => ({
    ...step,
    icon: STEP_ICONS[i],
  }));

  return (
    <section className="py-32 md:py-40 bg-bg relative overflow-hidden">
      {/* Subtle connecting line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent hidden lg:block" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="text-center mb-24">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">
            {t.howItWorks.badge}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em] text-text-main mb-8">
            {t.howItWorks.title}
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
        </RevealSection>

        <RevealSection className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`group relative p-10 rounded-[2rem] border transition-all duration-700 ${
                dm
                  ? 'border-white/[0.06] bg-white/[0.02] hover:border-primary/20 hover:bg-white/[0.04]'
                  : 'border-black/[0.04] bg-white hover:border-primary/15 hover:shadow-2xl hover:shadow-primary/5'
              }`}
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  dm
                    ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    : 'bg-primary/[0.08] text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                  {step.icon}
                </div>
                <span className="text-[3.5rem] font-display font-bold leading-none text-text-main/[0.04] group-hover:text-primary/10 transition-colors duration-700">
                  {step.num}
                </span>
              </div>

              <h3 className="font-display text-[1.6rem] font-bold mb-4 text-text-main group-hover:text-primary transition-colors duration-500">
                {step.title}
              </h3>
              <p className={`text-[1rem] leading-[1.8] ${dm ? 'text-white/40' : 'text-text-main/45'}`}>
                {step.desc}
              </p>

              {/* Arrow connector (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-12 -translate-y-1/2 z-20">
                  <svg className="w-full h-full text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </RevealSection>
      </div>
    </section>
  );
}
