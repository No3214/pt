import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentPortal } from '../../stores/studentPortal'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../../stores/useStore'
import { GrainOverlay } from '../../components/landing/LandingUI'

export default function PortalLogin() {
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [searchParams] = useSearchParams()
  const { receiveData, unlock, error } = useStudentPortal()
  const darkMode = useStore(s => s.darkMode)

  useEffect(() => {
    const data = searchParams.get('d')
    if (data) {
      receiveData(data)
    }
  }, [searchParams, receiveData])

  const handleInput = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return
    const newPin = [...pin]
    newPin[idx] = val.slice(-1)
    setPin(newPin)

    // Auto-focus next
    if (val && idx < 5) {
      const next = document.getElementById(`pin-${idx + 1}`)
      next?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      const prev = document.getElementById(`pin-${idx - 1}`)
      prev?.focus()
    }
  }

  const handleSubmit = useCallback(async (finalPin: string) => {
    if (finalPin.length === 6) {
      await unlock(finalPin)
    }
  }, [unlock])

  useEffect(() => {
    const finalPin = pin.join('')
    if (pin.every(p => p !== '')) handleSubmit(finalPin)
  }, [pin, handleSubmit])

  return (
    <div className={`min-h-screen flex items-center justify-center font-body ${darkMode ? 'bg-bg text-white' : 'bg-bg-alt text-text-main'}`}>
      <GrainOverlay />
      
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md px-8 text-center">
        <div className="mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
              <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/><path d="M12 7v5l3 3"/>
            </svg>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight mb-3">Şampiyon Girişi.</h1>
          <p className="text-text-main/30 text-sm font-medium">Koçunuz tarafından verilen 6 haneli PIN kodunu girin.</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {pin.map((p, i) => (
            <input key={i} id={`pin-${i}`} type="password" value={p} onChange={e => handleInput(e.target.value, i)} onKeyDown={e => handleKeyDown(e, i)}
              className={`w-12 h-16 text-center text-2xl font-bold rounded-2xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/5 text-text-main shadow-sm'}`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-primary text-sm font-bold mb-6">
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-text-main/20 mt-10">
          Local-First & Encrypted Access <br /> © 2026 Ela Ebeoğlu PT
        </p>
      </motion.div>
    </div>
  )
}
