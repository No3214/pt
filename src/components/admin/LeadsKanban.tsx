import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../stores/useStore'

export default function LeadsKanban() {
  const { darkMode: dm, showToast } = useStore()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const COLUMNS = [
    { id: 'New', label: 'Yeni Başvuru', icon: '📩' },
    { id: 'Contacted', label: 'İletişime Geçildi', icon: '📞' },
    { id: 'Assessment', label: 'Değerlendirme', icon: '📏' },
    { id: 'Closed', label: 'Kayıt Yapıldı', icon: '✅' }
  ]

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (data) setLeads(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (!error) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
      showToast('Başvuru durumu güncellendi!')
    }
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-10 min-h-[600px]">
      {COLUMNS.map(col => (
        <div key={col.id} className="flex-shrink-0 w-80">
          <div className="flex items-center gap-3 mb-6 px-2">
            <span className="text-xl">{col.icon}</span>
            <h3 className="font-display font-bold text-sm uppercase tracking-widest opacity-60">{col.label}</h3>
            <span className={`ml-auto text-[0.65rem] font-black px-2 py-0.5 rounded-md ${dm ? 'bg-white/10' : 'bg-black/5'}`}>
              {leads.filter(l => l.status === col.id).length}
            </span>
          </div>

          <div className={`p-4 rounded-[2rem] border min-h-[500px] space-y-4 ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.01] border-black/5'}`}>
            {leads.filter(l => l.status === col.id).map(lead => (
              <motion.div
                key={lead.id}
                layoutId={lead.id}
                className={`p-5 rounded-2xl border cursor-pointer group transition-all hover:scale-[1.02] ${
                  dm ? 'bg-white/5 border-white/5 hover:border-primary/50' : 'bg-white border-black/5 shadow-sm hover:border-primary/50'
                }`}
              >
                <h4 className="font-bold text-sm mb-1">{lead.full_name || lead.name}</h4>
                <p className="text-[0.65rem] opacity-40 font-medium mb-3">{lead.goal || 'Genel Hedef'}</p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[0.5rem] border border-white/10">👤</div>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="bg-transparent border-none text-[0.6rem] font-black uppercase text-primary outline-none cursor-pointer"
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>
              </motion.div>
            ))}
            {leads.filter(l => l.status === col.id).length === 0 && (
              <div className="py-20 text-center opacity-10 italic text-xs">Kart Yok</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
