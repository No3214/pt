import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

export default function ClientAlerts() {
  const { clients, darkMode: dm, showToast } = useStore();
  
  const alerts = [
    ...clients.filter(c => c.sessions > 0 && c.sessions <= 2).map(c => ({
      id: c.id,
      name: c.name,
      type: 'warning',
      msg: 'Seans azalıyor — Paket yenileme hatırlat.',
      val: c.sessions
    })),
    ...clients.filter(c => c.sessions === 0).map(c => ({
      id: c.id,
      name: c.name,
      type: 'danger',
      msg: 'Seansı bitti — Yeni paket teklifi gönder.',
      val: 0
    }))
  ];

  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 h-full ${
      dm ? 'bg-white/[0.015] border-white/5' : 'bg-white border-black/[0.03] shadow-xl'
    }`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display text-xl font-bold text-text-main tracking-tight">Eylem Gerekli</h3>
          <p className="text-[0.75rem] text-text-main/30 font-medium mt-1">Acil Müdahale Gerektiren Durumlar</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-500/10 text-amber-500'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-16 opacity-20 italic">
            <p className="text-[0.9rem] font-medium">Her şey yolunda, tüm sporcular aktif!</p>
          </div>
        ) : (
          alerts.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 5 }}
              onClick={() => showToast(`${a.name} için işlem başlatıldı.`)}
              className={`flex items-center gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                a.type === 'danger'
                  ? (dm ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 border-red-100 hover:bg-red-100/50')
                  : (dm ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' : 'bg-amber-50 border-amber-100 hover:bg-amber-100/50')
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${
                a.type === 'danger' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {a.val}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[1.1rem] font-bold text-text-main truncate group-hover:text-primary transition-colors">{a.name}</p>
                <p className={`text-[0.75rem] font-medium mt-1 leading-relaxed ${a.type === 'danger' ? 'text-red-500/60' : 'text-amber-500/60'}`}>
                  {a.msg}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-text-main/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
