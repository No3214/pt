import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

interface Payment {
  id: string
  clientName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'overdue'
  package: string
  method: string
}

export default function PaymentTracker() {
  const { t, locale, currency } = useTranslation()
  const { clients } = useStore()
  const darkMode = useStore(s => s.darkMode)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all')

  // Generate demo payment data from clients
  const payments: Payment[] = useMemo(() => {
    const now = new Date()
    return clients.flatMap(c => {
      const entries: Payment[] = []
      // Current month payment
      entries.push({
        id: `${c.id}-curr`,
        clientName: c.name,
        amount: c.price,
        date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        status: c.sessions > 0 ? 'completed' : 'pending',
        package: `${c.max} ${t.admin.students_sessions.split(' ')[1]}`,
        method: t.admin.payments_method_transfer
      })
      // Last month
      entries.push({
        id: `${c.id}-prev`,
        clientName: c.name,
        amount: c.price,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString(),
        status: 'completed',
        package: `${c.max} ${t.admin.students_sessions.split(' ')[1]}`,
        method: t.admin.payments_method_cash
      })
      return entries
    })
  }, [clients, t])

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0)

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    completed: { label: t.admin.payments_status_paid, color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: '✅' },
    pending: { label: t.admin.payments_status_pending, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: '⏳' },
    overdue: { label: t.admin.payments_status_overdue, color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: '⚠️' },
  }

  const cardBg = darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-lg'

  return (
    <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">{t.admin.payments_title}</h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
            {t.admin.payments_subtitle}
          </p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: t.admin.payments_total, value: totalRevenue, color: 'text-green-600', icon: '💰' },
          { label: t.admin.payments_pending, value: pendingAmount, color: 'text-amber-600', icon: '⏳' },
          { label: t.admin.payments_overdue, value: overdueAmount, color: 'text-red-500', icon: '⚠️' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-bg border-black/[0.04]'}`}>
            <span className="text-2xl block mb-2">{stat.icon}</span>
            <div className={`font-display text-xl font-bold ${stat.color}`}>
              {currency}{stat.value.toLocaleString(locale)}
            </div>
            <div className={`text-[0.6rem] font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all' as const, label: t.admin.payments_filter_all },
          { key: 'completed' as const, label: t.admin.payments_filter_paid },
          { key: 'pending' as const, label: t.admin.payments_filter_pending },
          { key: 'overdue' as const, label: t.admin.payments_filter_overdue },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.key
                ? 'bg-primary text-white'
                : darkMode ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              darkMode ? 'border-white/[0.06] hover:border-white/[0.12]' : 'border-black/[0.06] hover:border-black/[0.12]'
            } transition-all`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {p.clientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-bold text-sm">{p.clientName}</div>
                <div className={`text-xs ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                  {p.package} • {p.method} • {new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(p.date))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{currency}{p.amount.toLocaleString(locale)}</span>
              <span className={`px-2.5 py-1 rounded-lg text-[0.6rem] font-bold border ${statusConfig[p.status].color}`}>
                {statusConfig[p.status].icon} {statusConfig[p.status].label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
