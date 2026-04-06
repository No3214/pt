import { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useSearchParams, useNavigate } from 'react-router-dom'
import StudentProgressDashboard from '../../components/admin/charts/StudentProgressDashboard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Progress() {
  const { darkMode: dm, clients, measurements, workoutLogs, targetWeight, generateMockData } = useStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const clientId = searchParams.get('id')

  const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId])
  const clientMeasurements = useMemo(() => measurements.filter(m => m.clientId === clientId), [measurements, clientId])

  useEffect(() => {
    if (clientId && clientMeasurements.length === 0) {
      // If no data, generate mock for demo
      generateMockData(clientId)
    }
  }, [clientId, clientMeasurements, generateMockData])

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold text-text-main">Danışan bulunamadı.</h1>
        <button onClick={() => navigate('/admin/clients')} className="bg-primary px-6 py-2 rounded-xl text-white">Geri Dön</button>
      </div>
    )
  }

  const dashboardData = {
    client,
    measurements: clientMeasurements,
    workoutLogs: workoutLogs,
    targetWeight: targetWeight || 75
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-12">
      {/* Header */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <button onClick={() => navigate('/admin/clients')} className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center hover:bg-primary/20 transition-all border-none cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </button>
             <p className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.3em]">
               Performans Analitiği
             </p>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold tracking-tighter leading-none text-text-main">
            {client.name} — <br /> Gelişim Karnesi.
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className={`p-6 rounded-[2rem] border ${dm ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
            <div className="text-2xl font-bold text-text-main tabular-nums">{clientMeasurements.length}</div>
            <div className="text-[0.6rem] uppercase tracking-widest opacity-40 font-bold">Toplam Ölçüm</div>
          </div>
          <div className={`p-6 rounded-[2rem] border ${dm ? 'bg-primary/20 border-primary/20' : 'bg-primary/5 border-primary/10 shadow-sm'}`}>
            <div className="text-2xl font-bold text-primary tabular-nums">%{client.habitScore || '0'}</div>
            <div className="text-[0.6rem] uppercase tracking-widest opacity-40 font-bold text-primary">T. Alışkanlık</div>
          </div>
        </div>
      </motion.section>

      {/* Main Charts Dashboard */}
      <motion.section variants={fadeUp} transition={{ delay: 0.2 }}>
        <StudentProgressDashboard data={dashboardData} dm={dm} />
      </motion.section>

      {/* Action Banner */}
      <motion.div 
        variants={fadeUp}
        className={`p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-8 ${
          dm ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/10'
        }`}
      >
        <div className="max-w-md">
          <h4 className="font-display text-xl font-bold mb-2">Veri Odaklı Performans</h4>
          <p className="text-sm opacity-60 leading-relaxed font-medium">Bu grafikler, sporcunun biyo-metrik verilerini ve istikrarını analiz etmek için tasarlanmıştır. Her ölçüm, stratejimizi optimize etmemize yardımcı olur.</p>
        </div>
        <button onClick={() => navigate('/admin/assessment')} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all border-none cursor-pointer shadow-xl shadow-primary/20">
          Yeni Ölçüm Kaydet
        </button>
      </motion.div>
    </motion.div>
  )
}
