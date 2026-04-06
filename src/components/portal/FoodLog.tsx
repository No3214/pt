import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { turkishFoods, sanitize, type FoodItem } from '../../lib/constants';
import { useStore } from '../../stores/useStore';

export default function FoodLog() {
  const { darkMode: dm, foodLog, setFoodLog } = useStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => 
    search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : [],
    [search]
  );

  const addFood = (f: FoodItem) => { 
    setFoodLog([...foodLog, f]); 
    setSearch(''); 
  };

  const removeFood = (i: number) => setFoodLog(foodLog.filter((_, idx) => idx !== i));

  const inp = `w-full p-4 rounded-2xl border outline-none transition-all duration-300 text-[0.9rem] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 ${
    dm ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/20' : 'bg-black/[0.02] border-black/5 text-text-main placeholder:text-black/20'
  }`;

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 h-full ${
    dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">Yemek Günlüğü</h3>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-secondary/20' : 'bg-secondary/10'}`}>
          <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5l1.5 1.5m-1.5-1.5l-1.5 1.5m1.5 8.25v-1.5m0 1.5l1.5-1.5m-1.5 1.5l-1.5-1.5m9-9h-1.5m1.5 0l-1.5-1.5m1.5 1.5l-1.5 1.5m-15 0h1.5m-1.5 0l1.5-1.5m-1.5 1.5l1.5 1.5" />
          </svg>
        </div>
      </div>

      <div className="mb-6 max-h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {foodLog.length === 0 ? (
          <div className="py-12 text-center opacity-30">
            <p className="text-[0.9rem] font-medium italic">Henüz bir şey eklemedin...</p>
          </div>
        ) : (
          <AnimatePresence>
            {foodLog.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${
                  dm ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]' : 'bg-black/[0.01] border-black/5 hover:bg-black/[0.02]'
                }`}
              >
                <div>
                  <div className="text-[0.95rem] font-bold text-text-main">{f.name}</div>
                  <div className="text-[0.75rem] text-text-main/40 uppercase tracking-widest font-bold">P: {f.p}g | F: {f.f}g | C: {f.c}g</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[1.1rem] font-bold text-primary tabular-nums">{f.cal} <span className="text-[0.7rem] opacity-40">kcal</span></span>
                  <button
                    onClick={() => removeFood(i)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all border-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(sanitize(e.target.value))}
          placeholder="Yemek aramaya başlayın..."
          className={inp}
        />
        {search.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl border z-50 shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto ${
              dm ? 'bg-bg/95 border-white/10 backdrop-blur-xl' : 'bg-white border-black/10'
            }`}
          >
            {filtered.length > 0 ? filtered.map((f, i) => (
              <button
                key={i}
                onClick={() => addFood(f)}
                className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-colors ${
                  dm ? 'hover:bg-white/5 text-white/80' : 'hover:bg-black/5 text-text-main/80'
                }`}
              >
                <span className="font-bold">{f.name}</span>
                <span className="text-primary font-bold">{f.cal} kcal</span>
              </button>
            )) : (
              <div className="p-4 text-center text-text-main/40 italic">Sonuç bulunamadı...</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
