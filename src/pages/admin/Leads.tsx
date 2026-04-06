import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore, type Lead } from '../../stores/useStore';
import { supabase } from '../../lib/supabase';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

const goalLabels: Record<string, string> = {
  voleybol: 'Voleybol Performans',
  fitness: 'Genel Fitness / Güç',
  'kilo-kaybi': 'Kilo Kaybı / Sıkılaşma',
  diger: 'Diğer',
};

const statusColors: Record<string, string> = {
  New: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Contacted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

export default function Leads() {
  const { darkMode: dm, updateLeadStatus, showToast, whatsappTemplates } = useStore();
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Veriler çekilemedi.');
    } else {
      const mapped: Lead[] = (data || []).map(l => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        goal: l.goal,
        notes: l.message,
        date: l.created_at,
        status: l.status
      }));
      setDbLeads(mapped);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateStatus = async (id: string, name: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: 'Contacted' })
      .eq('id', id);

    if (error) {
      showToast('Durum güncellenemedi.');
    } else {
      updateLeadStatus(id, 'Contacted');
      setDbLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'Contacted' } : l));
      showToast(`${name} ile iletişim durumu güncellendi ✅`);
    }
  };

  const handleShareOnboarding = (lead: Lead) => {
    const link = `${window.location.origin}/onboarding`
    const text = whatsappTemplates.onboarding.replace('{{link}}', link)
    
    const url = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    showToast('Ön kayıt formu linki paylaşıldı!')
  };

  const newCount = dbLeads.filter(l => l.status === 'New').length;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10">
      {/* Header */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <p className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.3em] mb-3">
            CRM · Potansiyel Müşteriler
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tighter leading-none text-text-main">
            Gelen Başvurular.
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          {newCount > 0 && (
            <span className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[0.8rem] font-bold">
              {newCount} Yeni Başvuru
            </span>
          )}
          <div className={`px-5 py-2.5 rounded-2xl border text-[0.8rem] font-bold uppercase tracking-widest ${
            dm ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-black/5 text-text-main/40 shadow-sm'
          }`}>
            {dbLeads.length} Toplam
          </div>
        </div>
      </motion.section>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full" />
        </div>
      ) : dbLeads.length === 0 ? (
        <motion.div variants={fadeUp}
          className={`p-16 rounded-[2.5rem] border text-center ${
            dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'
          }`}
        >
          <div className="text-6xl mb-6">📭</div>
          <h3 className="font-display text-2xl font-bold text-text-main mb-3">Henüz başvuru yok</h3>
          <p className="text-text-main/40 text-[0.95rem] max-w-md mx-auto">
            Landing sayfasındaki iletişim formundan gelen başvurular burada görünecek.
          </p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp}
          className={`rounded-[2.5rem] border overflow-hidden ${
            dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] ${
                  dm ? 'text-white/20 border-b border-white/5' : 'text-text-main/20 border-b border-black/5'
                }`}>
                  <th className="px-8 py-5">İsim</th>
                  <th className="px-8 py-5">Telefon</th>
                  <th className="px-8 py-5">Hedef</th>
                  <th className="px-8 py-5">Tarih</th>
                  <th className="px-8 py-5">Durum</th>
                  <th className="px-8 py-5">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {dbLeads.map((lead: Lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b last:border-b-0 transition-colors ${
                      dm ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-black/[0.03] hover:bg-black/[0.01]'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-[0.75rem]">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[0.9rem] text-text-main">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[0.85rem] text-text-main/60 font-medium tabular-nums">{lead.phone}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-bold ${
                        dm ? 'bg-white/5 text-white/50' : 'bg-black/[0.03] text-text-main/50'
                      }`}>
                        {goalLabels[lead.goal] || lead.goal}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[0.8rem] text-text-main/30 tabular-nums">
                      {new Date(lead.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg border text-[0.7rem] font-bold uppercase tracking-wider ${statusColors[lead.status]}`}>
                        {lead.status === 'New' ? 'Yeni' : 'İletişim Kuruldu'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {lead.status === 'New' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(lead.id, lead.name)}
                            className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[0.75rem] font-bold border-none cursor-pointer hover:bg-emerald-500/20 transition-all"
                          >
                            İletişim Kuruldu
                          </button>
                          <button
                            onClick={() => handleShareOnboarding(lead)}
                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[0.75rem] font-bold border-none cursor-pointer hover:bg-primary/20 transition-all"
                          >
                            📝 Form Gönder
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Lead Notes Preview */}
      {dbLeads.filter(l => l.notes).length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className={`text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4 ${
            dm ? 'text-white/20' : 'text-text-main/20'
          }`}>Başvuru Notları</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbLeads.filter(l => l.notes).map(lead => (
              <div key={lead.id} className={`p-5 rounded-2xl border ${
                dm ? 'bg-white/[0.02] border-white/5' : 'bg-stone-50 border-black/[0.04]'
              }`}>
                <p className="text-[0.75rem] font-bold text-primary mb-2">{lead.name}</p>
                <p className="text-[0.85rem] text-text-main/50 leading-relaxed">{lead.notes}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
