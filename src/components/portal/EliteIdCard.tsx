import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function EliteIdCard() {
  const { darkMode: dm, showToast } = useStore();
  const { decryptedData } = useStudentPortal();
  const cardRef = useRef<HTMLDivElement>(null);

  const client = decryptedData?.client;
  const level = client?.athleteLevel || 'Rookie';
  const stats = client?.performanceStats || { strength: 60, explosiveness: 50, endurance: 55, consistency: 70, nutrition: 65 };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Elite_Athlete_ID_${client?.name || 'Athlete'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Dijital Kartın Galeriye Eklendi! 🏆');
    } catch (err) {
      console.error('Could not download image', err);
    }
  };

  const getGlow = () => {
    if (level === 'Elite') return 'from-amber-400 via-amber-600 to-amber-900 border-amber-500/50 shadow-amber-500/20 shadow-2xl';
    if (level === 'Pro') return 'from-stone-300 via-stone-400 to-stone-500 border-stone-400/50 shadow-stone-500/10 shadow-xl';
    return 'from-stone-700 via-stone-800 to-stone-900 border-white/10 shadow-black/20 shadow-lg';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className={`font-display text-2xl font-bold ${dm ? 'text-white' : 'text-text-main'}`}>Dijital Sporcu Kartın</h3>
         <button
           onClick={downloadCard}
           className="px-4 py-2 rounded-full bg-primary text-white text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
         >
           <span>Kaydet</span>
           <span>💾</span>
         </button>
      </div>

      <div className="flex items-center justify-center p-4">
        {/* The Card to Capture */}
        <div 
          ref={cardRef} 
          className={`w-[360px] h-[520px] rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center text-center border bg-gradient-to-br ${getGlow()}`}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          {/* Logo / Brand */}
          <div className="relative z-10 mb-8 mt-4">
             <div className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-white/50 mb-1">Ela Ebeoğlu</div>
             <div className="text-xl font-display font-black italic tracking-tighter text-white">ELITE ATHLETE</div>
          </div>

          {/* User Image Area (Mock) */}
          <div className="w-32 h-32 rounded-full border-4 border-white/20 p-1 mb-6 relative">
             <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-5xl overflow-hidden">
                {level === 'Elite' ? '🏐' : '⭐'}
             </div>
             {level === 'Elite' && (
               <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full text-xs shadow-lg">⚡</div>
             )}
          </div>

          {/* User Info */}
          <div className="relative z-10 mb-8">
            <h4 className="font-display text-3xl font-black text-white tracking-tight mb-1">{client?.name || 'Athlete'}</h4>
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 text-white border border-white/20`}>
               {level} LEVEL
            </div>
          </div>

          {/* Stats Radar Concept (Simplified for the Card) */}
          <div className="w-full grid grid-cols-2 gap-4 text-left relative z-10">
             {[
               { label: 'Strength', val: stats.strength },
               { label: 'Jumping', val: stats.explosiveness },
               { label: 'Engine', val: stats.endurance },
               { label: 'Discipline', val: stats.consistency },
             ].map((s, i) => (
               <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                 <div className="text-[0.55rem] font-bold uppercase tracking-widest text-white/40 mb-1">{s.label}</div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white leading-none">{s.val}</span>
                    <div className="w-full h-1 bg-white/10 rounded-full ml-3 overflow-hidden">
                       <div className="h-full bg-white/60" style={{ width: `${s.val}%` }} />
                    </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Bottom ID / Token */}
          <div className="mt-auto relative z-10 w-full flex items-center justify-between border-t border-white/10 pt-6">
             <div className="text-left">
                <div className="text-[0.5rem] font-bold text-white/30 uppercase tracking-[0.2em]">Kayıt Tarihi</div>
                <div className="text-[0.7rem] font-bold text-white/60">{client?.startDate || '2026'}</div>
             </div>
             <div className="text-right">
                <div className="text-[0.5rem] font-bold text-white/30 uppercase tracking-[0.2em]">Athlete ID</div>
                <div className="text-[0.7rem] font-bold text-white/60">EE-#{client?.id?.padStart(4, '0') || '0001'}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
