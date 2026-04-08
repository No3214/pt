import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useNavigate } from 'react-router-dom'
import { sanitize } from '../../lib/constants'
import { encryptData } from '../../lib/crypto'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, deductSession, addNote, deleteNote, showToast, darkMode: dm, measurements, progressPhotos, savedPrograms, whatsappTemplates } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', goal: '', sessions: 12, price: 5000, phone: '', email: '', allergens: [] as string[] })
  const [notesModal, setNotesModal] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [messageModal, setMessageModal] = useState<string | null>(null)
  const [sessionModal, setSessionModal] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', goal: '', sessions: 0, max: 0, price: 0, phone: '', email: '', allergens: [] as string[] })
  const [noteText, setNoteText] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  type SortKey = 'name' | 'sessions' | 'price' | 'habit';
  const [activeSort, setActiveSort] = useState<SortKey>('name')

  // Search + Sort
  const filteredClients = useMemo(() => {
    const list = clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase())
    )
    list.sort((a, b) => {
      switch (activeSort) {
        case 'sessions': return b.sessions - a.sessions
        case 'price': return b.price - a.price
        case 'habit': {
          const ha = a.habitMax > 0 ? a.habitScore / a.habitMax : 0
          const hb = b.habitMax > 0 ? b.habitScore / b.habitMax : 0
          return hb - ha
        }
        default: return a.name.localeCompare(b.name, 'tr')
      }
    })
    return list
  }, [clients, search, activeSort])

  const ALLERGEN_OPTIONS = ['Gluten', 'Laktoz', 'Yumurta', 'Fıstık', 'Ceviz/Badem', 'Kabuklu Deniz', 'Balık', 'Soya', 'Kırmızı Et', 'Kereviz', 'Mantar', 'Hardal', 'Susam', 'Narenciye']

  const toggleAllergen = (list: string[], item: string) =>
    list.includes(item) ? list.filter(a => a !== item) : [...list, item]

  const handleAdd = () => {
    if (!form.name.trim()) { showToast('İsim giriniz.'); return }
    addClient({ name: sanitize(form.name), goal: sanitize(form.goal), sessions: form.sessions, max: form.sessions, price: form.price, phone: form.phone, email: form.email, allergens: form.allergens })
    
    handleCRMMessage(form.name, 'welcome', form.phone)
    
    setForm({ name: '', goal: '', sessions: 12, price: 5000, phone: '', email: '', allergens: [] })
    setShowForm(false)
    showToast('Danışan eklendi ve otomasyon tetiklendi!')
  }

  const openEdit = (c: typeof clients[0]) => {
    setEditForm({ name: c.name, goal: c.goal, sessions: c.sessions, max: c.max, price: c.price, phone: c.phone || '', email: c.email || '', allergens: c.allergens || [] })
    setEditModal(c.id)
  }

  const handleEdit = () => {
    if (!editModal) return
    updateClient(editModal, {
      name: sanitize(editForm.name),
      goal: sanitize(editForm.goal),
      sessions: editForm.sessions,
      max: editForm.max,
      price: editForm.price,
      phone: editForm.phone,
      email: editForm.email,
      allergens: editForm.allergens,
    })
    setEditModal(null)
    showToast('Danışan güncellendi!')
  }

  const handleReadiness = (name: string) => {
    const text = encodeURIComponent(`Günaydın ${name}! Bugünkü antrenman öncesi kısa bir rutin değerlendirme yapalım:\n\n1. Dün Geceki Uyku Puanın (1-10):\n2. Mevcut Yorgunluk Hissin (1-10):\n3. Kas Ağrın / Hamlık (1-10):\n4. Beslenme Uyumun Yüzde Kaç:\n\nLütfen rakamlarla cevapla, bugünkü yüklenmemizi ona göre optimize edelim.`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleSharePortal = async (client: typeof clients[0]) => {
    const pin = prompt(`${client.name} için 6 haneli bir giriş PIN'i belirleyin:`, Math.floor(100000 + Math.random() * 900000).toString())
    if (!pin || pin.length < 4) return

    const bundle = {
      client: { id: client.id, name: client.name, goal: client.goal },
      measurements: measurements.filter(m => m.clientId === client.id).slice(-10),
      photos: progressPhotos.filter(p => p.clientId === client.id).slice(-3),
      programs: savedPrograms.filter(p => p.clientId === client.id),
      timestamp: Date.now()
    }

    try {
      const encrypted = await encryptData(JSON.stringify(bundle), pin)
      const portalUrl = `${window.location.origin}/portal?d=${encrypted}`
      
      const text = encodeURIComponent(`Merhaba ${client.name}! Senin için özel hazırladığım gelişim portalı hazır.\n\n🔗 Giriş Linki: ${portalUrl}\n\n🔐 Giriş PIN: *${pin}*\n\nBu linki telefonuna 'Ana Ekrana Ekle' yaparak uygulama gibi kullanabilirsin.`)
      window.open(`https://wa.me/${client.phone?.replace(/\D/g, '')}?text=${text}`, '_blank')
      showToast('Portal linki WhatsApp için hazırlandı!')
    } catch {
      showToast('Hata: Şifreleme başarısız oldu.')
    }
  }

  const handleShareMeasurementLink = (client: typeof clients[0]) => {
    const link = `${window.location.origin}/measure/${client.id}`
    const text = whatsappTemplates.measurement
      .replace('{{link}}', link)
      .replace('{{name}}', client.name.split(' ')[0])
    
    const url = `https://wa.me/${client.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    showToast('Ölçüm linki paylaşıldı!')
  }

  const handleCRMMessage = (name: string, type: 'welcome' | 'payment' | 'motivation', phone?: string) => {
    let text = ''
    if (type === 'welcome') text = `Merhaba ${name}, Ela Ebeoğlu Performance Coaching'e hoş geldin! 🎉\n\nÖdemen ulaştı ve kaydını başarıyla tamamladık. Hedeflerine ulaşmak için harika bir sürece başlıyoruz, seninle çalışmak için sabırsızlanıyorum! 💪`
    if (type === 'payment') text = `Selam ${name}! 🌟\n\nUmarım antrenmanlar harika gidiyordur. Yeni eğitim periyodumuz yaklaşıyor (Seans bitti/azaldı), güncel seans paketini yenilemek istersen benimle iletişime geçebilirsin. Varsa sorularını da bekliyorum!`
    if (type === 'motivation') text = `Harika iş çıkardın ${name}! 🔥\n\nSon antrenmanlarındaki disiplinin ve emeğin gerçekten takdire şayan. Aynen böyle devam ediyoruz, hedeflerimize adım adım yaklaşıyoruz!`
    
    // Telefon numarası varsa doğrudan sohbete yönlendir, yoksa genele.
    const url = phone 
      ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
      
    window.open(url, '_blank')
    setMessageModal(null)
  }

  const handleSessionAction = (id: string, action: 'deduct' | 'postpone') => {
    if (action === 'deduct') {
      deductSession(id)
      showToast('✓ 1 Seans Düşüldü ve Kaydedildi.')
      
      // 🔥 OTOMASYON: Seans bittiyse (1'den 0'a düştüyse) otomatik ödeme mesajı tetikle
      const c = clients.find(x => x.id === id)
      if (c && c.sessions === 1) { // 1 iken 0 oluyor
        setTimeout(() => {
          if (confirm('Seans tamamen bitti! 💡 Otomatik ödeme / paket yenileme mesajı göndermek ister misin?')) {
            handleCRMMessage(c.name, 'payment', c.phone)
          }
        }, 500)
      }
    } else {
      showToast('ℹ️ Seans ertelendi / İptal notu girildi.')
    }
    setSessionModal(null)
  }

  const handleSaveNote = () => {
    if (!noteText.trim() || !notesModal) return
    addNote(notesModal, sanitize(noteText))
    setNoteText('')
    showToast('Not kaydedildi!')
  }
  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const notesClient = notesModal ? clients.find(c => c.id === notesModal) : null

  // Stats
  const totalClients = clients.length
  const activeSessions = clients.reduce((a, c) => a + c.sessions, 0)
  const totalRevenue = clients.reduce((a, c) => a + c.price, 0)
  const avgHabit = clients.length > 0 ? Math.round(clients.reduce((a, c) => a + (c.habitMax > 0 ? (c.habitScore / c.habitMax) * 100 : 0), 0) / clients.length) : 0

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'İsim' },
    { key: 'sessions', label: 'Seans' },
    { key: 'price', label: 'Ücret' },
    { key: 'habit', label: 'Uyum' },
  ]

  return (
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
          onClick={() => setShowForm(!showForm)}          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showForm ? (dm ? 'bg-white/10 text-white border-none' : 'bg-stone-100 text-stone-700 border-none') : 'bg-primary text-white border-none'}`}
        >
          {showForm ? '✕ Kapat' : '+ Yeni Danışan'}
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam Danışan', value: totalClients, icon: '👥' },
          { label: 'Aktif Seans', value: activeSessions, icon: '🏋️' },
          { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: '💰' },
          { label: 'Ort. Uyum', value: `%${avgHabit}`, icon: '📊' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -2 }} className={`p-5 rounded-2xl border transition-all ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{s.label}</p>
                <p className="text-2xl font-semibold mt-0.5">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search + Sort Bar */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-6">        <div className="flex-1 min-w-[200px]">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Danışan ara..."
            className={inp}
          />
        </div>
        <div className="flex gap-1.5 items-center">
          {sortOptions.map(o => (
            <button
              key={o.key}
              onClick={() => setActiveSort(o.key)}
              className={`px-4 py-3 rounded-xl text-xs font-medium cursor-pointer border-none transition-all ${
                activeSort === o.key
                  ? 'bg-primary text-white'
                  : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Add Client Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className={`p-8 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
              <h3 className="font-display text-xl font-medium mb-6">Yeni Danışan Ekle</h3>
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ad Soyad</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Mina Aksoy" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Alan / Hedef</label>
                  <input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className={inp} placeholder="Kuvvet / Voleybol" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Telefon</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inp} placeholder="+90 5xx xxx xx xx" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>E-posta</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inp} placeholder="mail@ornek.com" />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ders Sayısı</label>
                  <input type="number" value={form.sessions} onChange={e => setForm({ ...form, sessions: +e.target.value })} className={inp} />
                </div>
                <div>                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ücret (₺)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className={inp} />
                </div>
                {/* Allergen Tags */}
                <div className="col-span-full">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Alerjenler</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALLERGEN_OPTIONS.map(a => (
                      <button key={a} onClick={() => setForm({ ...form, allergens: toggleAllergen(form.allergens, a) })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${form.allergens.includes(a)
                          ? 'bg-red-500/15 border-red-500/30 text-red-500'
                          : (dm ? 'border-white/10 text-white/40 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-400 bg-transparent hover:bg-stone-50')
                        }`}>
                        {form.allergens.includes(a) ? '⚠️ ' : ''}{a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAdd}
                className="mt-6 w-full py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer"
              >
                Danışanı Kaydet
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Cards */}
      {filteredClients.length === 0 ? (
        <motion.div variants={fadeUp} className={`text-center py-20 rounded-2xl border border-dashed ${dm ? 'border-white/10' : 'border-black/10'}`}>
          <p className="text-4xl mb-4">👥</p>
          <p className={`font-display text-xl ${dm ? 'text-white/40' : 'text-stone-400'}`}>
            {search ? 'Sonuç bulunamadı' : 'Henüz danışan eklenmedi'}
          </p>
          <p className={`text-sm mt-1 ${dm ? 'text-white/25' : 'text-stone-300'}`}>
            {search ? 'Farklı bir arama deneyin' : 'Yeni danışan eklemek için yukarıdaki butonu kullanın'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-4">
          {filteredClients.map(c => {            const comp = c.habitMax > 0 ? Math.round((c.habitScore / c.habitMax) * 100) : 0
            const sessionPercent = c.max > 0 ? Math.round((c.sessions / c.max) * 100) : 0
            const isLow = c.sessions <= 2
            return (
              <motion.div
                key={c.id}
                variants={fadeUp}
                layout
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-black/[0.04] hover:border-black/[0.08]'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4 md:w-[240px]">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-transform duration-300 ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${dm ? 'border-[#0c0c0c]' : 'border-white'} ${c.sessions > 2 ? 'bg-secondary' : c.sessions > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg leading-tight">{c.name}</h4>
                      <p className={`text-xs mt-0.5 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{c.goal || 'Hedef belirtilmedi'}</p>
                      {(c.phone || c.email) && (
                        <p className={`text-[0.65rem] mt-0.5 ${dm ? 'text-white/25' : 'text-stone-300'}`}>
                          {c.phone || c.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Session Progress */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>Seans İlerlemesi</span>
                      <span className={`text-sm font-semibold ${isLow ? 'text-primary' : ''}`}>{c.sessions}/{c.max}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sessionPercent}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${isLow ? 'bg-primary' : 'bg-secondary'}`}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-300'}`}>₺{c.price.toLocaleString('tr-TR')}</span>
                      <span className={`text-xs ${comp > 70 ? 'text-secondary' : 'text-primary'}`}>Uyum: %{comp}</span>
                      {c.sessions === 0 && <span className="text-xs text-primary font-medium">Seans Bitti!</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSessionModal(c.id)}
                      disabled={c.sessions === 0}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${c.sessions === 0 ? 'opacity-40 cursor-not-allowed' : ''} ${dm ? 'border-primary/50 text-white bg-primary/20 hover:bg-primary/40' : 'border-primary/30 text-primary bg-primary/10 hover:bg-primary/20'}`}>
                      Seans Yönet ({c.sessions})
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openEdit(c)}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-secondary/10 text-secondary border-none">
                      Düzenle
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSharePortal(c)}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-primary/10 text-primary border-none">
                      Paylaş
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/admin/progress?id=${c.id}`)}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-secondary/10 text-secondary border-none">
                      Gelişim
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/builder')}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-primary/10 text-primary border-none">
                      Program Yaz
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMessageModal(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20' : 'border-green-500/30 text-green-600 bg-green-50 hover:bg-green-100'}`}>
                      WhatsApp Hızlı Mesaj
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleShareMeasurementLink(c)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-primary/30 text-primary bg-primary/10 hover:bg-primary/20' : 'border-primary/30 text-primary bg-primary/5 hover:bg-primary/10'}`}>
                      📊 Ölçüm Linki At
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setNotesModal(c.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      Not ({c.notes.length})
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { if (confirm('Danışanı tamamen silmek istediğinize emin misiniz?')) deleteClient(c.id) }}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer border border-primary/30 text-primary bg-transparent hover:bg-primary/5">
                      Sil
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditModal(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`rounded-2xl p-8 max-w-[560px] w-full shadow-2xl ${dm ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Danışan Düzenle</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Bilgileri güncelleyin</p>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditModal(null)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-none text-lg ${dm ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  ✕
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ad Soyad</label>
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={inp} />
                </div>
                <div className="col-span-2">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hedef</label>
                  <input value={editForm.goal} onChange={e => setEditForm({ ...editForm, goal: e.target.value })} className={inp} />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Kalan Seans</label>
                  <input type="number" value={editForm.sessions} onChange={e => setEditForm({ ...editForm, sessions: +e.target.value })} className={inp} />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Toplam Seans</label>
                  <input type="number" value={editForm.max} onChange={e => setEditForm({ ...editForm, max: +e.target.value })} className={inp} />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ücret (₺)</label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: +e.target.value })} className={inp} />
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Telefon</label>
                  <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className={inp} />
                </div>
                <div className="col-span-2">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>E-posta</label>
                  <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className={inp} />
                </div>
                <div className="col-span-1">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Sporcu Seviyesi</label>
                  <select 
                    value={clients.find(c => c.id === editModal)?.athleteLevel || 'Rookie'} 
                    onChange={e => updateClient(editModal!, { athleteLevel: e.target.value as "Rookie" | "Pro" | "Elite" | "Legend" })}
                    className={inp}
                  >
                    <option value="Rookie">Rookie (Başlangıç)</option>
                    <option value="Pro">Pro (İleri)</option>
                    <option value="Elite">Elite (Şampiyon)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Sporcuya Özel Portal Mesajı</label>
                  <textarea 
                    value={clients.find(c => c.id === editModal)?.personalNote || ''} 
                    onChange={e => updateClient(editModal!, { personalNote: e.target.value })}
                    className={inp}
                    rows={2}
                    placeholder="Örn: Bu hafta harika iş çıkardın!"
                  />
                </div>
                {/* Allergen Tags (Edit) */}
                <div className="col-span-2">
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Alerjenler</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALLERGEN_OPTIONS.map(a => (
                      <button key={a} onClick={() => setEditForm({ ...editForm, allergens: toggleAllergen(editForm.allergens, a) })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${editForm.allergens.includes(a)
                          ? 'bg-red-500/15 border-red-500/30 text-red-500'
                          : (dm ? 'border-white/10 text-white/40 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-400 bg-transparent hover:bg-stone-50')
                        }`}>
                        {editForm.allergens.includes(a) ? '⚠️ ' : ''}{a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleEdit}
                  className="flex-1 py-3.5 rounded-full bg-primary text-white font-medium border-none cursor-pointer"
                >
                  Kaydet
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setEditModal(null)}
                  className={`px-8 py-3.5 rounded-full font-medium cursor-pointer border ${dm ? 'border-white/10 text-white/60 bg-transparent' : 'border-stone-200 text-stone-500 bg-transparent'}`}
                >
                  İptal
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Modal */}
      <AnimatePresence>
        {notesModal && notesClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
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
                className="w-full py-3.5 rounded-full bg-primary text-white font-medium border-none cursor-pointer mb-6"
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
                      className={`p-4 border-l-[3px] border-secondary rounded-r-xl ${dm ? 'bg-white/[0.03]' : 'bg-stone-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[0.7rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{n.date}</span>
                        <button onClick={() => deleteNote(notesClient.id, n.id)} className="bg-transparent border-none cursor-pointer text-primary/60 hover:text-primary text-sm transition-colors">×</button>
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

      {/* CRM Message Modal */}
      <AnimatePresence>
        {messageModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setMessageModal(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`rounded-2xl p-8 max-w-[500px] w-full shadow-2xl ${dm ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <h3 className="font-display text-2xl font-semibold mb-2">Hızlı WhatsApp Mesajı</h3>
              <p className={`text-sm mb-6 ${dm ? 'text-white/40' : 'text-stone-400'}`}>Otomatik CRM şablonlarından birini seçerek anında mesaj gönderin.</p>
              
              <div className="space-y-3">
                <button onClick={() => handleCRMMessage(clients.find(c => c.id === messageModal)?.name || '', 'welcome')}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/10' : 'bg-white border-black/[0.06] hover:bg-stone-50'}`}>
                  <span className="font-medium text-lg block mb-1">🎉 Yeni Kayıt & Hoşgeldin</span>
                  <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-500'}`}>Ödeme teyidi ve hedeflere başlangıç motivasyonu.</span>
                </button>
                <button onClick={() => handleCRMMessage(clients.find(c => c.id === messageModal)?.name || '', 'payment')}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/10' : 'bg-white border-black/[0.06] hover:bg-stone-50'}`}>
                  <span className="font-medium text-lg block mb-1">🗓️ Ödeme Hatırlatması</span>
                  <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-500'}`}>Yeni eğitim periyodu için kibar bir paket yenileme mesajı.</span>
                </button>
                <button onClick={() => handleCRMMessage(clients.find(c => c.id === messageModal)?.name || '', 'motivation')}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/10' : 'bg-white border-black/[0.06] hover:bg-stone-50'}`}>
                  <span className="font-medium text-lg block mb-1">🔥 Tebrik & Motivasyon</span>
                  <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-500'}`}>Son antrenmanlardaki disiplin için tebrik ve gaz verme.</span>
                </button>
                <button onClick={() => { handleReadiness(clients.find(c => c.id === messageModal)?.name || ''); setMessageModal(null) }}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${dm ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/10' : 'bg-white border-black/[0.06] hover:bg-stone-50'}`}>
                  <span className="font-medium text-lg block mb-1">📊 Günlük Wa Raporu İsteği</span>
                  <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-500'}`}>Uyku, yorgunluk, kas ağrısı rutin değerlendirme soruları.</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Management Modal */}
      <AnimatePresence>
        {sessionModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSessionModal(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`rounded-2xl p-8 max-w-[400px] w-full shadow-2xl text-center ${dm ? 'bg-[#111111]' : 'bg-white'}`}
            >
              <h3 className="font-display text-2xl font-semibold mb-2">Seans Yönetimi</h3>
              <p className={`text-sm mb-6 ${dm ? 'text-white/40' : 'text-stone-400'}`}>Planlanan ders gerçekleşti mi veya iptal mi oldu?</p>
              
              <div className="space-y-3">
                <button onClick={() => handleSessionAction(sessionModal, 'deduct')}
                  className="w-full py-4 rounded-xl font-medium cursor-pointer border-none bg-primary text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]">
                  Evet, 1 Seans Düş (-1)
                </button>
                <button onClick={() => handleSessionAction(sessionModal, 'postpone')}
                  className={`w-full py-4 rounded-xl font-medium cursor-pointer border transition-transform hover:scale-[1.02] ${dm ? 'bg-white/5 text-white/70 border-white/10' : 'bg-black/5 text-[#1C1917]/70 border-black/10'}`}>
                  Hayır, İptal / Ertele
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}