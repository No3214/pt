import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';
import { callOpenRouter } from '../../lib/ai';
import { useTranslation } from '../../locales';

export default function WellnessTracker() {
  const { darkMode: dm, addWellnessLog, showToast } = useStore();
  const { decryptedData } = useStudentPortal();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [stats, setStats] = useState({
    rpe: 5,
    sleep: 8,
    energy: 7,
    stress: 3
  });

  const handleSubmit = async () => {
    if (!decryptedData?.client?.id) return;
    setLoading(true);

    const log = {
      date: new Date().toISOString(),
      ...stats
    };

    try {
      // AI Performance Prompt
      const prompt = `
        Sen Elite bir Atletik Performans Koçusun. Bir sporcu bugün için şu wellness verilerini girdi:
        RPE (Zorluk): ${stats.rpe}/10
        Uyku: ${stats.sleep} saat
        Enerji: ${stats.energy}/10
        Stres: ${stats.stress}/10

        Bu verilere dayanarak, sporcunun yarınki antrenman veya toparlanma süreci için 2-3 cümlelik, profesyonel, motive edici ve bilimsel bir tavsiye ver. Tavsiyen kısa, öz ve "Elite Athlete" vizyonunda olsun.
      `;

      const aiFeedback = await callOpenRouter(prompt);
      setFeedback(aiFeedback || '');

      addWellnessLog(decryptedData.client.id, { ...log, coachFeedback: aiFeedback || undefined });
      showToast('Günlük Wellness Verilerin Kaydedildi! 🧠');
    } catch (err) {
      console.error(err);
      showToast('AI yorumu alınamadı, ama verilerin kaydedildi.');
      addWellnessLog(decryptedData.client.id, log);
    } finally {
      setLoading(false);
    }
  };

  const sliders = [
    { key: 'rpe', label: 'RPE (Antrenman Zorluğu)', min: 1, max: 10, icon: '🔥' },
    { key: 'sleep', label: 'Uyku Süresi (Saat)', min: 1, max: 12, icon: '😴' },
    { key: 'energy', label: 'Enerji Seviyesi', min: 1, max: 10, icon: '⚡' },
    { key: 'stress', label: 'Stres Seviyesi', min: 1, max: 10, icon: '🧠' },
  ];

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden h-full ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">{t.portal.wellness_title}</h3>
          <p className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] mt-1 ${dm ? 'text-primary/60' : 'text-primary/40'}`}>
            {t.portal.wellness_desc}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <span className="text-xl">🦾</span>
        </div>
      </div>

      <div className="space-y-6">
        {sliders.map((s) => (
          <div key={s.key} className="space-y-2">
            <div className="flex justify-between items-center text-[0.75rem] font-bold uppercase tracking-wider opacity-60">
              <div className="flex items-center gap-2">
                 <span>{s.icon}</span>
                 <span>{s.label}</span>
              </div>
              <span className="text-primary">{(stats as any)[s.key]}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={(stats as any)[s.key]}
              onChange={(e) => setStats((prev: any) => ({ ...prev, [s.key]: parseInt(e.target.value) }))}
              className={`w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary ${dm ? 'bg-white/10' : 'bg-black/5'}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-10 py-4 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-[0.8rem] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>{t.portal.wellness_btn}</span>
            <span>🧠</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-8 p-6 rounded-3xl border ${dm ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/10'}`}
          >
            <div className="flex items-center gap-3 mb-3">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">🤖</div>
               <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">{t.portal.wellness_coach_wis}</span>
            </div>
            <p className="text-[0.85rem] font-medium leading-relaxed italic text-text-main">
              "{feedback}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
