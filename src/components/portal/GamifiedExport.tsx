import { useRef, useState } from 'react';

import { useStore } from '../../stores/useStore';
import * as htmlToImage from 'html-to-image';
import { tenantConfig } from '../../config/tenant';

export default function GamifiedExport() {
  const { darkMode: dm, showToast, foodLog, habits, streak } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const card = `p-8 rounded-[2.5rem] border transition-all relative overflow-hidden ${
    dm ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 'bg-gradient-to-br from-primary/5 to-white border-primary/10 shadow-lg shadow-primary/5'
  }`;

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${tenantConfig.brand.name.toLowerCase()}-haftalik-ozet.png`;
      link.href = dataUrl;
      link.click();
      showToast('Kazanımların Instagram için indirildi! 🎉');
    } catch (err) {
      console.error(err);
      showToast('İndirme başarısız oldu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Gerçek Store (CRM) metrikleri gamification kartına bağlanıyor
  
  // Fake veriden kurtuluyoruz.
  const activeDayStreak = streak > 0 ? streak : 1; 
  const caloriesTracked = foodLog.reduce((acc, f) => acc + f.cal, 0) || 0;
  const habitsDone = habits.filter(Boolean).length;

  return (
    <div className={card}>
       <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
         <div className="flex-1 space-y-4">
           <h2 className="font-display text-4xl font-bold tracking-tight">Kazanımlarını Paylaş 🏆</h2>
           <p className={`text-sm max-w-md ${dm ? 'text-white/60' : 'text-stone-600'}`}>
             Disiplinin ilham versin. Haftalık özetini tek tıkla Instagram hikayesi boyutunda şık bir görsele dönüştür ve takipçilerinle paylaş.
           </p>
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className="px-6 py-3 mt-2 rounded-full bg-primary text-white font-bold cursor-pointer hover:scale-105 transition-transform disabled:opacity-50"
           >
             {isExporting ? 'Oluşturuluyor...' : 'Görseli İndir 📸'}
           </button>
         </div>

         {/* The exportable preview card that actually gets turned into image */}
         <div className="shrink-0 w-full max-w-[320px]">
           <div
             ref={cardRef}
             className={`p-6 rounded-3xl aspect-[9/16] flex flex-col justify-between overflow-hidden relative shadow-2xl ${dm ? 'bg-bg text-white' : 'bg-stone-50 text-stone-900 border border-stone-200'}`}
             style={{
               backgroundImage: `linear-gradient(145deg, #C2684A 0%, #7A9E82 45%, #4A6D88 100%)`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
             }}
           >
             {/* animated conic brand layer (visible in UI, captured by html-to-image as final rasterized frame) */}
             <div
               aria-hidden
               className="absolute -inset-[20%] opacity-60 animate-[spin_40s_linear_infinite] pointer-events-none"
               style={{
                 background: 'conic-gradient(from 0deg at 50% 50%, #C2684A, #D4B483, #7A9E82, #4A6D88, #C2684A)',
                 filter: 'blur(40px)',
               }}
             />
             {/* grid texture */}
             <div
               aria-hidden
               className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
                 backgroundSize: '28px 28px',
               }}
             />
             {/* Gradient Overlay for text readability */}
             <div className={`absolute inset-0 ${dm ? 'bg-black/60' : 'bg-white/80'}`} />

             <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Haftalık Rapor</span>
                   <h3 className="font-display text-2xl font-bold mt-1">Sırayı Bozma!</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                   {activeDayStreak}
                 </div>
               </div>

               <div className="space-y-3">
                 <div className={`p-4 rounded-xl backdrop-blur-sm ${dm ? 'bg-white/10' : 'bg-black/5'}`}>
                   <span className="text-xs font-semibold opacity-60 block">Takip Edilen Kalori</span>
                   <span className="font-display text-2xl font-bold">{caloriesTracked} kcal</span>
                 </div>
                 
                 <div className={`p-4 rounded-xl backdrop-blur-sm ${dm ? 'bg-white/10' : 'bg-black/5'}`}>
                   <span className="text-xs font-semibold opacity-60 block">Tamamlanan Alışkanlıklar</span>
                   <span className="font-display text-xl font-bold">{habitsDone} / 4 Hedef</span>
                 </div>
               </div>
             </div>

              <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-current/10">
                <span className="font-bold text-sm tracking-wide">{tenantConfig.brand.contact.socials.instagram}</span>
                <span className="text-xs font-bold opacity-40 px-2 py-1 rounded bg-current/10">PRO</span>
              </div>
           </div>
         </div>
       </div>

       {/* Ambient decor */}
       <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
