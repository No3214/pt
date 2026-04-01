import { useState } from 'react'
import { useStore } from '../../stores/useStore'
import { daysArr } from '../../lib/constants'

export default function CalendarPage() {
  const { clients, calSessions, addCalSession, deleteCalSession, showToast, darkMode } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [form, setForm] = useState({ client: '', day: 'Pzt', time: '10:00' })

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'

  const handleAdd = () => {
    const name = form.client || activeClients[0]?.name
    if (!name || !form.time) return
    addCalSession({ name, day: form.day, time: form.time })
    showToast('Randevu eklendi!')
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold mb-8">İnteraktif Seans Takvimi</h2>
      <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
        {/* Form */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="text-lg font-medium mb-4">📌 Randevu Ekle</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Müşteri Seç</label>
              <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className={inp}>
                {activeClients.length === 0 ? <option>Listede Yok</option> : activeClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Gün</label>
              <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} className={inp}>
                {daysArr.map(d => <option key={d} value={d}>{d === 'Pzt' ? 'Pazartesi' : d === 'Sal' ? 'Salı' : d === 'Çar' ? 'Çarşamba' : d === 'Per' ? 'Perşembe' : d === 'Cum' ? 'Cuma' : d === 'Cts' ? 'Cumartesi' : 'Pazar'}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Saat</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inp} />
            </div>
            <button onClick={handleAdd} className="btn-ripple w-full py-3 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">Takvime Ekle</button>
            <p className="text-xs text-center text-[#57534E]">Not: Buraya eklenen ders CRM'den seans eksiltmez.</p>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysArr.map(day => (
            <div key={day} className={`rounded-sm border flex flex-col min-h-[300px] ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
              <div className="bg-sage text-white py-2 text-center font-semibold text-sm rounded-t-sm">{day}</div>
              <div className="p-2 flex flex-col gap-2 flex-1">
                {calSessions
                  .map((s, idx) => ({ ...s, idx }))
                  .filter(s => s.day === day)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(sess => (
                    <div key={sess.idx} className={`border-l-[3px] border-terracotta p-2 rounded-r text-xs relative ${cardBg}`}>
                      <div className="font-semibold">{sess.time}</div>
                      <div>{sess.name}</div>
                      <button onClick={() => deleteCalSession(sess.idx)} className="absolute top-1 right-1 bg-transparent border-none cursor-pointer text-[#57534E] text-sm">×</button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
