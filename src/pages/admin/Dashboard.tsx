import { useMemo } from 'react'
import { useStore } from '../../stores/useStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

const COLORS = ['#7A9E82', '#D4C4AB', '#C2684A']

export default function Dashboard() {
  const { clients, foodLog, darkMode } = useStore()

  const stats = useMemo(() => {
    const active = clients.filter(c => c.sessions > 0)
    const mrr = active.reduce((a, c) => a + c.price, 0)
    const totalHabitMax = clients.reduce((a, c) => a + c.habitMax, 0)
    const totalHabitScore = clients.reduce((a, c) => a + c.habitScore, 0)
    const compliance = totalHabitMax > 0 ? Math.round((totalHabitScore / totalHabitMax) * 100) : 0
    return { activeCount: active.length, mrr, compliance }
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

  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'
  const textMuted = darkMode ? 'text-gray-400' : 'text-[#57534E]'

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold mb-8">Platform Özeti</h2>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className={`card-hover p-6 rounded-md border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
          <p className="text-xs uppercase tracking-[0.1em] text-[#57534E]">Aktif Danışan / Paket</p>
          <p className="text-4xl font-semibold mt-2">{stats.activeCount}</p>
        </div>
        <div className={`card-hover p-6 rounded-md border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
          <p className="text-xs uppercase tracking-[0.1em] text-[#57534E]">Tahmini Aylık Gelir (MRR)</p>
          <p className="text-4xl font-semibold mt-2 text-sage">₺{stats.mrr.toLocaleString('tr-TR')}</p>
        </div>
        <div className={`card-hover p-6 rounded-md border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
          <p className="text-xs uppercase tracking-[0.1em] text-[#57534E]">Müşteri Uyum Skoru</p>
          <p className="text-4xl font-semibold mt-2 text-terracotta">%{stats.compliance}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className={`${cardBg} p-4 rounded-md`}>
          <h3 className="text-sm font-medium mb-4">📈 Aylık Gelir Trendi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₺${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`₺${v.toLocaleString()}`, 'MRR']} />
              <Bar dataKey="value" fill="#C2684A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${cardBg} p-4 rounded-md`}>
          <h3 className="text-sm font-medium mb-4">🎯 Makro Dağılımı (Bugün)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={macroTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}g`}>
                {macroTotals.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${cardBg} p-4 rounded-md`}>
        <h3 className="text-sm font-medium mb-4">💧 Haftalık Uyum Skoru</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={complianceData}>
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Uyum']} />
            <Area type="monotone" dataKey="score" stroke="#7A9E82" fill="rgba(122,158,130,0.1)" strokeWidth={2} dot={{ fill: '#C2684A', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
