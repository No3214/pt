import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { RevealSection, fadeUp } from '../landing/LandingUI';

interface PortalFeature {
  title: string;
  icon: React.ReactNode;
  desc: string;
}

export default function PortalPreview() {
  const { darkMode } = useStore();
  const dm = darkMode;

  const features: PortalFeature[] = [
    {
      title: 'Antrenman Takibi',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18M9 3v18" />
        </svg>
      ),
      desc: 'Her egzersiz, set, rep ve gözlemler kaydedilir'
    },
    {
      title: 'Beslenme Görünümü',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      desc: 'Makro dağılım ve kalori hedefleri anlık gösterim'
    },
    {
      title: 'İlerleme Analizi',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="23 6 13 16 8 11 2 17" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      desc: 'Kilo, vücut bileşimi ve performans grafikleri'
    },
    {
      title: 'Alışkanlık Kontrolü',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      desc: 'Günlük check-in\'ler ve tutarlılık çizgisi'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  return (
    <RevealSection className="w-full py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.15em] mb-6 ${
                dm ? 'bg-white/5 text-text-main/60 border border-text-main/10' : 'bg-black/[0.03] text-text-main/50 border border-black/[0.06]'
              }`}
            >
              <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Coaching Platform
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-display leading-[1.1] tracking-[-0.02em] mb-6 text-text-main"
            >
              Premium Coaching Deneyimi
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className={`text-lg leading-relaxed mb-10 max-w-xl ${
                dm ? 'text-text-main/50' : 'text-text-main/45'
              }`}
            >
              Özel portal üzerinden antrenmanlarını takip et, beslenme hedeflerini yönet ve ilerlemeyi gerçek zamanlı analiz et.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx + 3}
                  className={`flex gap-4 p-5 rounded-xl border transition-all duration-300 ${
                    dm
                      ? 'bg-white/3 border-white/10 hover:border-secondary/30 hover:bg-white/5'
                      : 'bg-white/40 border-white/20 hover:border-secondary/40 hover:bg-white/60'
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-main mb-1">{feature.title}</h4>
                    <p className={`text-xs leading-snug ${
                      dm ? 'text-text-main/40' : 'text-text-main/50'
                    }`}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Portal Mockup (CSS-built dashboard) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Outer frame */}
            <div
              className={`relative rounded-3xl overflow-hidden border-8 transition-all ${
                dm
                  ? 'border-white/10 bg-white/5 shadow-2xl shadow-black/40'
                  : 'border-white/20 bg-gradient-to-br from-white/80 to-white/60 shadow-2xl shadow-black/10'
              }`}
            >
              {/* Header bar */}
              <div
                className={`h-12 px-6 flex items-center gap-3 border-b ${
                  dm
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-white/10'
                    : 'bg-gradient-to-r from-primary/10 to-secondary/10 border-white/15'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="w-3 h-3 rounded-full bg-accent" />
                <div className="flex-1" />
                <span className="text-xs font-bold text-text-main/40 uppercase tracking-widest">Portal</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8 space-y-4">
                {/* Top stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`p-4 rounded-xl border ${
                      dm
                        ? 'bg-primary/10 border-primary/20'
                        : 'bg-primary/5 border-primary/10'
                    }`}
                  >
                    <p className="text-[0.65rem] uppercase tracking-widest text-text-main/50 font-bold mb-1">Antrenman</p>
                    <p className="text-2xl font-bold text-primary">12/16</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    className={`p-4 rounded-xl border ${
                      dm
                        ? 'bg-secondary/10 border-secondary/20'
                        : 'bg-secondary/5 border-secondary/10'
                    }`}
                  >
                    <p className="text-[0.65rem] uppercase tracking-widest text-text-main/50 font-bold mb-1">Kilo</p>
                    <p className="text-2xl font-bold text-secondary">73,2 kg</p>
                  </motion.div>
                </div>

                {/* Chart placeholder */}
                <motion.div
                  animate={{ scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={`h-24 rounded-xl border flex items-end justify-center gap-1 px-4 py-3 ${
                    dm
                      ? 'bg-white/3 border-white/10'
                      : 'bg-white/40 border-white/15'
                  }`}
                  style={{ transformOrigin: 'bottom' }}
                >
                  {[0.4, 0.6, 0.8, 0.9, 0.7, 0.85, 0.95].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [h, h * 1.1, h] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                      style={{ height: `${h * 100}%`, transformOrigin: 'bottom' }}
                      className="w-full rounded-t bg-gradient-to-t from-primary to-secondary opacity-40"
                    />
                  ))}
                </motion.div>

                {/* Recent activity cards */}
                <div className="space-y-2">
                  {['Bacak Günü Tamamlandı', 'Beslenme Hedefi Ulaşıldı'].map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className={`flex items-center gap-2 p-3 rounded-lg border text-[0.75rem] ${
                        dm
                          ? 'bg-white/3 border-white/10 text-text-main/60'
                          : 'bg-white/30 border-white/15 text-text-main/50'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      {activity}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating accent card — top right */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -top-6 -right-6 px-5 py-4 rounded-2xl border backdrop-blur-md ${
                dm
                  ? 'bg-accent/20 border-accent/30 shadow-lg shadow-accent/20'
                  : 'bg-accent/15 border-accent/25 shadow-lg shadow-accent/15'
              }`}
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-accent mb-1">Strain Score</p>
              <p className="text-lg font-bold text-accent">7.2/10</p>
            </motion.div>

            {/* Floating accent card — bottom left */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -bottom-4 -left-4 px-4 py-3 rounded-xl border backdrop-blur-md ${
                dm
                  ? 'bg-secondary/20 border-secondary/30 shadow-lg shadow-secondary/20'
                  : 'bg-secondary/15 border-secondary/25 shadow-lg shadow-secondary/15'
              }`}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-secondary">Uyum Oranı</p>
              <p className="text-xl font-bold text-secondary">92%</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}
