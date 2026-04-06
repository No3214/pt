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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

export default function Portal() {
  const { darkMode: dm } = useStore();

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
