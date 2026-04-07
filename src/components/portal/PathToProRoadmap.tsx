import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';
import { motion } from 'framer-motion';
import { useTranslation } from '../../locales';


export default function PathToProRoadmap() {
  const { darkMode: dm } = useStore();
  const { decryptedData } = useStudentPortal();
  const { t } = useTranslation();

  const labels = t.portal.roadmap_milestones || ['Rookie', 'Bölgesel Lig', '2. Lig', 'Sultanlar Ligi', 'Elite Pro'];
  const icons = ['🐣', '🏐', '🥈', '👑', '💎'];
  const milestones = labels.map((label, i) => ({
    id: i + 1,
    label,
    status: i === 0 ? 'completed' : 'locked', // Logic will be handled by currentLevel
    icon: icons[i],
    level: i
  }));
  
  const currentLevel = decryptedData?.client?.athleteLevel === 'Elite' ? 4 : 
                        decryptedData?.client?.athleteLevel === 'Pro' ? 2 : 1;

  const card = `p-10 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden h-full ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.03] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">{t.portal.roadmap_title}</h3>
          <p className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] mt-1 ${dm ? 'text-primary/60' : 'text-primary/40'}`}>
            {t.portal.roadmap_desc}
          </p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
          dm ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-primary/10 text-primary border border-primary/20'
        }`}>
          {t.portal.roadmap_rank.replace('{}', decryptedData?.client?.athleteLevel || 'Rookie')}
        </div>
      </div>

      <div className="relative pt-10 pb-4">
        {/* Progress Line */}
        <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 rounded-full ${dm ? 'bg-white/5' : 'bg-black/5'}`} />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentLevel / 4) * 100}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(122,158,130,0.5)]" 
        />

        {/* Milestones */}
        <div className="flex justify-between relative z-10">
          {milestones.map((m) => {
            const isActive = m.level === currentLevel;
            const isCompleted = m.level < currentLevel;
            
            return (
              <div key={m.id} className="flex flex-col items-center group">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                    isActive ? (dm ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(122,158,130,0.4)]' : 'bg-primary border-primary text-white shadow-xl shadow-primary/20') :
                    isCompleted ? (dm ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-primary/30 text-primary shadow-sm') :
                    (dm ? 'bg-white/5 border-white/5 text-white/20' : 'bg-white border-black/5 text-black/20 opacity-50')
                  }`}
                >
                  <span className={`text-xl transition-all ${!isActive && !isCompleted ? 'grayscale' : ''}`}>
                    {m.icon}
                  </span>
                </motion.div>
                <div className={`mt-4 text-center transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
                   <p className="text-[0.65rem] font-black uppercase tracking-widest text-text-main whitespace-nowrap">{m.label}</p>
                   {isActive && (
                      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[0.55rem] font-bold text-primary mt-1">
                         {t.portal.roadmap_current}
                      </motion.div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6 group cursor-pointer hover:bg-primary/10 transition-colors">
         <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎓</div>
         <div className="flex-1">
            <h4 className="text-[0.8rem] font-black uppercase tracking-wider text-text-main mb-1">{t.portal.roadmap_coach_msg_title}</h4>
            <p className="text-[0.85rem] font-medium opacity-60 leading-relaxed italic">
               "{t.portal.roadmap_coach_msg_text}"
            </p>
         </div>
      </div>
    </div>
  );
}
