import { useState } from 'react'
import { useStore } from '../../stores/useStore'

export default function DataImporter() {
  const { addClient, showToast, darkMode: dm } = useStore()
  const [csvData, setCsvData] = useState('')

  const handleImport = () => {
    try {
      const rows = csvData.split('\n').filter(r => r.trim())
      if (rows.length === 0) return

      let count = 0
      rows.forEach(row => {
        const [name, goal, sessions, price] = row.split(',').map(s => s.trim())
        if (name) {
          addClient({
            name,
            goal: goal || 'Genel Fitness',
            sessions: parseInt(sessions) || 0,
            max: parseInt(sessions) || 12,
            price: parseInt(price) || 0,
            phone: '',
            email: ''
          })
          count++
        }
      })

      showToast(`${count} danışan başarıyla içeri aktarıldı! 🚀`)
      setCsvData('')
    } catch (e) {
      showToast('İçe aktarma sırasında hata oluştu. Lütfen formatı kontrol edin.')
    }
  }

  return (
    <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
      <h3 className="font-display text-2xl font-bold mb-4">Hızlı İçe Aktar (Excel/CSV) 📊</h3>
      <p className="text-sm opacity-40 mb-6 font-medium">Başka bir sistemden geçiş yapıyorsanız, danışanlarınızı virgülle ayırarak toplu ekleyebilirsiniz.</p>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-black/5 font-mono text-[0.65rem] opacity-60">
          Format: İsim, Hedef, Seans Sayısı, Ücret <br />
          Örn: Ahmet Yılmaz, Kilo Kaybı, 12, 5000
        </div>

        <textarea
          value={csvData}
          onChange={e => setCsvData(e.target.value)}
          placeholder="Her satıra bir danışan..."
          className="w-full h-40 p-5 rounded-2xl bg-black/5 border border-transparent focus:border-primary outline-none font-medium text-sm resize-none"
        />

        <button
          onClick={handleImport}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          İÇERİ AKTAR ⚡
        </button>
      </div>
    </div>
  )
}
