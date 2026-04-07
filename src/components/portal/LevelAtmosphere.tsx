import { motion } from 'framer-motion';
import { useStudentPortal } from '../../stores/studentPortal';

export default function LevelAtmosphere() {
  const { decryptedData } = useStudentPortal();
  const level = decryptedData?.client?.athleteLevel || 'Rookie';

  const configs = {
    Elite: {
      colors: ['rgba(251, 191, 36, 0.15)', 'rgba(217, 119, 6, 0.2)', 'rgba(78, 52, 46, 0.3)'],
      glow: 'shadow-[0_0_100px_rgba(251,191,36,0.3)]'
    },
    Pro: {
      colors: ['rgba(148, 163, 184, 0.15)', 'rgba(71, 85, 105, 0.2)', 'rgba(30, 41, 59, 0.3)'],
      glow: 'shadow-[0_0_100px_rgba(148,163,184,0.3)]'
    },
    Rookie: {
      colors: ['rgba(122, 158, 130, 0.1)', 'rgba(100, 116, 139, 0.15)', 'rgba(71, 85, 105, 0.2)'],
      glow: 'shadow-[0_0_100px_rgba(122,158,130,0.1)]'
    }
  };

  const config = configs[level as keyof typeof configs] || configs.Rookie;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Glow 1 */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px]"
        style={{ backgroundColor: config.colors[0] }}
      />

      {/* Animated Glow 2 */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px]"
        style={{ backgroundColor: config.colors[1] }}
      />

      {/* Center Aura */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px rounded-full ${config.glow}`}
      />
      
      {/* Subtle Fog Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
    </div>
  );
}
