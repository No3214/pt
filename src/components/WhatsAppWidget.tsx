import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const PHONE = '905XXXXXXXXX' // Ela'nın numarası
const GREETING = 'Merhaba Ela! Antrenman hakkında bilgi almak istiyorum 🏐'

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(true)
  const location = useLocation()

  // Don't show on admin pages
  const isAdmin = location.pathname.startsWith('/admin')
  const isPortal = location.pathname.startsWith('/portal')

  useEffect(() => {
    // Show after 2s delay for better UX
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Stop pulse after 10s
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (isAdmin || isPortal || !visible) return null

  const quickMessages = [
    { text: 'Antrenman programı hakkında bilgi almak istiyorum', icon: '💪' },
    { text: 'Online PT hizmeti hakkında bilgi almak istiyorum', icon: '📱' },
    { text: 'Fiyat bilgisi alabilir miyim?', icon: '💰' },
  ]

  const sendMessage = (msg: string) => {
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
    setOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998]"
          />
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-[999] w-[340px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/20"
          >
            {/* Header */}
            <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-display font-bold">E</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">Ela Ebeoğlu</div>
                <div className="text-white/60 text-xs">Genellikle birkaç dakika içinde yanıt verir</div>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer text-lg transition-colors">
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="bg-[#ECE5DD] p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h200v200H0z\' fill=\'%23ECE5DD\'/%3E%3Cpath d=\'M20 20h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zM20 60h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zM20 100h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4zm40 0h4v4h-4z\' fill=\'%23d5cec6\' opacity=\'.15\'/%3E%3C/svg%3E")' }}>
              {/* Ela's greeting bubble */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-[85%]"
              >
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <p className="text-[0.8rem] text-stone-800 leading-relaxed">
                    Merhaba! 👋 Ben Ela. Antrenman programları, beslenme danışmanlığı veya online PT hizmeti hakkında bilgi almak için bana yazabilirsin 🏐
                  </p>
                  <span className="text-[0.6rem] text-stone-400 mt-1 block text-right">şimdi</span>
                </div>
              </motion.div>

              {/* Quick reply buttons */}
              <div className="space-y-1.5 mt-3">
                {quickMessages.map((m, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(m.text)}
                    className="w-full text-left px-4 py-2.5 bg-white rounded-xl text-[0.8rem] text-stone-700 border border-[#25D366]/20 cursor-pointer hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all flex items-center gap-2"
                  >
                    <span>{m.icon}</span>
                    <span>{m.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom message input */}
            <div className="bg-[#F0F0F0] px-3 py-2.5 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm border-none outline-none text-stone-700 placeholder:text-stone-400"
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    sendMessage((e.target as HTMLInputElement).value.trim())
                  }
                }}
              />
              <button
                onClick={() => sendMessage(GREETING)}
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center border-none cursor-pointer hover:bg-[#20BD5A] transition-colors shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center border-none cursor-pointer shadow-lg shadow-[#25D366]/30 group"
      >
        {/* Pulse ring */}
        {pulse && !open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-xl">
              ✕
            </motion.span>
          ) : (
            <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.638-1.467A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.175 0-4.19-.6-5.925-1.638l-.425-.25-2.75.87.888-2.675-.275-.438A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip on first render */}
      <AnimatePresence>
        {!open && pulse && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-[5.5rem] z-[999] bg-white rounded-xl px-4 py-2.5 shadow-lg shadow-black/10 text-sm text-stone-700 font-medium whitespace-nowrap"
          >
            Bize yazın! 👋
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
