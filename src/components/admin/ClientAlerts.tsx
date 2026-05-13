import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'

export default function ClientAlerts() {
  const { clients, darkMode: dm } = useStore()

  const alerts = useMemo(() => {
    return clients.map(client => {
      const issues = []

      // Habit Consistency Alert
      if (client.habitMax > 0 && (client.habitScore / client.habitMax) < 0.4) {
        issues.push({ type: 'danger', msg: 'Düşük Alışkanlık Uyumu (%' + Math.round((client.habitScore/client.habitMax)*100) + ')' })
      }

      // Wellness Alerts
      const lastLog = client.wellnessLogs?.[client.wellnessLogs.length - 1]
      if (lastLog) {
        if (lastLog.stress > 7) issues.push({ type: 'warning', msg: 'Yüksek Stres Seviyesi (' + lastLog.stress + '/10)' })
        if (lastLog.sleep < 5) issues.push({ type: 'warning', msg: 'Yetersiz Uyku (' + lastLog.sleep + ' Saat)' })
        if (lastLog.rpe > 9) issues.push({ type: 'danger', msg: 'Aşırı Antrenman Yükü (RPE ' + lastLog.rpe + ')' })
      }

      // Session Alert
      if (client.sessions === 0) issues.push({ type: 'info', msg: 'Seans Hakkı Bitti' })

      return { ...client, issues }
    }).filter(c => c.issues.length > 0)
  }, [clients])

  if (alerts.length === 0) return null

  return (
    <div className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-primary/5 border-primary/20' : 'bg-red-50 border-red-100 shadow-xl'}`}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">⚠️</span>
        <h3 className="font-display text-xl font-bold">Dikkat Gerektiren Danışanlar</h3>
      </div>

      <div className="space-y-4">
        {alerts.map(client => (
          <div key={client.id} className={`p-5 rounded-2xl border flex items-center justify-between ${dm ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
            <div>
              <h4 className="font-bold text-sm mb-1">{client.name}</h4>
              <div className="flex flex-wrap gap-2">
                {client.issues.map((issue, i) => (
                  <span key={i} className={`text-[0.6rem] font-black uppercase px-2 py-0.5 rounded-md ${
                    issue.type === 'danger' ? 'bg-red-500/10 text-red-500' :
                    issue.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {issue.msg}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-xs font-bold text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors">
              İletişime Geç
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
