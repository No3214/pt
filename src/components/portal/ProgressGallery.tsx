import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';

export default function ProgressGallery() {
  const { progressPhotos, addProgressPhoto, deleteProgressPhoto, darkMode: dm, showToast } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [videoLink, setVideoLink] = useState('');
  const [videos, setVideos] = useState<{ id: string; url: string; date: string; feedback?: string }[]>([
    { id: '1', url: 'https://youtube.com/shorts/sıçrama-denemesi-1', date: '12 Eki 2026', feedback: 'Dizler süper hizada, kalçayı biraz daha kullan.' }
  ]);

  const card = `p-8 rounded-3xl border transition-all duration-500 overflow-hidden relative ${
    dm ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white border-black/[0.04] shadow-xl shadow-black/[0.02]'
  }`;

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${
    dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-stone-50 border-stone-200 text-stone-700 placeholder:text-stone-400 focus:bg-white'
  }`;



  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result && typeof ev.target.result === 'string') {
        const payload = { src: ev.target.result, date: new Date().toLocaleDateString('tr-TR') };
        addProgressPhoto(payload);
        showToast('Fotoğraf başarıyla Kasaya yüklendi! 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = () => {
    if(!videoLink.trim() || !videoLink.includes('http')) {
      showToast('Lütfen geçerli bir Youtube/Vimeo linki girin.');
      return;
    }
    setVideos(prev => [{ id: Date.now().toString(), url: videoLink, date: new Date().toLocaleDateString('tr-TR') }, ...prev]);
    setVideoLink('');
    showToast('Video koç onayına gönderildi! 🎥');
  };

  return (
    <div className={card}>
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold flex items-center gap-3">
             Gelişim & Form <span className="opacity-50 text-2xl">📸</span>
          </h2>
          <p className={`text-sm mt-2 max-w-sm ${dm ? 'text-white/40' : 'text-stone-500'}`}>
            İlerlemeni takip et ve teknik analizi için form videolarını buradan Ela Hoca'ya gönder.
          </p>
        </div>
        
        <div className={`p-1.5 rounded-full flex ${dm ? 'bg-white/[0.05]' : 'bg-stone-100'}`}>
          <button
             onClick={() => setActiveTab('photos')}
             className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeTab === 'photos' ? 'bg-primary text-white shadow-md' : (dm ? 'text-white/40 hover:text-white' : 'text-stone-500 hover:text-stone-800')}`}
          >
             Öncesi / Sonrası
          </button>
          <button
             onClick={() => setActiveTab('videos')}
             className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeTab === 'videos' ? 'bg-primary text-white shadow-md' : (dm ? 'text-white/40 hover:text-white' : 'text-stone-500 hover:text-stone-800')}`}
          >
             Form Onayı
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'photos' ? (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {progressPhotos.map((p, idx) => (
                 <motion.div
                   key={idx}
                   layoutId={`photo-${idx}`}
                   className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-black/5"
                 >
                   <img src={p.src} alt="Gelişim" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-white text-xs font-semibold">{p.date}</span>
                      <button onClick={() => deleteProgressPhoto(idx)} className="text-red-400 mt-2 text-xs font-bold w-fit cursor-pointer hover:text-red-300">Sil</button>
                   </div>
                 </motion.div>
              ))}

              <div
                onClick={() => fileRef.current?.click()}
                className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group ${
                  dm ? 'border-white/10 bg-white/[0.01]' : 'border-stone-200 bg-stone-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${dm ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <span className={`text-sm font-semibold ${dm ? 'text-white/50' : 'text-stone-500'}`}>Yeni Yükle</span>
                <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleUpload} />
              </div>
            </div>
            {progressPhotos.length === 0 && (
              <p className={`text-center py-6 text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                Henüz gelişim fotoğrafı yüklemediniz. Gelişiminizi görmek için yeni bir fotoğraf ekleyin!
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Youtube/Drive/Vimeo video linkini buraya yapıştır..." 
                value={videoLink}
                onChange={e => setVideoLink(e.target.value)}
                className={inp}
              />
              <button onClick={handleAddVideo} className="px-6 py-3 rounded-xl bg-primary text-white font-bold whitespace-nowrap cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Gönder
              </button>
            </div>
            
            <div className="space-y-4">
              {videos.map(v => (
                 <div key={v.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-start gap-4 ${dm ? 'border-white/10 bg-white/[0.02]' : 'border-stone-200 bg-stone-50/50'}`}>
                   <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                   </div>
                   <div className="flex-1">
                     <p className={`text-xs font-semibold mb-1 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{v.date}</p>
                     <a href={v.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-500 hover:underline mb-3 line-clamp-1 break-all">
                       {v.url}
                     </a>
                     {v.feedback ? (
                       <div className={`p-3 rounded-lg text-sm mt-3 border-l-4 border-l-primary ${dm ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                         <span className="font-bold opacity-50 block text-xs mb-1">Koç Geri Bildirimi:</span>
                         {v.feedback}
                       </div>
                     ) : (
                       <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block mt-2 ${dm ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                         ⏱️ Onay Bekliyor
                       </div>
                     )}
                   </div>
                 </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
