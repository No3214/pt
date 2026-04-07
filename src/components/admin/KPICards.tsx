import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useMemo } from 'react';
import { useTranslation } from '../../locales';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

function KPICard({ label, value, sub, color, i, dm }: any) {
  return (
    <motion.div
      variants={fadeUp}
      custom={i}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-full ${
        dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.04] shadow-xl'
      }`}
    >
      <div>
        <p className={`text-[0.7rem] font-bold uppercase tracking-[0.25em] mb-4 opacity-40 ${dm ? 'text-white' : 'text-text-main'}`}>
          {label}
        </p>
        <div className={`text-[2.8rem] font-bold tracking-tighter leading-none text-text-main tabular-nums`}>
          {value}
        </div>
      </div>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-[0.85rem] font-medium text-text-main/30">{sub}</p>
        <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: `var(--color-${color})` }} />
      </div>
    </motion.div>
  );
}

export default function KPICards() {
  const { t, language } = useTranslation();
  const { clients, leads, darkMode: dm } = useStore();
  
  const stats = useMemo(() => {
    const active = clients.filter(c => c.sessions > 0).length;
    const mrr = clients.reduce((a, c) => a + c.price, 0);
    const totalMax = clients.reduce((a, c) => a + c.habitMax, 0);
    const totalScore = clients.reduce((a, c) => a + c.habitScore, 0);
    const compliance = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const newLeads = leads.filter(l => l.status === 'New').length;
    
    const currency = language === 'tr' ? '₺' : '$';
    const localeString = language === 'tr' ? 'tr-TR' : 'en-US';

    return [
      { 
        label: t.admin.kpi_active_clients, 
        value: active, 
        sub: t.admin.kpi_total_registrations.replace('{}', clients.length.toString()), 
        color: 'primary' 
      },
      { 
        label: t.admin.kpi_monthly_revenue, 
        value: `${currency}${mrr.toLocaleString(localeString)}`, 
        sub: t.admin.kpi_monthly_recurring, 
        color: 'secondary' 
      },
      { 
        label: t.admin.kpi_compliance_score, 
        value: `%${compliance}`, 
        sub: t.admin.kpi_weekly_average, 
        color: 'accent' 
      },
      { 
        label: t.admin.kpi_new_applications, 
        value: newLeads, 
        sub: t.admin.kpi_total_leads.replace('{}', leads.length.toString()), 
        color: 'sand' 
      }
    ];
  }, [clients, leads, t, language]);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <KPICard key={i} {...s} i={i} dm={dm} />
      ))}
    </div>
  );
}
