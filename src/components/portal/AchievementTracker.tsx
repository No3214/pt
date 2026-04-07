import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function AchievementTracker({ athleteLevel: _athleteLevel }: { athleteLevel?: string }) {
  const { darkMode: dm, streak } = useStore();
  const [levelUp, setLevelUp] = useState(false);

  // Define actual dynamic milestones
  const achievements = [
    { id: 1, title: 'Isınma Turu', icon: '🔥', desc: '3 gün üst üste takip.', unlocked: streak >= 3 },
    { id: 2, title: 'Disiplin Ustası', icon: '🛡️', desc: '7 gün üst üste takip.', unlocked: streak >= 7 },
    { id: 3, title: 'Kırılmaz İrade', icon: '⚔️', desc: '14 günlük sağlam seri.', unlocked: streak >= 14 },
    { id: 4, title: 'Şampiyon Ruhu', icon: '🏆', desc: '30 günlük yenilmezlik.', unlocked: streak >= 30 }
  ];

  const currentRank = streak >= 30 ? 'Elite' : streak >= 14 ? 'Pro' : streak >= 7 ? 'Advanced' : 'Rookie';
  const progressToNext = streak >= 30 ? 100 : streak >= 14 ? (streak / 30) * 100 : streak >= 7 ? (streak / 14) * 100 : (streak / 7) * 100;
  const nextTarget = streak >= 30 ? 0 : streak >= 14 ? 30 : streak >= 7 ? 14 : 7;
  const missing = nextTarget - streak;

  // Level up trigger effect
  useEffect(() => {
    if (streak === 7 || streak === 14 || streak === 30) {
      setLevelUp(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7A9E82', '#D4C4AB', '#C2684A']
      });
      setTimeout(() => setLevelUp(false), 5000);
    }
  }, [streak]);

  const card = `p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
    dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-primary/30' : 'bg-white border-black/[0.04] shadow-xl hover:border-primary/20'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] ${dm ? 'text-white/20' : 'text-text-main/20'}`}>
          Başarımlar & Rozetler
        </h3>
        
        <motion.div
           animate={levelUp ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
           transition={{ duration: 0.5 }}
           className={`px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider flex items-center gap-2 ${
              currentRank === 'Elite' ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(122,158,130,0.4)]' :
              currentRank === 'Pro' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
              currentRank === 'Advanced' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' :
              'bg-stone-500/10 text-stone-400 border border-stone-500/20'
           }`}
        >
          {levelUp && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>}
          <span className="relative z-10">{currentRank} RANK</span>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card} flex items-center gap-4 ${!a.unlocked ? 'opacity-40 grayscale' : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]'}`}
          >
            {a.unlocked && (
               <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent blur-xl pointer-events-none" />
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl relative z-10 ${
              a.unlocked ? (dm ? 'bg-primary/10 shadow-inner' : 'bg-primary/10') : 'bg-stone-500/5'
            }`}>
              {a.icon}
            </div>
            <div className="relative z-10">
              <p className={`font-bold text-[0.95rem] leading-tight ${a.unlocked ? 'text-text-main' : 'text-text-main/50'}`}>{a.title}</p>
              <p className="text-[0.7rem] text-text-main/50 mt-1">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {currentRank !== 'Elite' && (
        <div className="mt-6">
          <div className="flex justify-between items-end mb-2">
            <p className={`text-[0.6rem] uppercase tracking-widest ${dm ? 'text-white/40' : 'text-stone-400'}`}>
              Sonraki Seviye
            </p>
            <p className={`text-[0.6rem] font-bold uppercase tracking-widest ${dm ? 'text-primary' : 'text-primary'}`}>
              {missing} Gün Kaldı
            </p>
          </div>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${progressToNext}%` }} 
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-secondary to-primary rounded-full relative"
             >
                <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full blur-[2px] animate-pulse" />
             </motion.div>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-0 bottom-[-20px] mx-auto w-max bg-primary text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-white/20 z-50"
          >
            Tebrikler! Seviye Atladın 🚀
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
