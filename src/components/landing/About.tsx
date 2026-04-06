import { RevealSection, TiltCard, fadeUp, staggerContainer } from './LandingUI';
import { motion } from 'framer-motion';

export default function About() {
  const PHILOSOPHY_CARDS = [
    { num: '01', title: 'Sporcu Disiplini', desc: 'Profesyonel voleybol tecrübesiyle kanıtlanmış antrenman metodolojisi.' },
    { num: '02', title: 'Kişiye Özel Güçlenme', desc: 'Kendi bedenini tanımanı ve hedeflerine uygun güçlü bir temele sahip olmanı hedefliyorum.' },
    { num: '03', title: 'Seçici Premium Takip', desc: 'Kaliteyi korumak için sınırlı kontenjanla, birebir odaklı çalışma.' },
  ];

  return (
    <section id="hakkinda" className="py-32 md:py-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
                Felsefe
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1}
                className="font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 text-text-main">
                İlham vermek değil,
                <br />karar verdirmek.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2}
                className="text-[1.15rem] leading-[1.85] max-w-[480px] text-text-main/40">
                Voleybol sahasında edindiğim disiplinle, sadece kararlı ve disiplinli danışanlarla çalışıyorum. Her program bilimsel temellere dayanır, her adım ölçülür.
              </motion.p>
            </div>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6">
              {PHILOSOPHY_CARDS.map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <TiltCard className="group p-8 rounded-2xl border border-text-main/5 hover:border-primary/20 bg-text-main/[0.02] transition-all duration-500 cursor-default">
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
