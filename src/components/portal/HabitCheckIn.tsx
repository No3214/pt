import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../locales';

const habitIcons = ['💧', '💤', '🥩', '🚶'];

const triggerConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

export default function HabitCheckIn() {
  const { t } = useTranslation();
  const habitLabels = t.portal.habit_labels;
  const { darkMode: dm, habits, setHabits, showToast, doCheckIn } = useStore();

  const handleToggle = (i: number) => {
    const next = [...habits];
    next[i] = !next[i];
    setHabits(next);
    if (next[i]) {
      showToast(t.portal.habit_completed_toast.replace('{}', habitLabels[i]));
    }
    // Tüm alışkanlıklar tamamlandığında günlük check-in tetiklenir → streak artar
    if (next.every(Boolean)) {
      doCheckIn();
      showToast(t.portal.habit_all_done_toast);
      triggerConfetti();
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
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">{t.portal.habit_title}</h3>
          <p className="text-[0.85rem] text-text-main/30 font-medium mt-1">{t.portal.habit_subtitle}</p>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-23 h-23">
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
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${habits[i] ? (dm ? 'border-secondary bg-secondary/30' : 'border-secondary bg-secondary/20') : (dm ? 'border-white/10' : 'border-black/10')}`}>
              {habits[i] && <div className="text-white text-sm">✓</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
