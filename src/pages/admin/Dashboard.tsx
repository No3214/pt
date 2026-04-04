import { useMemo, useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts'

const COLORS = ['var(--color-secondary)', 'var(--color-sand)', 'var(--color-primary)', 'var(--color-accent)']

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
}

const stagger = { visible: { transition: { staggerChildren: 0.07 } } }

/* ═══ Animated Counter ═══ */
function AnimCounter({ value, prefix = '', suffix = '', dm }: { value: number; prefix?: string; suffix?: string; dm: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, v => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) {
      const ctrl = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
      return ctrl.stop
    }
  }, [inView, value, mv])

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(v))
    return unsub
  }, [rounded])

  return (
    <span ref={ref} className={`text-[2rem] font-semibold tracking-[-0.03em] leading-none tabular-nums`}>
      {prefix}{display.toLocaleString('tr-TR')}{suffix}
    </span>
  )
}

/* ═══ Mini Sparkline ═══ */
function Sparkline({ data, color, dm }: { data: number[]; color: string; dm: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80; const h = 28
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')

  return (
    <svg width={w} height={h} className="opacity-50 group-hover:opacity-80 transition-opacity duration-500">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ═══ Custom Tooltip ═══ */
function ChartTooltip({ dm }: { dm: boolean }) {
  return {
    contentStyle: {
      background: dm ? '#1a1a1a' : '#fff',
      border: 'none',
      borderRadius: 14,
      boxShadow: dm ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.08)',
      fontSize: 12,
      padding: '10px 14px',
    },
    itemStyle: { color: dm ? '#aaa' : '#666' },
    labelStyle: { color: dm ? '#888' : '#999', fontSize: 11 },
    cursor: { stroke: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
  }
}

/* ═══ Quick Action Button ═══ */
function QuickAction({ icon, label, dm, onClick }: { icon: React.ReactNode; label: string; dm: boolean; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
        dm ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]'
           : 'bg-white border-black/[0.03] hover:bg-[#FAFAF8] hover:border-black/[0.06] hover:shadow-md'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-primary/10 text-primary' : 'bg-primary/[0.06] text-primary'}`}>
        {icon}
      </div>
      <span className={`text-[0.72rem] font-medium ${dm ? 'text-text-main/40' : 'text-text-main/40'}`}>{label}</span>
    </motion.button>
  )
}

export default function Dashboard() {
  const { clients, foodLog, calSessions, darkMode } = useStore()
  const dm = darkMode
  const tt = ChartTooltip({ dm })
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Günaydın')
    else if (h < 18) setGreeting('İyi günler')
    else setGreeting('İyi akşamlar')
  }, [])

  const stats = useMemo(() => {
    const active = clients.filter(c => c.sessions > 0)
    const mrr = active.reduce((a, c) => a + c.price, 0)
    const totalHabitMax = clients.reduce((a, c) => a + c.habitMax, 0)
    const totalHabitScore = clients.reduce((a, c) => a + c.habitScore, 0)
    const compliance = totalHabitMax > 0 ? Math.round((totalHabitScore / totalHabitMax) * 100) : 0
    const totalSessions = clients.reduce((a, c) => a + c.sessions, 0)
    const totalMaxSessions = clients.reduce((a, c) => a + c.max, 0)
    const usedSessions = totalMaxSessions - totalSessions
    const avgPrice = clients.length > 0 ? Math.round(clients.reduce((a, c) => a + c.price, 0) / clients.length) : 0
    return { activeCount: active.length, totalClients: clients.length, mrr, compliance, totalSessions, usedSessions, totalMaxSessions, avgPrice }
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

  const sessionDistribution = useMemo(() => {
    const days: Record<string, number> = { Pzt: 0, Sal: 0, Çar: 0, Per: 0, Cum: 0, Cts: 0, Paz: 0 }
    calSessions.forEach(s => { if (days[s.day] !== undefined) days[s.day]++ })
    return Object.entries(days).map(([day, count]) => ({ day, count }))
  }, [calSessions])

  const clientGoals = useMemo(() => {
    const goals: Record<string, number> = {}
    clients.forEach(c => { const g = c.goal || 'Belirtilmedi'; goals[g] = (goals[g] || 0) + 1 })
    return Object.entries(goals).map(([name, value]) => ({ name, value }))
  }, [clients])

  const radialData = useMemo(() => [{
    name: 'Seans Kullanımı',
    value: stats.totalMaxSessions > 0 ? Math.round((stats.usedSessions / stats.totalMaxSessions) * 100) : 0,
    fill: 'var(--color-primary)'
  }], [stats])

  const lowSessionClients = clients.filter(c => c.sessions > 0 && c.sessions <= 2)
  const zeroSessionClients = clients.filter(c => c.sessions === 0)

  const kpiCards = [
    {
      label: 'Aktif Danışan', value: stats.activeCount, numericValue: stats.activeCount,
      sub: `/ ${stats.totalClients} toplam`, color: 'primary', trend: '+3', trendUp: true,
      sparkData: [3, 5, 4, 7, 6, 8, stats.activeCount || 10],
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    },
    {
      label: 'Aylık Gelir', value: `₺${stats.mrr.toLocaleString('tr-TR')}`, numericValue: stats.mrr,
      prefix: '₺', sub: 'MRR', color: 'secondary', trend: '+12%', trendUp: true,
      sparkData: [8500, 10000, 12500, 11000, 13000, stats.mrr || 15000],
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
    },
    {
      label: 'Uyum Skoru', value: `%${stats.compliance}`, numericValue: stats.compliance,
      suffix: '%', sub: 'bu hafta', color: 'accent', trend: '+5%', trendUp: true,
      sparkData: [65, 72, 68, 78, 82, stats.compliance || 85],
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    },
    {
      label: 'Kalan Seans', value: stats.totalSessions, numericValue: stats.totalSessions,
      sub: `/ ${stats.totalMaxSessions} toplam`, color: 'sand',
      sparkData: [20, 18, 22, 19, 16, stats.totalSessions || 15],
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>,
    },
  ]

  const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)', secondary: 'var(--color-secondary)', accent: 'var(--color-accent)', sand: 'var(--color-sand)',
  }
  const colorClassMap: Record<string, string> = {
    primary: 'text-primary', secondary: 'text-secondary', accent: 'text-accent',
    sand: 'text-sand',
  }
  const bgMap: Record<string, string> = {
    primary: dm ? 'bg-primary/10' : 'bg-primary/[0.06]',
    secondary: dm ? 'bg-secondary/10' : 'bg-secondary/[0.06]',
    accent: dm ? 'bg-accent/10' : 'bg-accent/[0.06]',
    sand: dm ? 'bg-sand/10' : 'bg-sand/[0.06]',
  }

  const cardBase = `rounded-2xl border transition-all duration-500 ${dm ? 'border-white/[0.04] bg-white/[0.015]' : 'border-black/[0.03] bg-[#FAFAF8]'}`
  const chartTitle = `text-[0.78rem] font-medium tracking-[-0.01em] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`
  const axisStyle = { fontSize: 10, fill: dm ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {/* ═══ Header with Greeting ═══ */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-[0.78rem] font-medium mb-1.5 ${dm ? 'text-primary/60' : 'text-primary/70'}`}
          >
            {greeting}, Ela
          </motion.p>
          <h2 className={`font-display text-[2rem] font-semibold tracking-[-0.03em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
            Platform Özeti
          </h2>
          <p className={`mt-1.5 text-[0.82rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>
            Tüm veriler tek bakışta
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.72rem] font-medium ${dm ? 'bg-white/[0.04] text-text-main/40' : 'bg-black/[0.03] text-text-main/40'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </motion.div>

      {/* ═══ KPI Cards with Sparklines & Animated Counters ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}
            whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className={`${cardBase} p-5 group relative overflow-hidden cursor-default`}>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${colorMap[card.color]}10 0%, transparent 70%)` }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${bgMap[card.color]} ${colorClassMap[card.color]}`}>
                  {card.icon}
                </div>
                <div className="flex items-center gap-2">
                  <Sparkline data={card.sparkData} color={colorMap[card.color]} dm={dm} />
                  {card.trend && (
                    <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-lg ${dm ? 'bg-secondary/10 text-secondary' : 'bg-secondary/[0.08] text-secondary'}`}>
                      {card.trend}
                    </span>
                  )}
                </div>
              </div>

              <div className={colorClassMap[card.color]}>
                <AnimCounter value={card.numericValue} prefix={card.prefix || ''} suffix={card.suffix || ''} dm={dm} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-[0.7rem] uppercase tracking-[0.08em] ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>{card.label}</p>
                {card.sub && <p className={`text-[0.65rem] ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>{card.sub}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Quick Actions ═══ */}
      <motion.div variants={fadeUp} custom={4} className="mb-6">
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
          <QuickAction dm={dm} label="Yeni Danışan"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>}
          />
          <QuickAction dm={dm} label="Program Oluştur"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>}
          />
          <QuickAction dm={dm} label="Randevu Ekle"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>}
          />
          <QuickAction dm={dm} label="Mesaj Gönder"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
          />
        </div>
      </motion.div>

      {/* ═══ Charts Row 1 ═══ */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Revenue Trend */}
        <motion.div variants={fadeUp} custom={5} className={`${cardBase} p-6 group`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={chartTitle}>Aylık Gelir Trendi</h3>
            <span className={`text-[0.65rem] px-2.5 py-1 rounded-lg transition-colors duration-300 ${dm ? 'bg-primary/10 text-primary/70 group-hover:bg-primary/15' : 'bg-primary/[0.06] text-primary/70 group-hover:bg-primary/[0.1]'}`}>6 ay</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barCategoryGap="25%">
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} width={45} />
              <Tooltip {...tt} formatter={(v: number) => [`₺${v.toLocaleString('tr-TR')}`, 'Gelir']} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 2, 2]} animationDuration={1200} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Macro Distribution */}
        <motion.div variants={fadeUp} custom={6} className={`${cardBase} p-6 group`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={chartTitle}>Makro Dağılımı</h3>
            <span className={`text-[0.65rem] px-2.5 py-1 rounded-lg transition-colors duration-300 ${dm ? 'bg-secondary/10 text-secondary/70 group-hover:bg-secondary/15' : 'bg-secondary/[0.06] text-secondary/70 group-hover:bg-secondary/[0.1]'}`}>bugün</span>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={macroTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={3} animationDuration={1000}>
                  {macroTotals.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tt} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {macroTotals.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div className="flex-1">
                    <p className={`text-[0.72rem] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>{m.name}</p>
                    <p className={`text-[0.88rem] font-semibold ${dm ? 'text-white/80' : 'text-[#1C1917]/80'}`}>{m.value}g</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Charts Row 2 ═══ */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Compliance Trend */}
        <motion.div variants={fadeUp} custom={7} className={`${cardBase} p-6`}>
          <h3 className={`${chartTitle} mb-5`}>Haftalık Uyum Trendi</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={complianceData}>
              <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={35} />
              <Tooltip {...tt} formatter={(v: number) => [`%${v}`, 'Uyum']} />
              <defs>
                <linearGradient id="uyumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="score" stroke="var(--color-secondary)" fill="url(#uyumGrad)" strokeWidth={2} dot={{ fill: 'var(--color-secondary)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'var(--color-primary)', strokeWidth: 0 }} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Distribution */}
        <motion.div variants={fadeUp} custom={8} className={`${cardBase} p-6`}>
          <h3 className={`${chartTitle} mb-5`}>Gün Bazlı Randevu</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={sessionDistribution}>
              <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={25} />
              <Tooltip {...tt} />
              <Line type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: 'var(--color-accent)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 0 }} animationDuration={1200} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Usage Radial */}
        <motion.div variants={fadeUp} custom={9} className={`${cardBase} p-6 flex flex-col`}>
          <h3 className={`${chartTitle} mb-3`}>Seans Kullanım Oranı</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={130}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: dm ? 'rgba(255,255,255,0.03)' : '#f0eeec' }} animationDuration={1500} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-6">
              <div className={`text-[2rem] font-semibold tracking-[-0.03em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                <AnimCounter value={radialData[0].value} suffix="%" dm={dm} />
              </div>
              <p className={`text-[0.7rem] mt-0.5 ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>{stats.usedSessions} / {stats.totalMaxSessions} seans</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Bottom Row ═══ */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Alerts */}
        <motion.div variants={fadeUp} custom={10} className={`${cardBase} p-6`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={chartTitle}>Dikkat Gerektiren</h3>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${dm ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
            {lowSessionClients.length === 0 && zeroSessionClients.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', damping: 20 }}
                className={`text-center py-8 ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[0.82rem]">Her şey yolunda!</p>
              </motion.div>
            ) : (
              <>
                {lowSessionClients.map((c, i) => (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors duration-300 ${dm ? 'bg-amber-500/[0.04] border border-amber-500/10 hover:bg-amber-500/[0.07]' : 'bg-amber-50/80 border border-amber-100 hover:bg-amber-50'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${dm ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                      {c.sessions}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[0.82rem] font-medium truncate ${dm ? 'text-white/80' : 'text-[#1C1917]/80'}`}>{c.name}</p>
                      <p className={`text-[0.7rem] ${dm ? 'text-amber-400/50' : 'text-amber-600/50'}`}>Seans azalıyor — paket yenileme hatırlat</p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${dm ? 'text-amber-400/30' : 'text-amber-500/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </motion.div>
                ))}
                {zeroSessionClients.map((c, i) => (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (lowSessionClients.length + i) * 0.08, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors duration-300 ${dm ? 'bg-red-500/[0.04] border border-red-500/10 hover:bg-red-500/[0.07]' : 'bg-red-50/80 border border-red-100 hover:bg-red-50'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${dm ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>
                      0
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[0.82rem] font-medium truncate ${dm ? 'text-white/80' : 'text-[#1C1917]/80'}`}>{c.name}</p>
                      <p className={`text-[0.7rem] ${dm ? 'text-red-400/50' : 'text-red-600/50'}`}>Seansı bitti — yeni paket teklifi gönder</p>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Client Goals */}
        <motion.div variants={fadeUp} custom={11} className={`${cardBase} p-6`}>
          <h3 className={`${chartTitle} mb-5`}>Danışan Hedef Dağılımı</h3>
          {clientGoals.length === 0 ? (
            <div className={`text-center py-8 ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>
              <p className="text-[0.82rem]">Henüz danışan yok</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {clientGoals.map((g, i) => (
                <motion.div key={g.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 group/goal">
                  <div className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-300 group-hover/goal:scale-125" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className={`text-[0.82rem] flex-1 truncate transition-colors duration-300 ${dm ? 'text-white/60 group-hover/goal:text-white/80' : 'text-[#1C1917]/60 group-hover/goal:text-[#1C1917]/80'}`}>{g.name}</span>
                  <span className={`text-[0.82rem] font-semibold tabular-nums ${dm ? 'text-white/70' : 'text-[#1C1917]/70'}`}>{g.value}</span>
                  <div className={`w-20 h-1.5 rounded-full overflow-hidden ${dm ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(g.value / stats.totalClients) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Summary */}
          <div className={`mt-6 pt-5 border-t ${dm ? 'border-white/[0.04]' : 'border-black/[0.03]'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-[0.65rem] uppercase tracking-[0.1em] mb-1 ${dm ? 'text-text-main/20' : 'text-text-main/20'}`}>Ortalama Ücret</p>
                <p className="text-lg font-semibold text-primary tracking-[-0.02em]">₺{stats.avgPrice.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <p className={`text-[0.65rem] uppercase tracking-[0.1em] mb-1 ${dm ? 'text-text-main/20' : 'text-text-main/20'}`}>Takvim Randevu</p>
                <p className="text-lg font-semibold text-secondary tracking-[-0.02em]">{calSessions.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
