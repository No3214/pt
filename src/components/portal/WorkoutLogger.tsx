import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import VideoModal from './VideoModal';

export default function WorkoutLogger() {
  const { savedPrograms, darkMode: dm, showToast } = useStore();
  const activeProgram = savedPrograms.length > 0 ? savedPrograms[savedPrograms.length - 1] : null;

  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [video, setVideo] = useState<{ id: string; title: string } | null>(null);

  const card = `p-8 rounded-3xl border transition-all duration-500 overflow-hidden relative ${
    dm ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white border-black/[0.04] shadow-xl shadow-black/[0.02]'
  }`;

  const toggleSet = (exIndex: number, setIndex: number) => {
    const key = `${exIndex}-${setIndex}`;
    setCompletedSets((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }));
  };

  const finishWorkout = () => {
    showToast('Antrenman başarıyla kaydedildi! 🔥');
    setCompletedSets({});
  };

  if (!activeProgram) {
    return (
      <div className={card}>
        <div className="text-center py-10">
          <span className="text-4xl mb-4 block">🏋️‍♂️</span>
          <h3 className="font-display text-xl font-bold mb-2">Aktif Antrenman Bulunamadı</h3>
          <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-500'}`}>Koçunuz henüz size bir program atamadı.</p>
        </div>
      </div>
    );
  }

  const totalSets = activeProgram.exercises.reduce((acc, ex) => acc + parseInt(ex.sets || '0'), 0);
  const doneSets = Object.values(completedSets).filter(Boolean).length;
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  return (
    <>
      <div className={card}>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-3xl font-bold">{activeProgram.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                Aktif Program
              </span>
            </div>
            <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-500'}`}>
              {activeProgram.exercises.length} Hareket · Toplam {totalSets} Set
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-bold">{Math.round(progress)}%</div>
              <div className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>Tamamlandı</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={finishWorkout}
              disabled={doneSets === 0}
              className="px-6 py-3 rounded-full text-sm font-bold bg-primary text-white border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              Antrenmanı Bitir
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full mb-10 overflow-hidden ${dm ? 'bg-white/10' : 'bg-stone-100'}`}>
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Exercises List */}
        <div className="space-y-6">
          {activeProgram.exercises.map((ex, exIndex) => {
            const setsCount = parseInt(ex.sets || '0');
            const isDone = Array.from({ length: setsCount }).every((_, i) => completedSets[`${exIndex}-${i}`]);

            return (
              <div key={exIndex} className={`p-5 rounded-2xl border transition-colors ${dm ? 'border-white/5 bg-white/[0.01]' : 'border-black/[0.03] bg-stone-50/50'} ${isDone ? (dm ? '!border-primary/30 !bg-primary/5' : '!border-primary/20 !bg-primary/5') : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${dm ? 'bg-white/10' : 'bg-white shadow-sm'}`}>{exIndex + 1}</span>
                      {ex.name}
                      {ex.youtubeId && (
                        <button
                          onClick={() => setVideo({ id: ex.youtubeId!, title: ex.name })}
                          className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer border-none flex items-center justify-center"
                          title="Videoyu İzle"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      )}
                    </h3>
                    {ex.note && <p className={`text-xs mt-1 max-w-sm ${dm ? 'text-white/40' : 'text-stone-500'}`}>Not: {ex.note}</p>}
                  </div>
                  <div className={`text-sm font-medium ${dm ? 'text-white/30' : 'text-stone-400'}`}>Hedef: {ex.reps} Tekrar</div>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: setsCount }).map((_, setIndex) => {
                    const key = `${exIndex}-${setIndex}`;
                    const checked = !!completedSets[key];

                    return (
                      <div key={setIndex} className={`flex items-center justify-between p-3 rounded-xl transition-all ${checked ? (dm ? 'bg-primary/20' : 'bg-white shadow-sm border border-primary/20') : (dm ? 'bg-white/[0.04]' : 'bg-white border border-stone-100')}`}>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleSet(exIndex, setIndex)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${checked ? 'bg-primary border-primary text-white' : (dm ? 'border-white/20 bg-transparent' : 'border-stone-300 bg-transparent')}`}
                          >
                            {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                          </button>
                          <span className={`text-sm font-semibold ${checked ? (dm ? 'text-white' : 'text-stone-800') : (dm ? 'text-white/50' : 'text-stone-400')}`}>
                            {ex.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {video && <VideoModal isOpen={!!video} youtubeId={video.id} title={video.title} onClose={() => setVideo(null)} />}
    </>
  );
}
