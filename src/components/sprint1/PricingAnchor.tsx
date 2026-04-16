import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

interface PricingAnchorProps {
  className?: string;
}

export default function PricingAnchor({ className = '' }: PricingAnchorProps) {
  const { darkMode } = useStore();
  const dm = darkMode;

  const features = [
    'Yakın Takip',
    'Sık Check-in',
    'Performans Periodizasyonu',
    'Patlayıcı Güç Odaklı'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group ${className}`}
    >
      {/* Main card */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 ${
          dm
            ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-600/8 border-amber-400/30 shadow-2xl shadow-amber-900/20 hover:shadow-amber-900/30'
            : 'bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-amber-300/40 shadow-2xl shadow-amber-200/30 hover:shadow-amber-300/40'
        }`}
      >
        {/* Premium glow background */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${dm ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.15)'} 0%, transparent 70%)`,
            filter: 'blur(30px)'
          }}
        />

        {/* Content wrapper */}
        <div className="relative p-8 md:p-10">
          {/* Top section with tier and badge */}
          <div className="flex items-start justify-between mb-8">
            <div>
              {/* Tier label */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                <span className={`text-[0.65rem] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent`}>
                  Pro Athlete
                </span>
              </motion.div>

              {/* Tier name */}
              <h3 className="text-3xl md:text-4xl font-bold font-display text-text-main mt-2 mb-2">
                Elite Training
              </h3>

              {/* Capacity badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.15em] ${
                dm
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'bg-amber-200/40 text-amber-800 border border-amber-300/50'
              }`}>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Sınırlı Kontenjan — 3 Sporcu
              </div>
            </div>

            {/* Trophy icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl"
            >
              🏆
            </motion.div>
          </div>

          {/* Divider */}
          <div className={`h-px my-8 ${dm ? 'bg-white/10' : 'bg-amber-300/20'}`} />

          {/* Features list */}
          <div className="space-y-3 mb-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  dm
                    ? 'bg-amber-500/30 text-amber-300'
                    : 'bg-amber-300/40 text-amber-700'
                }`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Feature text */}
                <span className={`font-semibold text-sm ${
                  dm ? 'text-text-main/70' : 'text-text-main/60'
                }`}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className={`h-px my-8 ${dm ? 'bg-white/10' : 'bg-amber-300/20'}`} />

          {/* Satisfaction guarantee badge */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              dm
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                : 'bg-white/50 border-white/30 hover:bg-white/70 hover:border-white/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0 mt-0.5">✓</div>
              <div>
                <p className={`font-bold text-sm mb-1 ${dm ? 'text-amber-300' : 'text-amber-700'}`}>
                  14 Gün Memnuniyet Garantisi
                </p>
                <p className={`text-xs leading-relaxed ${dm ? 'text-text-main/40' : 'text-text-main/50'}`}>
                  Haksız bir şekilde tatmin olmadıysan, tam para iadesini garantiliyoruz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.a
            href="#iletisim"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className={`block w-full mt-8 py-4 px-6 rounded-2xl font-bold text-center no-underline transition-all duration-300 text-white ${
              dm
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-900/40 hover:shadow-amber-900/50 hover:from-amber-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-orange-300/40 hover:shadow-orange-400/50 hover:from-amber-600 hover:to-orange-700'
            }`}
          >
            Konuş — Kapasiteyi Kontrol Et
          </motion.a>

          {/* Small note */}
          <p className={`text-center text-[0.7rem] mt-4 ${dm ? 'text-text-main/30' : 'text-text-main/40'}`}>
            Özel fiyatlandırma ve ödeme planları mevcuttur
          </p>
        </div>

        {/* Animated border glow */}
        <motion.div
          animate={{
            boxShadow: [
              `inset 0 0 0 1px ${dm ? 'rgba(217, 119, 6, 0.1)' : 'rgba(217, 119, 6, 0.15)'}`,
              `inset 0 0 20px 0 ${dm ? 'rgba(217, 119, 6, 0.2)' : 'rgba(217, 119, 6, 0.1)'}`,
              `inset 0 0 0 1px ${dm ? 'rgba(217, 119, 6, 0.1)' : 'rgba(217, 119, 6, 0.15)'}`,
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
        />
      </div>

      {/* Decorative corner accents */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-px -right-px w-20 h-20 rounded-full ${
          dm ? 'bg-amber-500/10' : 'bg-amber-300/15'
        }`}
        style={{ filter: 'blur(30px)' }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -bottom-px -left-px w-20 h-20 rounded-full ${
          dm ? 'bg-orange-500/10' : 'bg-orange-300/15'
        }`}
        style={{ filter: 'blur(30px)' }}
      />
    </motion.div>
  );
}
