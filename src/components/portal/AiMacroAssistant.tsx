import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';
import { callGemini } from '../../lib/ai';
import { useTranslation } from '../../locales';

export default function AiMacroAssistant() {
  const { t } = useTranslation();
  const { darkMode: dm, foodLog, setFoodLog, showToast } = useStore();
  const { decryptedData } = useStudentPortal();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    p: number;
    c: number;
    f: number;
    cal: number;
    coachComment: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(null);

    const clientGoal = decryptedData?.client?.goal || 'Performans';
    const clientLevel = decryptedData?.client?.athleteLevel || 'Rookie';

    const prompt = t.portal.macro_ai_prompt
      .replace('{input}', input)
      .replace('{clientGoal}', clientGoal)
      .replace('{clientLevel}', clientLevel);

    try {
      const response = await callGemini(prompt);
      if (response) {
        // Clean up the response just in case (remove markdown code blocks if present)
        const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);
        setResult(data);
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      showToast(t.portal.macro_ai_error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!result) return;
    setFoodLog([...foodLog, { 
      name: `🤖 ${result.name}`, 
      p: result.p, 
      c: result.c, 
      f: result.f, 
      cal: result.cal 
    }]);
    setResult(null);
    setInput('');
    showToast(t.portal.macro_ai_success);
  };

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl h-full' : 'bg-white border-black/[0.04] shadow-xl h-full'
  }`;

  return (
    <div className={card}>
      {/* Decorative Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[80px]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">{t.portal.macro_ai_title}</h3>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary mt-1">{t.portal.macro_ai_subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-primary/20' : 'bg-primary/10'}`}>
          <span className="text-xl">🧠</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.portal.macro_ai_placeholder}
          className={`w-full p-5 rounded-2xl border outline-none transition-all duration-300 min-h-[120px] text-[0.95rem] resize-none ${
            dm ? 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-primary/40' : 'bg-black/[0.02] border-black/5 text-text-main placeholder:text-black/20 focus:border-primary/40'
          }`}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-[0.9rem] shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 border-none cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.portal.macro_ai_btn_analyzing}</span>
            </>
          ) : (
            <>
              <span>{t.portal.macro_ai_btn_analyze}</span>
              <span className="text-lg">✨</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 rounded-3xl border ${
                dm ? 'bg-white/[0.05] border-white/10' : 'bg-primary/[0.03] border-primary/10 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg text-text-main">{result.name}</h4>
                <div className="text-primary font-bold text-xl tabular-nums">{result.cal} <span className="text-xs opacity-50 font-normal">kcal</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Prot.', val: result.p, col: 'secondary' },
                  { label: 'Karb.', val: result.c, col: 'accent' },
                  { label: 'Yağ', val: result.f, col: 'sand' }
                ].map((m, i) => (
                  <div key={i} className={`p-3 rounded-2xl text-center ${dm ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider opacity-40 mb-1">{m.label}</div>
                    <div className={`font-bold text-sm text-${m.col}`}>{m.val}g</div>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-2xl border-l-4 border-l-primary mb-6 ${dm ? 'bg-primary/10' : 'bg-white shadow-sm'}`}>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-primary opacity-60 block mb-1">{t.portal.macro_ai_feedback_label}</span>
                <p className="text-[0.85rem] font-medium leading-relaxed italic text-text-main/80">
                  "{result.coachComment}"
                </p>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer bg-transparent"
              >
                {t.portal.food_add}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
