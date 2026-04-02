import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const COLORS = ['#7A9E82', '#D4C4AB', '#C2684A']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function Dashboard() {
  const { clients, foodLog, darkMode } = useStore()
  const dm = darkMode

  const stats = useMemo(() => {
    const active = clients.filter(c => c.sessions > 0)
    const mrr = active.reduce((a, c) => a + c.price, 0)
    const totalHabitMax = clients.reduce((a, c) => a + c.habitMax, 0)
    const totalHabitScore = clients.reduce((a, c) => a + c.habitScore, 0)
    const compliance = totalHabitMax > 0 ? Math.round((totalHabitScore / totalHabitMax) * 100) : 0
    const totalSessions = clients.reduce((a, c) => a + c.sessions, 0)
    return { activeCount: active.length, totalClients: clients.length, mrr, compliance, totalSessions }
  }, [clients])

  const revenueData = [
    { month: 'Oca', value: 8500 }, { month: 'Şub', value: 10000 },
    { month: 'Mar', value: 12500 }, { month: 'Nis', value: stats.mrr || 15000 },
    { month: 'May', value: 13000 }, { month: 'Haz', value: 17500 },
  ]

  const macroTotals = useMemo(() => {
    const t = foodLog.reduce((a, f) => ({ p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { p: 0, f: 0, c: 0 })
    return t.p + t.f + t.c > 0
      ? [{ name: 'Protein', value: Math.round(t.p) }, { name: 'Yağ', value: Math.round(t.f) }, { name: 'Karb', value: Math.round(t.c) }]
      : [{ name: 'Protein', value: 30 }, { name: 'Yağ', value: 20 }, { name: 'Karb', value: 50 }]
  }, [foodLog])

  const complianceData = [
    { week: 'H1', score: 65 }, { week: 'H2', score: 72 }, { week: 'H3', score: 68 },
    { week: 'H4', score: 78 }, { week: 'H5', score: 82 }, { week: 'H6', score: stats.compliance || 85 },
  ]

  const kpiCards = [
    { label: 'Aktif Danışan', value: stats.activeCount, total: stats.totalClients, color: 'text-terracotta', bg: dm ? 'bg-terracotta/5' : 'bg-terracotta/[0.04]' },
    { label: 'Aylık Gelir (MRR)', value: `₺${stats.mrr.toLocaleString('tr-TR')}`, color: 'text-sage', bg: dm ? 'bg-sage/5' : 'bg-sage/[0.04]' },
    { label: 'Uyum Skoru', value: `%${stats.compliance}`, color: 'text-coast', bg: dm ? 'bg-coast/5' : 'bg-coast/[0.04]' },
    { label: 'Kalan Seans', value: stats.totalSessions, color: dm ? 'text-sand' : 'text-sand-dark', bg: dm ? 'bg-sand/5' : 'bg-sand/[0.04]' },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.h2 variants={fadeUp} className={`font-display text-3xl font-semibold mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
        Platform Özeti
      </motion.h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}
            className={`p-5 rounded-xl border transition-all duration-300 ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
            <p className={`text-[0.68rem] uppercase tracking-[0.12em] mb-3 ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>{card.label}</p>
            <p className={`text-3xl font-semibold tracking-tight ${card.color}`}>{card.value}</p>
            {card.total !== undefined && (
              <p className={`text-[0.75rem] mt-1 ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>/ {card.total} toplam</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <motion.div variants={fadeUp} custom={4}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Aylık Gelir Trendi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: dm ? '#1a1a1a' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: number) => [`₺${v.toLocaleString()}`, 'MRR']}
              />
              <Bar dataKey="value" fill="#C2684A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={5}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Makro Dağılımı (Bugün)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={macroTotals} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}
                label={({ name, value }) => `${name}: ${value}g`}>
                {macroTotals.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: dm ? '#1a1a1a' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} custom={6}
        className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
        <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Haftalık Uyum Skoru</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={complianceData}>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: dm ? '#1a1a1a' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, 'Uyum']}
            />
            <defs>
              <linearGradient id="uyumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7A9E82" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7A9E82" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="score" stroke="#7A9E82" fill="url(#uyumGrad)" strokeWidth={2} dot={{ fill: '#C2684A', r: 4, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}