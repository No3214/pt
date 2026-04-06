import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore';

// Modular Portal Components
import PortalHeader from '../components/portal/PortalHeader';
import HabitCheckIn from '../components/portal/HabitCheckIn';
import FoodLog from '../components/portal/FoodLog';
import MacroTracker from '../components/portal/MacroTracker';
import WorkoutLogger from '../components/portal/WorkoutLogger';
import ProgressGallery from '../components/portal/ProgressGallery';
import GamifiedExport from '../components/portal/GamifiedExport';
import { GrainOverlay } from '../components/landing/LandingUI';
import AchievementTracker from '../components/portal/AchievementTracker';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

import PortalLogin from './portal/PortalLogin';
import { useStudentPortal } from '../stores/studentPortal';

export default function Portal() {
  const { darkMode: dm } = useStore();
  const { decryptedData } = useStudentPortal();

  // If no decrypted data, show Login / PIN entry
  if (!decryptedData) {
    return <PortalLogin />;
  }

  // Use decryptedData to override or populate the view
  // Note: For now we'll show the UI. We'll need to pass decryptedData to sub-components.

  return (
    <div className={`min-h-screen font-body overflow-x-hidden ${dm ? 'dark bg-bg text-white' : 'bg-bg-alt text-text-main'}`}>
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

          {/* Grid Layout for Widgets */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Gamified Export at Top */}
            <motion.div variants={fadeUp} className="lg:col-span-12 mb-4">
              <GamifiedExport />
            </motion.div>

            {/* Left Column: Habits & Daily Actions */}
            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <HabitCheckIn />
            </motion.div>

            {/* Middle Column: Macro Tracking */}
            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <MacroTracker />
            </motion.div>

            {/* Right Column: Nutrition Log */}
            <motion.div variants={fadeUp} className="lg:col-span-4 h-full">
              <FoodLog />
            </motion.div>

            {/* Achievement Tracker & Personal Note Section */}
            <motion.div variants={fadeUp} className="lg:col-span-12 grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-text-main/5">
              <div className="space-y-6">
                 <AchievementTracker athleteLevel={decryptedData?.client?.athleteLevel || 'Rookie'} />
              </div>
              <div className={`p-10 rounded-[2.5rem] border flex flex-col justify-center relative overflow-hidden ${
                dm ? 'bg-primary/5 border-primary/20' : 'bg-white border-black/[0.04] shadow-2xl'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="text-6xl text-primary font-display font-bold">"</span>
                </div>
                <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">Ela'dan Notun Var 💎</h4>
                <p className="font-display text-xl md:text-2xl font-bold italic tracking-tight text-text-main leading-snug">
                   {decryptedData?.client?.personalNote || "Yeni haftaya hazır mısın? Hedeflerin için bugün harika bir gün. Disiplin her şeydir!"}
                </p>
                <div className="mt-8 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">💪</div>
                   <span className="text-[0.75rem] font-bold text-text-main/40 uppercase tracking-widest">Senin Zamanın, Senin Zaferin.</span>
                </div>
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
        </motion.div>
      </main>
    </div>
  );
}
