import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';
import { useMemo } from 'react';

const COLORS = ['var(--color-secondary)', 'var(--color-sand)', 'var(--color-primary)', 'var(--color-accent)'];

export default function MacroDistribution() {
  const { t } = useTranslation();
  const { darkMode: dm, foodLog } = useStore();
  
  const macroTotals = useMemo(() => {
    const totals = foodLog.reduce((a, f) => ({ p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { p: 0, f: 0, c: 0 });
    const data = [
      { name: t.admin.macro_protein, value: Math.round(totals.p) || 30 },
      { name: t.admin.macro_fat, value: Math.round(totals.f) || 20 },
      { name: t.admin.macro_carbs, value: Math.round(totals.c) || 50 }
    ];
    return data;
  }, [foodLog, t]);

  const ttStyle = {
    contentStyle: {
      background: 'var(--color-surface)',
      border: 'none',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      fontSize: 12,
      padding: '10px 14px',
    },
    itemStyle: { color: dm ? '#aaa' : '#666' },
  };

  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 h-full ${
      dm ? 'bg-white/[0.015] border-white/5' : 'bg-white border-black/[0.03] shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display text-xl font-bold text-text-main tracking-tight">{t.admin.macro_distribution_title}</h3>
          <p className="text-[0.75rem] text-text-main/30 font-medium mt-1">{t.admin.macro_distribution_subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-secondary/20 text-secondary' : 'bg-secondary/10 text-secondary'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="h-[200px] w-full md:w-[60%]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroTotals}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                strokeWidth={0}
                paddingAngle={4}
                animationDuration={1500}
              >
                {macroTotals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={ttStyle.contentStyle}
                itemStyle={ttStyle.itemStyle}
                formatter={(v: number) => [`${v}g`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-5 w-full">
          {macroTotals.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <div className="flex-1">
                <p className="text-[0.75rem] font-bold text-text-main/20 uppercase tracking-widest">{m.name}</p>
                <p className="text-[1.1rem] font-bold text-text-main tabular-nums">{m.value} <span className="opacity-30 text-[0.8rem]">{t.admin.macro_unit}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
