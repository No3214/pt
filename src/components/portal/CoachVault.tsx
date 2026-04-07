import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

const resources = [
  { id: 1, title: 'Maç Öncesi Beslenme Stratejileri', type: 'Rehber', icon: '🍎', color: 'primary' },
  { id: 2, title: 'Dikey Sıçrama Mekaniği v2.0', type: 'Video', icon: '🚀', color: 'secondary' },
  { id: 3, title: 'Zihinsel Dayanıklılık & Odaklanma', type: 'Podcast', icon: '🧠', color: 'accent' },
  { id: 4, title: 'Elite Recovery: Buz Banyosu & Uyku', type: 'Rehber', icon: '❄️', color: 'sand' },
];

export default function CoachVault() {
  const { darkMode: dm } = useStore();

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden h-full ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">Koçun Kasası</h3>
          <p className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] mt-1 ${dm ? 'text-primary/60' : 'text-primary/40'}`}>
            Elite Athlete Kaynakları
          </p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <span className="text-xl">💎</span>
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((res) => (
          <motion.div
            key={res.id}
            whileHover={{ x: 5 }}
            className={`p-4 rounded-2xl border flex items-center justify-between group cursor-pointer transition-colors ${
              dm ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.05]' : 'bg-black/[0.01] border-black/5 hover:bg-black/[0.02]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">{res.icon}</div>
              <div>
                <h4 className="text-[0.9rem] font-bold text-text-main group-hover:text-primary transition-colors">{res.title}</h4>
                <span className={`text-[0.6rem] font-bold uppercase tracking-widest opacity-40`}>{res.type}</span>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5">🏆</div>
        <p className="text-[0.8rem] font-bold text-primary italic leading-relaxed">
           "Şampiyonlar, antrenman bittiğinde çalışmaya devam edenlerdir."
        </p>
      </div>
    </div>
  );
}
