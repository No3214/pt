import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { RevealSection, fadeUp, staggerContainer } from './LandingUI';

export default function SystemBenefits() {
  const { darkMode } = useStore();
  const dm = darkMode;

  const features = [
    {
      title: "White-Label Dashboard",
      desc: "Kendi logon ve renklerinle öğrencilerine profesyonel bir portal deneyimi sun.",
      icon: "🎨"
    },
    {
      title: "AI Analysis Engine",
      desc: "Öğrencilerinin form videolarını ve beslenme fotoğraflarını yapay zeka ile otomatik analiz et.",
      icon: "🧠"
    },
    {
      title: "Automated Payments",
      desc: "Ödemeleri takip etme derdine son. Sistem otomatik tahsilat ve hatırlatma yapar.",
      icon: "💸"
    },
    {
      title: "Smart Roadmap",
      desc: "Dinamik kariyer haritaları ile her sporcunun gelişimini bilimsel olarak görselleştir.",
      icon: "📊"
    }
  ];

  return (
    <section className="py-32 bg-bg border-y border-text-main/5 relative isolate">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-[0.05]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection>
          <div className="text-center mb-24">
            <motion.span variants={fadeUp} className="text-[0.7rem] uppercase tracking-[0.4em] font-bold text-primary mb-6 block">
              TEKNOLOJİK ALTYAPI
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold text-text-main mb-8 tracking-tight">
              Koçların İşletim Sistemi.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-text-main/40 max-w-2xl mx-auto text-lg leading-relaxed">
              İşletmenizi büyütmek için gereken tüm araçlar tek bir platformda. Zamanınızı idari işlere değil, öğrencilerinize ayırın.
            </motion.p>
          </div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`group p-10 rounded-[2.5rem] border transition-all duration-500 ${
                  dm ? 'bg-white/[0.03] border-white/5 hover:border-primary/30' : 'bg-white border-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20'
                }`}
              >
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 inline-block">{f.icon}</div>
                <h3 className="font-display text-2xl font-bold mb-4 text-text-main leading-tight">{f.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-text-main/40">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Integration Badge */}
          <motion.div variants={fadeUp} custom={5} className="mt-20 flex justify-center">
            <div className={`px-6 py-3 rounded-full border border-text-main/10 flex items-center gap-4 ${dm ? 'bg-white/5' : 'bg-black/[0.02]'}`}>
               <span className="text-[0.65rem] font-bold uppercase tracking-widest text-text-main/30">Entegrasyonlar:</span>
               <div className="flex gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <span className="text-xs font-black">SUPABASE</span>
                  <span className="text-xs font-black">OPENAI</span>
                  <span className="text-xs font-black">STRIPE</span>
                  <span className="text-xs font-black">WHATSAPP</span>
               </div>
            </div>
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
}
