import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/useStore';

import PortalHeader from '../components/portal/PortalHeader';
import { tenantConfig } from '../config/tenant';
import HabitCheckIn from '../components/portal/HabitCheckIn';
import FoodLog from '../components/portal/FoodLog';
import MacroTracker from '../components/portal/MacroTracker';
import WorkoutLogger from '../components/portal/WorkoutLogger';
import ProgressGallery from '../components/portal/ProgressGallery';
import GamifiedExport from '../components/portal/GamifiedExport';
import { GrainOverlay } from '../components/landing/LandingUI';
import AchievementTracker from '../components/portal/AchievementTracker';
import StudentWeightChart from '../components/portal/StudentWeightChart';
import AiMacroAssistant from '../components/portal/AiMacroAssistant';
import PerformanceRadar from '../components/portal/PerformanceRadar';
import CoachVault from '../components/portal/CoachVault';
import WellnessTracker from '../components/portal/WellnessTracker';
import PathToProRoadmap from '../components/portal/PathToProRoadmap';
import LevelAtmosphere from '../components/portal/LevelAtmosphere';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

import PortalLogin from './portal/PortalLogin';
import { useStudentPortal } from '../stores/studentPortal';
import EliteIdCard from '../components/portal/EliteIdCard';
import { useState, useEffect } from 'react';

export default function Portal() {
  const { darkMode: dm } = useStore();
  const { decryptedData } = useStudentPortal();
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  useEffect(() => {
    (window as any).dispatchPortalEvent = (event: string) => {
      if (event === 'open-id-card') setIsIdCardOpen(true);
    };
    return () => { (window as any).dispatchPortalEvent = undefined; };
  }, []);

  // If no decrypted data, show Login / PIN entry
  if (!decryptedData) {
    return <PortalLogin />;
  }

  // Use decryptedData to override or populate the view
  // Note: For now we'll show the UI. We'll need to pass decryptedData to sub-components.

  return (
    <div className={`min-h-screen font-body overflow-x-hidden relative ${dm ? 'dark bg-bg text-white' : 'bg-bg-alt text-text-main'}`}>
      <LevelAtmosphere />
      <GrainOverlay />
      
      {/* Navigation & Header */}
      <PortalHeader />

      <main className="max-w-[1400px] mx-auto px-8 md:px-12 pt-32 pb-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-12"
        >
          {/* Welcome Section */}
          <motion.section variants={fadeUp} className="mb-16">
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter leading-none text-text-main">
              Şampiyonun <br /> Dashboard'u.
            </h1>
            <p className="mt-8 text-[1.1rem] font-medium text-text-main/30 max-w-[500px] leading-relaxed">
              Disiplin, motivasyonun bittiği yerde başlar. Bugünün seçimleri, yarının zaferini belirler.
            </p>
          </motion.section>

          {/* Pathway to Pro Roadmap */}
          <motion.section variants={fadeUp}>
             <PathToProRoadmap />
          </motion.section>

          {/* Grid Layout for Widgets */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Gamified Export at Top */}
            <motion.div variants={fadeUp} className="lg:col-span-12 mb-4">
              <GamifiedExport />
            </motion.div>

            {/* Row 1: Daily Habits & Goals */}
            <motion.div variants={fadeUp} className="lg:col-span-12 grid md:grid-cols-2 gap-8">
               <HabitCheckIn />
               <div className={`p-10 rounded-[2.5rem] border flex flex-col justify-center relative overflow-hidden ${
                dm ? 'bg-primary/5 border-primary/20' : 'bg-white border-black/[0.04] shadow-2xl'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="text-6xl text-primary font-display font-bold">"</span>
                </div>
                <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">Ela'an Notun Var 💎</h4>
                <p className="font-display text-xl md:text-2xl font-bold italic tracking-tight text-text-main leading-snug">
                   {decryptedData?.client?.personalNote || "Yeni haftaya hazır mısın? Hedeflerin için bugün harika bir gün. Disiplin her şeydir!"}
                </p>
                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://wa.me/${tenantConfig.brand.contact.socials.whatsapp.replace('+', '')}?text=Selam Ela! Gelişim portalından yazıyorum...`, '_blank')}
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 w-fit"
                  >
                    <span>Ela'ya Mesaj At</span>
                    <span className="text-base">💬</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Row 2: Nutrition Mastery */}
            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <MacroTracker />
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <AiMacroAssistant />
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <FoodLog />
            </motion.div>

            {/* Row 3: Performance & Wellness Mastery */}
            <motion.div variants={fadeUp} className="lg:col-span-12 grid md:grid-cols-3 gap-8">
               <WellnessTracker />
               <PerformanceRadar />
               <CoachVault />
            </motion.div>

            {/* Row 4: Advancement & Achievements */}
            <motion.div variants={fadeUp} className="lg:col-span-12 grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-text-main/5">
              <div className="md:col-span-1 border-r border-text-main/5 pr-8 hidden md:block">
                 <StudentWeightChart />
              </div>
              <div className="space-y-6 md:col-span-1">
                 <AchievementTracker athleteLevel={decryptedData?.client?.athleteLevel || 'Rookie'} />
              </div>
            </motion.div>
            
            {/* Full Width Bottom Row: Workout Tracker */}
            <motion.div variants={fadeUp} className="lg:col-span-12">
               <WorkoutLogger />
            </motion.div>
            
            {/* Full Width Bottom Row 2: Progress Gallery */}
            <motion.div variants={fadeUp} className="lg:col-span-12">
               <ProgressGallery />
            </motion.div>
          </div>

          {/* Motivation Quote Banner */}
          <motion.div
            variants={fadeUp}
            className={`p-10 rounded-[2.5rem] border text-center relative overflow-hidden ${
              dm ? 'bg-primary/5 border-primary/20' : 'bg-white border-black/[0.04] shadow-2xl'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,var(--color-primary),transparent)]" />
            <p className="font-display text-2xl md:text-3xl font-bold italic tracking-tight text-text-main">
              "En zor antrenman, ilk adımı atandır. Sen o adımı çoktan attın."
            </p>
          </motion.div>
          
          <div className={`mt-8 pt-8 border-t text-center ${dm ? 'border-text-main/10' : 'border-text-main/5'}`}>
            <p className={`text-[0.65rem] uppercase tracking-widest font-bold opacity-30 ${dm ? 'text-white' : 'text-text-main'} mb-2`}>Yasal & Tıbbi Uyarı</p>
            <p className={`text-[0.65rem] leading-relaxed max-w-4xl mx-auto ${dm ? 'text-white/40' : 'text-text-main/40'}`}>
              Bu portalda sunulan beslenme makroları, antrenman programları ve asistan tavsiyeleri tamamen sportif performansı artırma amaçlıdır ve hiçbir koşulda tıbbi bir teşhis, tedavi veya reçete niteliği taşımaz. Mevcut bir sağlık probleminiz, kronik hastalığınız, devam eden fizik tedaviniz veya alerjik reaksiyonlarınız varsa programı uygulamadan önce mutlaka uzman bir hekime danışınız. Yaşanabilecek medikal/fiziksel komplikasyonlardan danışanın kendisi sorumludur.
            </p>
          </div>
        </motion.div>
      </main>

      {/* ID Card Modal */}
      <AnimatePresence>
        {isIdCardOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIdCardOpen(false)}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-max max-w-[95vw]"
            >
               <button
                 onClick={() => setIsIdCardOpen(false)}
                 className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-none bg-transparent cursor-pointer"
               >
                 <span>Kapat</span>
                 <span className="text-xl">✕</span>
               </button>
               
               <EliteIdCard />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
