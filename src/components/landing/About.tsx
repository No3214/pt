import { RevealSection, TiltCard, BlurIn, fadeUp, staggerContainer } from './LandingUI';
import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

export default function About() {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;
  const cards = t.about.cards;

  return (
    <section id="hakkinda" className="pt-20 md:pt-24 pb-32 md:pb-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
                {t.about.badge}
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1}
                className="font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 text-text-main">
                <>{t.about.title1}<br />{t.about.title2}</>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2}
                className="text-[1.15rem] leading-[1.85] max-w-[480px] text-text-main/40">
                {t.about.desc}
              </motion.p>

              {/* Trust indicator */}
              <motion.div variants={fadeUp} custom={3} className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-bg flex items-center justify-center text-[0.65rem] font-bold ${
                      dm ? 'bg-white/10 text-white/60' : 'bg-primary/10 text-primary/70'
                    }`}>
                      {['AK', 'DY', 'SB', 'MÖ'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-[0.82rem] font-medium text-text-main/35">
                  {t.about.trust}
                </span>
              </motion.div>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6">
              {cards.map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <TiltCard className={`group p-8 rounded-2xl border transition-all duration-500 cursor-default ${
                    dm
                      ? 'border-white/[0.06] bg-white/[0.02] hover:border-primary/20'
                      : 'border-text-main/5 hover:border-primary/20 bg-text-main/[0.02]'
                  }`}>
                    <div className="flex gap-6 items-start">
                      <span className="text-[2.5rem] font-display font-bold leading-none text-text-main/10 group-hover:text-primary transition-colors duration-500">{item.num}</span>
                      <div>
                        <h3 className="font-display text-2xl font-semibold mb-2 text-text-main">{item.title}</h3>
                        <p className="text-[1rem] leading-relaxed text-text-main/40">{item.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
