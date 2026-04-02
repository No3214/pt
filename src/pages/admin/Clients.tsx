import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useNavigate } from 'react-router-dom'
import { sanitize } from '../../lib/constants'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Clients() {
  const { clients, addClient, deleteClient, useSession, markHabit, addNote, deleteNote, showToast, darkMode: dm } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', goal: '', sessions: 12, price: 5000 })
  const [notesModal, setNotesModal] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (!form.name.trim()) { showToast('İsim giriniz.'); return }
    addClient({ name: sanitize(form.name), goal: sanitize(form.goal), sessions: form.sessions, max: form.sessions, price: form.price })
    setForm({ name: '', goal: '', sessions: 12, price: 5000 })
    setShowForm(false)
    showToast('Danışan eklendi!')
  }

  const handleHabit = (id: string) => {
    const success = confirm('Danışan bugünkü hedeflerine (Su, Makro, Adım, Uyku) uydu mu?\n[Tamam] = Uydu\n[İptal] = Uymadı')
    markHabit(id, success)
  }

  const handleReadiness = (name: string) => {
    const text = encodeURIComponent(`Günaydın ${name}! Bugünkü antrenman öncesi kısa bir rutin değerlendirme yapalım:\n\n1. Dün Geceki Uyku Puanın (1-10):\n2. Mevcut Yorgunluk Hissin (1-10):\n3. Kas Ağrın / Hamlık (1-10):\n4. Beslenme Uyumun Yüzde Kaç:\n\nLütfen rakamlarla cevapla, bugünkü yüklenmemizi ona göre optimize edelim.`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleSaveNote = () => {
    if (!noteText.trim() || !notesModal) return
    addNote(notesModal, sanitize(noteText))
    setNoteText('')
    showToast('Not kaydedildi!')
  }

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const notesClient = notesModal ? clients.find(c => c.id === notesModal) : null

  // Stats
  const totalClients = clients.length
  const activeSessions = clients.reduce((a, c) => a + c.sessions, 0)
  const totalRevenue = clients.reduce((a, c) => a + c.price, 0)  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Danışan Yönetimi</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>CRM & seans takibi</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showForm ? (dm ? 'bg-white/10 text-white border-none' : 'bg-stone-100 text-stone-700 border-none') : 'bg-terracotta text-white border-none'}`}
        >
          {showForm ? '✕ Kapat' : '+ Yeni Danışan'}
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Toplam Danışan', value: totalClients, icon: '👥' },
          { label: 'Aktif Seans', value: activeSessions, icon: '🏋️' },
          { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: '💰' },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{s.label}</p>
                <p className="text-2xl font-semibold mt-0.5">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Add Client Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className={`p-8 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>              <h3 className="font-display text-xl font-medium mb-6">Yeni Danışan Ekle</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ad Soyad</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Mina Aksoy" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Alan / Hedef</label>
                  <input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className={inp} placeholder="Kuvvet / Voleybol" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ders Sayısı</label>
                  <input type="number" value={form.sessions} onChange={e => setForm({ ...form, sessions: +e.target.value })} className={inp} />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ücret (₺)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className={inp} />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAdd}
                className="mt-6 w-full py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
              >
                Danışanı Kaydet
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Cards */}
      {clients.length === 0 ? (
        <motion.div variants={fadeUp} className={`text-center py-20 rounded-2xl border border-dashed ${dm ? 'border-white/10' : 'border-black/10'}`}>
          <p className="text-4xl mb-4">👥</p>
          <p className={`font-display text-xl ${dm ? 'text-white/40' : 'text-stone-400'}`}>Henüz danışan eklenmedi</p>
          <p className={`text-sm mt-1 ${dm ? 'text-white/25' : 'text-stone-300'}`}>Yeni danışan eklemek için yukarıdaki butonu kullanın</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-4">
          {clients.map(c => {
            const comp = c.habitMax > 0 ? Math.round((c.habitScore / c.habitMax) * 100) : 0
            const sessionPercent = c.max > 0 ? Math.round((c.sessions / c.max) * 100) : 0
            const isLow = c.sessions <= 2
            return (              <motion.div
                key={c.id}
                variants={fadeUp}
                layout
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-black/[0.04] hover:border-black/[0.08]'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4 md:w-[240px]">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${dm ? 'bg-terracotta/20 text-terracotta' : 'bg-terracotta/10 text-terracotta'}`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg leading-tight">{c.name}</h4>
                      <p className={`text-xs mt-0.5 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{c.goal || 'Hedef belirtilmedi'}</p>
                    </div>
                  </div>

                  {/* Session Progress */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>Seans İlerlemesi</span>
                      <span className={`text-sm font-semibold ${isLow ? 'text-terracotta' : ''}`}>{c.sessions}/{c.max}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sessionPercent}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${isLow ? 'bg-terracotta' : 'bg-sage'}`}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-300'}`}>₺{c.price.toLocaleString('tr-TR')}</span>
                      <span className={`text-xs ${comp > 70 ? 'text-sage' : 'text-terracotta'}`}>Uyum: %{comp}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => useSession(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      Seans -1
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/builder')}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-terracotta/10 text-terracotta border-none">
                      Program Yaz
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleHabit(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      Disiplin
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setNotesModal(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      Not ({c.notes.length})
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleReadiness(c.name)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      WA Rapor
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { if (confirm('Danışanı tamamen silmek istediğinize emin misiniz?')) deleteClient(c.id) }}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer border border-terracotta/30 text-terracotta bg-transparent hover:bg-terracotta/5">
                      Sil
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Notes Modal */}
      <AnimatePresence>
        {notesModal && notesClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setNotesModal(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`rounded-2xl p-8 max-w-[560px] w-full max-h-[80vh] overflow-y-auto shadow-2xl ${dm ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold">{notesClient.name}</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Danışan Notları</p>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setNotesModal(null)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none text-lg ${dm ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  ✕
                </motion.button>
              </div>

              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="Yeni not ekle..."
                className={`${inp} mb-4`} />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSaveNote}
                className="w-full py-3.5 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer mb-6"
              >
                Not Kaydet
              </motion.button>

              {notesClient.notes.length === 0 ? (
                <p className={`text-center py-8 ${dm ? 'text-white/30' : 'text-stone-300'}`}>Henüz not yok.</p>
              ) : (
                <div className="space-y-3">
                  {notesClient.notes.map(n => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-l-[3px] border-sage rounded-r-xl ${dm ? 'bg-white/[0.03]' : 'bg-stone-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[0.7rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{n.date}</span>
                        <button onClick={() => deleteNote(notesClient.id, n.id)} className="bg-transparent border-none cursor-pointer text-terracotta/60 hover:text-terracotta text-sm transition-colors">×</button>
                      </div>
                      <p className="text-sm mt-1.5 leading-relaxed">{n.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}