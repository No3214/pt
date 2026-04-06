import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useMemo } from 'react';

export default function MacroTracker() {
  const { darkMode: dm, foodLog } = useStore();

  const totals = useMemo(() => 
    foodLog.reduce((a, f) => ({ 
      cal: a.cal + f.cal, 
      p: a.p + f.p, 
      f: a.f + f.f, 
      c: a.c + f.c 
    }), { cal: 0, p: 0, f: 0, c: 0 }),
    [foodLog]
  );

  const targets = {
    cal: 2200,
    p: 150,
    f: 70,
    c: 250
  };

  const macros = [
    { label: 'Kalori', value: totals.cal, target: targets.cal, unit: 'kcal', color: 'primary' },
    { label: 'Protein', value: Math.round(totals.p), target: targets.p, unit: 'g', color: 'secondary' },
    { label: 'Yağ', value: Math.round(totals.f), target: targets.f, unit: 'g', color: 'sand' },
    { label: 'Karbonhidrat', value: Math.round(totals.c), target: targets.c, unit: 'g', color: 'accent' }
  ];

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 h-full ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">Besin Makroları</h3>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-accent/20' : 'bg-accent/10'}`}>
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        {macros.map((m, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className={`text-[0.72rem] font-bold uppercase tracking-[0.2em] opacity-40 ${
                  dm ? 'text-white' : 'text-text-main'
                }`}>{m.label}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-bold tracking-tighter text-text-main tabular-nums`}>{m.value}</span>
                  <span className="text-[0.8rem] opacity-30 font-medium">/ {m.target}{m.unit}</span>
                </div>
              </div>
              <div className={`text-[0.75rem] font-bold opacity-30`}>
                %{Math.min(Math.round((m.value / m.target) * 100), 100)}
              </div>
            </div>

            <div className={`h-2.5 rounded-full overflow-hidden ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full transition-colors duration-500`}
                style={{ backgroundColor: `var(--color-${m.color})` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 rounded-2xl bg-text-main/[0.02] border border-text-main/5 text-center">
        <p className="text-[0.9rem] italic text-text-main/40 font-medium leading-relaxed">
          "Beslenme, antrenmanın yarısıdır. Dengeni koru."
        </p>
      </div>
    </div>
  );
}
