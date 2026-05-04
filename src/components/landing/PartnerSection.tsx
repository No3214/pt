import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { RevealSection, fadeUp, staggerContainer } from './LandingUI';
import MagneticButton from '../animations/MagneticButton';

export default function PartnerSection() {
  const { darkMode } = useStore();
  const dm = darkMode;

  const benefits = [
    {
      title: "Otomatik Takip",
      desc: "Öğrencilerinin tüm gelişimini tek bir dashboard'dan yönet.",
      icon: "📊"
    },
    {
      title: "AI Beslenme Koçu",
      desc: "Fotoğraftan kalori tespiti yapan yapay zeka emrinde.",
      icon: "🤖"
    },
    {
      title: "Global Erişim",
      desc: "Lokasyondan bağımsız olarak dünyanın her yerinden danışan al.",
      icon: "🌍"
    }
  ];

  return (
    <section id="partner" className="py-32 md:py-48 relative overflow-hidden bg-bg">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection>
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-20 items-center">
            <div>
              <motion.span variants={fadeUp} className="text-[0.7rem] uppercase tracking-[0.3em] font-bold text-primary mb-6 block">
                KOÇLAR & PT'LER İÇİN
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] mb-8 text-text-main">
                Kendi Akademini <br />
                <span className="text-primary">Global Boyuta</span> Taşı.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-[1.1rem] leading-[1.8] text-text-main/50 mb-12 max-w-[500px]">
                ARENA sadece bir sporcu platformu değil, aynı zamanda hocalar için eksiksiz bir işletim sistemidir.
                CRM, yapay zeka ve ödeme sistemlerimizi kullanarak kendi markanı hemen büyütmeye başla.
              </motion.p>

              <motion.div variants={fadeUp} custom={3}>
                <MagneticButton href="#iletisim" className="px-10 py-5 bg-text-main text-bg rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                  Hoca Olarak Katıl
                </MagneticButton>
              </motion.div>
            </div>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${
                    dm ? 'bg-white/5 border-white/10 hover:border-primary/30' : 'bg-white border-black/5 shadow-xl shadow-black/[0.02] hover:border-primary/20'
                  }`}
                >
                  <div className="text-4xl mb-6">{b.icon}</div>
                  <h3 className="font-display text-2xl font-bold mb-4 text-text-main">{b.title}</h3>
                  <p className="text-[0.95rem] leading-relaxed text-text-main/40">{b.desc}</p>
                </motion.div>
              ))}

              {/* Extra stat card */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="p-10 rounded-[2.5rem] bg-primary text-white flex flex-col justify-center text-center"
              >
                <div className="text-4xl font-display font-bold mb-1">%40</div>
                <div className="text-[0.7rem] uppercase tracking-widest font-bold opacity-80">Verimlilik Artışı</div>
              </motion.div>
            </motion.div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
