import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

export default function ClientAlerts() {
  const { t } = useTranslation();
  const { clients, darkMode: dm, showToast } = useStore();
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const alerts = [
    ...clients.filter(c => c.sessions > 0 && c.sessions <= 2).map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone || '',
      type: 'warning',
      msg: t.admin.alerts_msg_warning,
      val: c.sessions
    })),
    ...clients.filter(c => c.sessions === 0).map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone || '',
      type: 'danger',
      msg: t.admin.alerts_msg_danger,
      val: 0
    }))
  ];

  const sendWhatsApp = (name: string, phone: string, type: string) => {
    const message = type === 'danger'
      ? t.admin.alerts_whatsapp_danger.replace('{name}', name)
      : t.admin.alerts_whatsapp_warning.replace('{name}', name);

    if (phone) {
      const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      showToast(t.admin.alerts_toast_whatsapp.replace('{}', name));
    } else {
      showToast(t.admin.alerts_toast_error.replace('{}', name));
    }
    setActionMenu(null);
  };

  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 h-full ${
      dm ? 'bg-white/[0.015] border-white/5' : 'bg-white border-black/[0.03] shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display text-xl font-bold text-text-main tracking-tight">{t.admin.alerts_title}</h3>
          <p className="text-[0.75rem] text-text-main/30 font-medium mt-1">{t.admin.alerts_subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-500/10 text-amber-500'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-16 opacity-50 italic">
            <p className="text-[0.9rem] font-medium">{t.admin.alerts_empty}</p>
          </div>
        ) : (
          alerts.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
                a.type === 'danger'
                  ? (dm ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100')
                  : (dm ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100')
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${
                  a.type === 'danger' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {a.val}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[1.1rem] font-bold text-text-main truncate">{a.name}</p>
                  <p className={`text-[0.75rem] font-medium mt-1 leading-relaxed ${a.type === 'danger' ? 'text-red-500/60' : 'text-amber-500/60'}`}>
                    {a.msg}
                  </p>
                </div>
                <button
                  onClick={() => setActionMenu(actionMenu === a.id ? null : a.id)}
                  className={`px-4 py-2 rounded-xl text-[0.75rem] font-bold border-none cursor-pointer transition-all ${
                    a.type === 'danger'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                  }`}
                >
                  {t.admin.alerts_btn_action}
                </button>
              </div>

              {/* Action dropdown */}
              <AnimatePresence>
                {actionMenu === a.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 pt-4 border-t flex flex-wrap gap-2 ${
                      dm ? 'border-white/[0.06]' : 'border-black/[0.06]'
                    }`}>
                      <button
                        onClick={() => sendWhatsApp(a.name, a.phone, a.type)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 text-green-500 text-[0.75rem] font-bold border-none cursor-pointer hover:bg-green-500/25 transition-all"
                      >
                        {t.admin.alerts_btn_whatsapp}
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = `/admin/clients`;
                          showToast(`${a.name} detaylarına yönlendiriliyorsunuz...`);
                          setActionMenu(null);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-bold border-none cursor-pointer transition-all ${
                          dm ? 'bg-white/10 text-white/60 hover:bg-white/15' : 'bg-black/5 text-[#1C1917]/50 hover:bg-black/10'
                        }`}
                      >
                        {t.admin.alerts_btn_profile}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
