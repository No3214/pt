import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function NotFound() {
  const dm = useStore(s => s.darkMode)

  return (
    <div className={`min-h-screen flex items-center justify-center font-body px-6 ${
      dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
          className={`text-[8rem] font-display font-bold leading-none tracking-tight ${
            dm ? 'text-white/[0.04]' : 'text-[#1C1917]/[0.04]'
          }`}
        >
          404
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`font-display text-3xl font-semibold -mt-8 mb-4 ${
            dm ? 'text-white' : 'text-[#1C1917]'
          }`}
        >
          Sayfa bulunamadı
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-[0.95rem] leading-relaxed mb-10 ${
            dm ? 'text-white/35' : 'text-[#1C1917]/40'
          }`}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full text-[0.88rem] font-medium no-underline transition-all duration-300 hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
