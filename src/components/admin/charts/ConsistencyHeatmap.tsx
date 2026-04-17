import { motion } from 'framer-motion';
import { subDays, eachDayOfInterval } from 'date-fns';
import { useTranslation } from '../../../locales';

interface Props {
  logs: { date: string; completed: boolean }[];
  dm: boolean;
}

export default function ConsistencyHeatmap({ logs, dm }: Props) {
  const { t } = useTranslation();
  const today = new Date();
  const last30Days = eachDayOfInterval({
    start: subDays(today, 29),
    end: today
  });

  const completedCount = logs ? logs.filter(l => l.completed).length : 0;
  const consistencyRate = ((completedCount / 30) * 100).toFixed(0);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-3xl font-bold text-primary">{consistencyRate}%</div>
          <div className="text-[0.65rem] uppercase tracking-widest opacity-40 font-bold">{t.admin.heatmap_consistency_label}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-text-main">{completedCount}/30</div>
          <div className="text-[0.65rem] uppercase tracking-widest opacity-40 font-bold">{t.admin.heatmap_days_label}</div>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {last30Days.map((day: Date, i: number) => {
          const dateStr = day.toISOString().split('T')[0];
          const isDone = logs ? logs.some(l => l.date === dateStr && l.completed) : false;
          
          return (
            <motion.div
              key={dateStr}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`aspect-square rounded-md border flex items-center justify-center transition-all ${
                isDone 
                  ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]' 
                  : (dm ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5')
              }`}
            >
              {isDone && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <p className="mt-6 text-[0.7rem] text-center opacity-30 font-medium italic">
        "{t.admin.heatmap_quote}"
      </p>
    </div>
  );
}
