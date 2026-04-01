import { useState } from 'react'
import { useStore } from '../../stores/useStore'
import { useNavigate } from 'react-router-dom'
import { sanitize } from '../../lib/constants'

export default function Clients() {
  const { clients, addClient, deleteClient, useSession, markHabit, addNote, deleteNote, showToast, darkMode } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', goal: '', sessions: 12, price: 5000 })
  const [notesModal, setNotesModal] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const handleAdd = () => {
    if (!form.name.trim()) { alert('İsim giriniz.'); return }
    addClient({ name: sanitize(form.name), goal: sanitize(form.goal), sessions: form.sessions, max: form.sessions, price: form.price })
    setForm({ name: '', goal: '', sessions: 12, price: 5000 })
    showToast('Danışan eklendi!')
  }

  const handleHabit = (id: string) => {
    const success = confirm('Danışan bugünkü hedeflerine (Su, Makro, Adım, Uyku) uydu mu?\n[Tamam] = Uydu\n[İptal] = Uymadı')
    markHabit(id, success)
  }

  const handleReadiness = (name: string) => {
    const text = encodeURIComponent(`Günaydın ${name}! Bugünkü antrenman öncesi kısa bir rutin değerlendirme yapalım:\n\n1. Dün Geceki Uyku Puanın (1-10):\n2. Mevcut Yorgunluk Hissin (1-10):\n3. Kas Ağrın / Hamlık (1-10):\n4. Beslenme Uyumun Yüzde Kaç:\n\nLütfen rakamlarla cevapla, bugünkü yüklenmemizi ona göre optimize edelim. 🏐🔥`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleSaveNote = () => {
    if (!noteText.trim() || !notesModal) return
    addNote(notesModal, sanitize(noteText))
    setNoteText('')
    showToast('Not kaydedildi!')
  }

  const inp = `w-full p-4 rounded-sm border outline-none transition-all focus:border-terracotta ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const notesClient = notesModal ? clients.find(c => c.id === notesModal) : null

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold mb-8">Müşteri & Seans Yönetimi</h2>

      {/* Add Client */}
      <div className={`p-6 rounded-md mb-8 ${darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'}`}>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div><label className="block mb-1 text-sm font-medium">Ad Soyad</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Mina Aksoy" /></div>
          <div><label className="block mb-1 text-sm font-medium">Alan/Hedef</label><input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className={inp} placeholder="Kuvvet / Voleybol" /></div>
          <div className="flex gap-2">
            <div className="w-1/2"><label className="block mb-1 text-xs">Ders</label><input type="number" value={form.sessions} onChange={e => setForm({ ...form, sessions: +e.target.value })} className={inp} /></div>
            <div className="w-1/2"><label className="block mb-1 text-xs">Ücret (₺)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className={inp} /></div>
          </div>
          <button onClick={handleAdd} className="btn-ripple py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">Kaydet</button>
        </div>
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
              <th className="text-left p-4 font-display text-lg">Müşteri Bilgisi</th>
              <th className="text-left p-4 font-display text-lg">Paket / Kalan Seans</th>
              <th className="text-left p-4 font-display text-lg">Program / Finans</th>
              <th className="text-left p-4 font-display text-lg">Antrenör Check-in</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => {
              const comp = c.habitMax > 0 ? Math.round((c.habitScore / c.habitMax) * 100) : 0
              const compColor = comp > 70 ? 'text-sage' : 'text-terracotta'
              return (
                <tr key={c.id} className={`border-b ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <td className="p-4">
                    <strong>{c.name}</strong><br />
                    <span className="text-xs uppercase tracking-wider text-[#57534E]">Hedef: {c.goal}</span><br />
                    <span className={`text-xs uppercase tracking-wider ${compColor}`}>Uyum: %{comp}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xl font-semibold">{c.sessions}</span> / {c.max} Ders<br />
                    {c.sessions > 0
                      ? <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Kalan: {c.sessions} Ders</span>
                      : <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-terracotta/10 text-terracotta">Paket Bitti</span>
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => useSession(c.id)} className={`px-3 py-1 rounded-full text-xs border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Seans Düş (-1)</button>
                      <button onClick={() => navigate('/admin/builder')} className="px-3 py-1 rounded-full text-xs bg-terracotta text-white border-none cursor-pointer">✒️ Program Yaz</button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap mb-2">
                      <button onClick={() => handleHabit(c.id)} className="px-3 py-1 rounded-full text-xs bg-terracotta text-white border-none cursor-pointer">💧 Disiplin</button>
                      <button onClick={() => setNotesModal(c.id)} className={`px-3 py-1 rounded-full text-xs border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>📝 Not ({c.notes.length})</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleReadiness(c.name)} className={`px-3 py-1 rounded-full text-xs border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>🩺 Rapor</button>
                      <button onClick={() => { if (confirm('Danışanı tamamen silmek istediğinize emin misiniz?')) deleteClient(c.id) }} className="px-3 py-1 rounded-full text-xs border border-terracotta text-terracotta bg-transparent cursor-pointer">Sil</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Notes Modal */}
      {notesModal && notesClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[5px] z-[300] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setNotesModal(null) }}>
          <div className={`rounded-lg p-8 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto shadow-2xl relative ${darkMode ? 'bg-card-dark' : 'bg-white'}`}>
            <button onClick={() => setNotesModal(null)} className="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-[#57534E]">×</button>
            <h3 className="font-display text-2xl mb-4">📝 Danışan Notları: {notesClient.name}</h3>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="Yeni not ekle..." className={`${inp} mb-4`} />
            <button onClick={handleSaveNote} className="btn-ripple w-full py-3 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer mb-6">Not Kaydet</button>
            {notesClient.notes.length === 0
              ? <p className="text-center text-[#57534E]">Henüz not yok.</p>
              : notesClient.notes.map(n => (
                <div key={n.id} className={`p-3 mb-2 border-l-[3px] border-sage rounded-r-sm ${darkMode ? 'bg-white/[0.03]' : 'bg-black/[0.02]'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.7rem] text-[#57534E]">{n.date}</span>
                    <button onClick={() => deleteNote(notesClient.id, n.id)} className="bg-transparent border-none cursor-pointer text-terracotta text-sm">🗑</button>
                  </div>
                  <p className="text-sm mt-1">{n.text}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}
