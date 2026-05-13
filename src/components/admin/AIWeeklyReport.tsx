import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'

export default function AIWeeklyReport({ clientId }: { clientId: string }) {
  const { clients, measurements, darkMode: dm } = useStore()
  const [report, setReport] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const client = clients.find(c => c.id === clientId)
  const clientMeasurements = measurements.filter(m => m.clientId === clientId)

  const generateReport = async () => {
    setLoading(true)
    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 2000))

    if (!client) return

    const avgSleep = client.wellnessLogs?.reduce((acc, l) => acc + l.sleep, 0) || 0 / (client.wellnessLogs?.length || 1)
    const avgRPE = client.wellnessLogs?.reduce((acc, l) => acc + l.rpe, 0) || 0 / (client.wellnessLogs?.length || 1)
    const weightChange = clientMeasurements.length > 1
      ? (parseFloat(clientMeasurements[0].weight) - parseFloat(clientMeasurements[clientMeasurements.length-1].weight)).toFixed(1)
      : 0

    const analysis = `
### 📊 Haftalık Gelişim Analizi: ${client.name}

**Genel Özet:**
Bu hafta danışanınızın antrenman uyumu %${Math.round((client.habitScore / (client.habitMax || 1)) * 100)} seviyesinde gerçekleşti. Kilo değişimi: ${weightChange} kg.

**Wellness & Toparlanma:**
- Ortalama Uyku: ${avgSleep.toFixed(1)} saat. (İdeal aralığın altında, toparlanma gecikebilir)
- Ortalama Zorluk (RPE): ${avgRPE.toFixed(1)}. (Yüklenme seviyesi hedefe uygun)

**AI Tavsiyesi:**
Danışanın uyku süresi düşük seyrediyor. Bu hafta hacim artırmak yerine teknik odaklı ve orta şiddetli antrenmanlarla devam edilmesi, merkezi sinir sistemi yorgunluğunu önlemek adına daha sağlıklı olacaktır.
    `
    setReport(analysis)
    setLoading(false)
  }

  return (
    <div className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold">AI Asistan Analizi 🤖</h3>
        {!report && (
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Analiz Ediliyor...' : 'Haftalık Rapor Oluştur'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="prose prose-sm prose-invert max-w-none"
          >
            <div className={`p-6 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
              {report}
            </div>
            <button
              onClick={() => setReport(null)}
              className="mt-4 text-[0.65rem] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              Raporu Temizle
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!report && !loading && (
        <div className="text-center py-10 opacity-30 italic text-sm">
          Danışanın haftalık verilerini (uyku, stres, antrenman) analiz etmek için yukarıdaki butona tıklayın.
        </div>
      )}
    </div>
  )
}
