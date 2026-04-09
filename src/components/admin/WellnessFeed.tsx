import { useStore, WellnessLog } from '../../stores/useStore';
import { motion } from 'framer-motion';
import { useTranslation } from '../../locales';

export default function WellnessFeed() {
  const { t } = useTranslation();
  const { clients, darkMode: dm, showToast } = useStore();

  // Flatten and sort wellness logs from all clients
  const allLogs = clients.flatMap(c => 
    (c.wellnessLogs || []).map(log => ({
      ...log,
      clientName: c.name,
      clientId: c.id,
      phone: c.phone
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getAlertLevel = (log: WellnessLog) => {
    if (log.rpe >= 9 || log.sleep <= 5 || log.stress >= 8) return 'danger';
    if (log.rpe >= 7 || log.sleep <= 6 || log.stress >= 6) return 'warning';
    return 'safe';
  };

  const sendWellnessMessage = (name: string, phone: string, log: Record<string, unknown>) => {
    const alert = getAlertLevel(log);
    let message = t.admin.wellness_msg_base.replace('{name}', name);
    
    if (alert === 'danger') {
      message += t.admin.wellness_msg_danger;
    } else if (alert === 'warning') {
      message += t.admin.wellness_msg_warning;
    } else {
      message += t.admin.wellness_msg_safe;
    }

    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
      showToast(t.admin.wellness_toast_success);
    } else {
      showToast(t.admin.wellness_toast_error);
    }
  };

  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 h-full ${
      dm ? 'bg-white/[0.015] border-white/5' : 'bg-white border-black/[0.03] shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-xl font-bold text-text-main tracking-tight">{t.admin.wellness_title}</h3>
          <p className="text-[0.75rem] text-text-main/30 font-medium mt-1">{t.admin.wellness_subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <span className="text-xl">📊</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {allLogs.length === 0 ? (
          <div className="text-center py-16 opacity-50 italic">
            <p className="text-[0.9rem] font-medium">{t.admin.wellness_empty}</p>
          </div>
        ) : (
          allLogs.map((log, i) => {
            const alert = getAlertLevel(log);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-2xl border transition-all ${
                  alert === 'danger' ? (dm ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100') :
                  alert === 'warning' ? (dm ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100') :
                  (dm ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-100')
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert === 'danger' ? 'bg-red-500' : alert === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <span className="font-bold text-[1rem] text-text-main">{log.clientName}</span>
                  </div>
                  <span className="text-[0.65rem] font-bold opacity-30">
                    {new Intl.DateTimeFormat(t.common.loading.includes('Yükleniyor') ? 'tr-TR' : 'en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    }).format(new Date(log.date))}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: t.admin.wellness_sleep, val: log.sleep, icon: '😴' },
                    { label: t.admin.wellness_energy, val: log.energy, icon: '⚡' },
                    { label: t.admin.wellness_stress, val: log.stress, icon: '🧠' },
                    { label: 'RPE', val: log.rpe, icon: '🔥' },
                  ].map(s => (
                    <div key={s.label} className={`p-2 rounded-xl text-center ${dm ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="text-[0.55rem] font-bold opacity-40 uppercase mb-1">{s.label}</div>
                      <div className="text-sm font-bold text-text-main">{s.val}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => sendWellnessMessage(log.clientName, log.phone || '', log)}
                  className={`w-full py-2.5 rounded-xl text-[0.7rem] font-bold uppercase tracking-widest transition-all ${
                    alert === 'danger' ? 'bg-red-500 text-white' : 
                    alert === 'warning' ? 'bg-amber-500 text-white' : 
                    'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {t.admin.wellness_send_feedback}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
