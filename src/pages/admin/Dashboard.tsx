import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';

// Modular Admin Components
import KPICards from '../../components/admin/KPICards';
import RevenueChart from '../../components/admin/RevenueChart';
import MacroDistribution from '../../components/admin/MacroDistribution';
import ClientAlerts from '../../components/admin/ClientAlerts';
import WellnessFeed from '../../components/admin/WellnessFeed';
import StudentManager from '../../components/admin/StudentManager';
import PaymentTracker from '../../components/admin/PaymentTracker';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { t, language } = useTranslation();
  const { darkMode: dm } = useStore();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-10"
    >
      {/* Admin Header */}
      <motion.section variants={fadeUp} className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <p className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.3em] mb-3">
            {t.admin.dashboard_title}
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tighter leading-none text-text-main">
            {t.admin.business_summary}.
          </h1>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl border text-[0.8rem] font-bold uppercase tracking-widest ${
          dm ? 'bg-white/5 border-white/10 text-white/40' : 'bg-white border-black/5 text-text-main/40 shadow-sm'
        }`}>
          {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </motion.section>

      {/* KPI Stat Cards */}
      <KPICards />

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <motion.div variants={fadeUp}>
          <RevenueChart />
        </motion.div>
        <motion.div variants={fadeUp}>
          <MacroDistribution />
        </motion.div>
      </div>

      {/* NEW: Payment Tracker & Student Manager */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={fadeUp}>
          <PaymentTracker />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StudentManager />
        </motion.div>
      </div>

      {/* Alerts & Wellness Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={fadeUp}>
          <ClientAlerts />
        </motion.div>
        <motion.div variants={fadeUp}>
          <WellnessFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}
