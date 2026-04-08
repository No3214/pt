import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

export default function RevenueChart() {
  const { t, locale, currency } = useTranslation();
  const { darkMode: dm } = useStore();
  
  const data = [
    { month: 'Oca', value: 8500 },
    { month: 'Şub', value: 10000 },
    { month: 'Mar', value: 12500 },
    { month: 'Nis', value: 15400 },
    { month: 'May', value: 13200 },
    { month: 'Haz', value: 17800 },
  ];

  const ttStyle = {
    contentStyle: {
      background: dm ? '#1a1a1a' : '#fff',
      border: 'none',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      fontSize: 12,
      padding: '10px 14px',
    },
    itemStyle: { color: dm ? '#aaa' : '#666' },
    labelStyle: { color: dm ? '#888' : '#999', fontSize: 11 },
    cursor: { stroke: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
  };

  const axisStyle = { fontSize: 10, fill: dm ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' };

  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 h-full ${
      dm ? 'bg-white/[0.015] border-white/5' : 'bg-white border-black/[0.03] shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display text-xl font-bold text-text-main tracking-tight">{t.admin.revenue_title}</h3>
          <p className="text-[0.75rem] text-text-main/30 font-medium mt-1">{t.admin.revenue_subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `${currency}${(v/1000).toFixed(0)}K`} width={45} />
            <Tooltip
              contentStyle={ttStyle.contentStyle}
              itemStyle={ttStyle.itemStyle}
              labelStyle={ttStyle.labelStyle}
              cursor={ttStyle.cursor}
              formatter={(v: number) => [`${currency}${v.toLocaleString(locale)}`, t.admin.revenue_monthly]}
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 2, 2]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
