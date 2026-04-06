import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

const habitLabels = ['3 Litre Su', '8 Saat Uyku', 'Protein Hedefi', '10.000 Adım'];
const habitIcons = ['💧', '💤', '🥩', '🚶'];

export default function HabitCheckIn() {
  const { darkMode: dm, habits, setHabits, showToast } = useStore();

  const handleToggle = (i: number) => {
    const next = [...habits];
    next[i] = !next[i];
    setHabits(next);
    if (next[i]) {
      showToast(`${habitLabels[i]} tamamlandı! 🚀`);
    }
  };

  const doneCount = habits.filter(Boolean).length;
  const progress = (doneCount / 4) * 100;

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 h-full ${
    dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">Günlük Check-in</h3>
          <p className="text-[0.85rem] text-text-main/30 font-medium mt-1">Gelişimini takip et.</p>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke={dm ? 'white' : 'black'} strokeOpacity={0.05} strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="44" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="276.46"
              initial={{ strokeDashoffset: 276.46 }}
              animate={{ strokeDashoffset: 276.46 * (1 - progress / 100) }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-text-main">
            {doneCount}/4
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {habitLabels.map((h, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleToggle(i)}
            className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
              habits[i]
                ? (dm ? 'bg-secondary/20 border-secondary/30 text-secondary' : 'bg-secondary/10 border-secondary/20 text-secondary')
                : (dm ? 'bg-white/[0.02] border-white/5 text-text-main/40' : 'bg-black/[0.01] border-black/5 text-text-main/60')
            }`}
          >
            <div className="text-2xl">{habitIcons[i]}</div>
            <div className="flex-1 font-bold text-[0.95rem]">{h}</div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              habits[i] ? 'bg-secondary border-secondary' : 'border-current opacity-20'
            }`}>
              {habits[i] && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {doneCount === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-center text-[0.85rem] font-bold uppercase tracking-widest"
        >
          Harika! Tüm hedefler tamam. 🎉
        </motion.div>
      )}
    </div>
  );
}
