import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

export default function AchievementTracker({ athleteLevel }: { athleteLevel: string }) {
  const { darkMode: dm } = useStore();

  const achievements = [
    { id: 1, title: 'Disiplin Ustası', icon: '🔥', desc: '10 gün üst üste takip.', unlocked: true },
    { id: 2, title: 'Güç Canavarı', icon: '💪', desc: 'Personal Best kırıldı.', unlocked: true },
    { id: 3, title: 'Beslenme Dehası', icon: '🥦', desc: 'Haftalık makro hedefi.', unlocked: athleteLevel !== 'Rookie' },
    { id: 4, title: 'Şampiyon Ruhu', icon: '🏆', desc: 'Seviye: Elite ulaşıldı.', unlocked: athleteLevel === 'Elite' }
  ];

  const card = `p-6 rounded-[2rem] border transition-all duration-300 ${
    dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-primary/30' : 'bg-white border-black/[0.04] shadow-xl hover:border-primary/20'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] ${dm ? 'text-white/20' : 'text-text-main/20'}`}>
          Başarımlar & Rozetler
        </h3>
        <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
          athleteLevel === 'Elite' ? 'bg-primary/20 text-primary border border-primary/30' :
          athleteLevel === 'Pro' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
          'bg-stone-500/10 text-stone-400 border border-stone-500/20'
        }`}>
          {athleteLevel} Rank
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card} flex items-center gap-4 ${!a.unlocked ? 'opacity-30 grayscale' : ''}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
              a.unlocked ? (dm ? 'bg-primary/10' : 'bg-primary/5') : 'bg-stone-500/5'
            }`}>
              {a.icon}
            </div>
            <div>
              <p className="font-bold text-[0.9rem] leading-tight">{a.title}</p>
              <p className="text-[0.7rem] text-text-main/40 mt-1">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {athleteLevel === 'Rookie' && (
        <p className={`text-[0.6rem] text-center mt-4 uppercase tracking-widest ${dm ? 'text-white/20' : 'text-stone-400'}`}>
          Bir sonraki seviye: <span className="text-secondary">PRO</span> için 4 antrenman daha
        </p>
      )}
    </div>
  );
}
