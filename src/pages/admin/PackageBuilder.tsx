import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, TrainingPackage } from '../../stores/useStore'
import { Plus, Trash2, Edit3, Check, X, Tag, Zap, Clock } from 'lucide-react'

export default function PackageBuilder() {
  const { packages, addPackage, updatePackage, deletePackage, darkMode } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<TrainingPackage, 'id'>>({
    name: '',
    price: 0,
    currency: 'TRY',
    sessions: 0,
    durationDays: 30,
    features: [],
    isActive: true
  })

  const [newFeature, setNewFeature] = useState('')

  const handleSave = () => {
    if (editingId) {
      updatePackage(editingId, formData)
      setEditingId(null)
    } else {
      addPackage(formData)
      setIsAdding(false)
    }
    setFormData({ name: '', price: 0, currency: 'TRY', sessions: 0, durationDays: 30, features: [], isActive: true })
  }

  const startEdit = (pkg: TrainingPackage) => {
    setEditingId(pkg.id)
    setFormData({ ...pkg })
    setIsAdding(true)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const cardStyle = `p-6 rounded-2xl border transition-all ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'}`
  const inputStyle = `w-full p-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-primary/50' : 'bg-stone-50 border-black/5 focus:border-primary/50'}`

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Paket Yönetimi 💎</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-stone-400'}`}>
            Öğrencilerinize sunduğunuz hizmetleri ve fiyatlandırmayı yönetin.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Yeni Paket Ekle
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cardStyle}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">{editingId ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 rounded-full hover:bg-black/5"><X size={20} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Paket Adı</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyle}
                    placeholder="Örn: Pro Performans"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Fiyat</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Para Birimi</label>
                    <select
                      value={formData.currency}
                      onChange={e => setFormData({ ...formData, currency: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="TRY">TRY (₺)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Seans Sayısı</label>
                    <input
                      type="number"
                      value={formData.sessions}
                      onChange={e => setFormData({ ...formData, sessions: Number(e.target.value) })}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Süre (Gün)</label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-50">Özellikler</label>
                <div className="flex gap-2">
                  <input
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addFeature()}
                    className={inputStyle}
                    placeholder="Örn: 7/24 Diyetisyen Desteği"
                  />
                  <button onClick={addFeature} className="p-3 rounded-xl bg-secondary text-white"><Plus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((f, i) => (
                    <span key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${darkMode ? 'bg-white/5' : 'bg-stone-100'}`}>
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold ${darkMode ? 'hover:bg-white/5' : 'hover:bg-stone-100'}`}
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20"
              >
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <motion.div
            layout
            key={pkg.id}
            className={`${cardStyle} relative group hover:border-primary/30 overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => startEdit(pkg)} className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-primary"><Edit3 size={16} /></button>
              <button onClick={() => deletePackage(pkg.id)} className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-red-500"><Trash2 size={16} /></button>
            </div>

            <div className="mb-6">
              <span className={`text-[0.6rem] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-primary/10 text-primary mb-3 inline-block`}>
                {pkg.sessions} Seans
              </span>
              <h3 className="font-display text-xl font-bold">{pkg.name}</h3>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{pkg.price.toLocaleString()}</span>
                <span className="text-sm opacity-50 font-bold">{pkg.currency}</span>
                <span className="text-xs opacity-30 ml-1">/ {pkg.durationDays} Gün</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {pkg.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-secondary flex-shrink-0" />
                  <span className="opacity-70">{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-black/5 flex items-center justify-between">
               <div className="flex items-center gap-4 text-[0.65rem] font-bold opacity-30 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Zap size={10} /> {pkg.sessions} Seans</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {pkg.durationDays} Gün</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
