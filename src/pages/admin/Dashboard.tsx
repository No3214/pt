import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts'

const COLORS = ['#7A9E82', '#D4C4AB', '#C2684A', '#6B9BD2']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function Dashboard() {
  const { clients, foodLog, calSessions, darkMode } = useStore()
  const dm = darkMode

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
    clients.forEach(c => {
      const g = c.goal || 'Belirtilmedi'
      goals[g] = (goals[g] || 0) + 1
    })
    return Object.entries(goals).map(([name, value]) => ({ name, value }))
  }, [clients])

  const radialData = useMemo(() => [{
    name: 'Seans Kullanımı',
    value: stats.totalMaxSessions > 0 ? Math.round((stats.usedSessions / stats.totalMaxSessions) * 100) : 0,
    fill: '#C2684A'
  }], [stats])

  const kpiCards = [
    { label: 'Aktif Danışan', value: stats.activeCount, total: stats.totalClients, color: 'text-terracotta', icon: '👥' },
    { label: 'Aylık Gelir (MRR)', value: `₺${stats.mrr.toLocaleString('tr-TR')}`, color: 'text-sage', icon: '💰' },
    { label: 'Uyum Skoru', value: `%${stats.compliance}`, color: 'text-coast', icon: '🎯' },
    { label: 'Kalan Seans', value: stats.totalSessions, color: dm ? 'text-sand' : 'text-sand-dark', icon: '🏋️' },
  ]

  const lowSessionClients = clients.filter(c => c.sessions > 0 && c.sessions <= 2)
  const zeroSessionClients = clients.filter(c => c.sessions === 0)

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
        <div>
          <h2 className={`font-display text-3xl font-semibold ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
            Platform Özeti
          </h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
            Tüm veriler tek bakışta
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-sage/10 text-sage' : 'bg-sage/5 text-sage'}`}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`p-5 rounded-xl border transition-all duration-300 ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-[0.68rem] uppercase tracking-[0.12em] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>{card.label}</p>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className={`text-3xl font-semibold tracking-tight ${card.color}`}>{card.value}</p>
            {card.total !== undefined && (
              <p className={`text-[0.75rem] mt-1 ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>/ {card.total} toplam</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
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

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <motion.div variants={fadeUp} custom={6}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Haftalık Uyum Trendi</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={complianceData}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
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
              <Area type="monotone" dataKey="score" stroke="#7A9E82" fill="url(#uyumGrad)" strokeWidth={2} dot={{ fill: '#C2684A', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={7}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Gün Bazlı Randevu</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={sessionDistribution}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: dm ? '#666' : '#999' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: dm ? '#1a1a1a' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#6B9BD2" strokeWidth={2} dot={{ fill: '#6B9BD2', r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={8}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-2 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Seans Kullanım Oranı</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: dm ? 'rgba(255,255,255,0.04)' : '#f5f5f4' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-8">
            <p className={`text-2xl font-bold ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{radialData[0].value}%</p>
            <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{stats.usedSessions} / {stats.totalMaxSessions} seans</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} custom={9}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Dikkat Gerektiren</h3>
          <div className="space-y-3">
            {lowSessionClients.length === 0 && zeroSessionClients.length === 0 ? (
              <div className={`text-center py-6 ${dm ? 'text-white/20' : 'text-stone-300'}`}>
                <p className="text-2xl mb-1">✅</p>
                <p className="text-sm">Her şey yolunda!</p>
              </div>
            ) : (
              <>
                {lowSessionClients.map(c => (
                  <div key={c.id} className={`flex items-center gap-3 p-3.5 rounded-xl ${dm ? 'bg-amber-500/5' : 'bg-amber-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dm ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                      {c.sessions}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className={`text-xs ${dm ? 'text-amber-400/60' : 'text-amber-600/60'}`}>Seans azalıyor — paket yenileme hatırlat</p>
                    </div>
                  </div>
                ))}
                {zeroSessionClients.map(c => (
                  <div key={c.id} className={`flex items-center gap-3 p-3.5 rounded-xl ${dm ? 'bg-red-500/5' : 'bg-red-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dm ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>
                      0
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className={`text-xs ${dm ? 'text-red-400/60' : 'text-red-600/60'}`}>Seansı bitti — yeni paket teklifi gönder</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={10}
          className={`p-6 rounded-xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
          <h3 className={`text-[0.82rem] font-medium mb-5 ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Danışan Hedef Dağılımı</h3>
          {clientGoals.length === 0 ? (
            <div className={`text-center py-8 ${dm ? 'text-white/20' : 'text-stone-300'}`}>
              <p className="text-sm">Henüz danışan yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientGoals.map((g, i) => (
                <div key={g.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm flex-1 truncate">{g.name}</span>
                  <span className={`text-sm font-semibold ${dm ? 'text-white/60' : 'text-stone-500'}`}>{g.value}</span>
                  <div className={`w-24 h-1.5 rounded-full overflow-hidden ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(g.value / stats.totalClients) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`mt-6 pt-5 border-t ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>Ortalama Ücret</p>
                <p className="text-lg font-semibold text-terracotta">₺{stats.avgPrice.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>Takvim Randevu</p>
                <p className="text-lg font-semibold text-sage">{calSessions.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
