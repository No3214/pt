import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { useTranslation } from '../locales'
import LegalModal from './LegalModals'

function Toggle({ on, onChange, locked, dm, ariaLabel }: { on: boolean; onChange: () => void; locked?: boolean; dm: boolean; ariaLabel: string }) {
  return (
    <button
      onClick={locked ? undefined : onChange}
      className={`relative w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors duration-300 flex-shrink-0 ${
        locked ? 'opacity-60 cursor-not-allowed' : ''
      } ${on
        ? 'bg-primary'
        : dm ? 'bg-white/10' : 'bg-black/10'
      }`}
      aria-label={ariaLabel}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full shadow-sm ${
          on ? 'left-[20px] bg-white' : 'left-[2px]'
        } ${!on ? (dm ? 'bg-white/40' : 'bg-white') : ''}`}
      />
    </button>
  )
}

export default function CookieConsent() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState({ necessary: true, analytics: true, marketing: false })
  const [showKvkk, setShowKvkk] = useState(false)
  const dm = useStore(s => s.darkMode)

  const categories = [
    { key: 'necessary', label: t.portal.admin.cookie_required, desc: t.portal.admin.cookie_required_desc, locked: true },
    { key: 'analytics', label: t.portal.admin.cookie_analytics, desc: t.portal.admin.cookie_analytics_desc, locked: false },
    { key: 'marketing', label: t.portal.admin.cookie_marketing, desc: t.portal.admin.cookie_marketing_desc, locked: false },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('ela-cookie-ok')) setShow(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const accept = (all?: boolean) => {
    if (all) setPrefs({ necessary: true, analytics: true, marketing: true })
    localStorage.setItem('ela-cookie-ok', '1')
    localStorage.setItem('ela-cookie-prefs', JSON.stringify(all ? { necessary: true, analytics: true, marketing: true } : prefs))
    setShow(false)
  }

  const togglePref = (key: string) => {
    setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))
  }

  return (
    <>
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-[440px] z-[300] rounded-2xl border backdrop-blur-2xl shadow-float overflow-hidden ${
            dm
              ? 'bg-[#111]/95 border-white/[0.06] text-white'
              : 'bg-white/95 border-black/[0.06] text-[#1C1917]'
          }`}
        >
          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-start gap-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-display text-[1rem] font-semibold mb-1">{t.portal.admin.cookie_title}</h4>
                <p className={`text-[0.78rem] leading-[1.7] ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>
                  {t.portal.admin.cookie_text}{' '}
                  <button
                    onClick={() => setShowKvkk(true)}
                    className={`bg-transparent border-none cursor-pointer underline p-0 text-[0.78rem] transition-colors ${dm ? 'text-white/60 hover:text-white/80' : 'text-[#1C1917]/60 hover:text-[#1C1917]/80'}`}
                  >
                    {t.portal.admin.cookie_kvkk_link}
                  </button>{' '}
                  verileriniz korunmaktadır.
                </p>
              </div>
            </div>
          </div>

          {/* Expandable categories */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className={`mx-6 mt-4 rounded-xl border divide-y ${
                  dm ? 'border-white/[0.06] divide-white/[0.06]' : 'border-black/[0.06] divide-black/[0.06]'
                }`}>
                  {categories.map(cat => (
                    <div key={cat.key} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-[0.82rem] font-medium">{cat.label}</div>
                        <div className={`text-[0.7rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/35'}`}>{cat.desc}</div>
                      </div>
                      <Toggle
                        on={prefs[cat.key as keyof typeof prefs]}
                        onChange={() => togglePref(cat.key)}
                        locked={cat.locked}
                        dm={dm}
                        ariaLabel={cat.locked ? t.portal.admin.cookie_required_aria : prefs[cat.key as keyof typeof prefs] ? t.portal.admin.cookie_on : t.portal.admin.cookie_off}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="p-6 pt-4 flex items-center gap-3">
            <button onClick={() => accept(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-full text-[0.78rem] font-medium border-none cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_rgba(194,104,74,0.25)]">
              {t.portal.admin.cookie_accept_all}
            </button>
            {expanded ? (
              <button onClick={() => accept()}
                className="px-5 py-2.5 bg-secondary/20 text-secondary rounded-full text-[0.78rem] font-medium border-none cursor-pointer transition-all duration-300 hover:bg-secondary/30">
                {t.portal.admin.cookie_save}
              </button>
            ) : (
              <button onClick={() => setExpanded(true)}
                className={`px-5 py-2.5 rounded-full text-[0.78rem] font-medium border cursor-pointer bg-transparent transition-all duration-300 ${
                  dm ? 'border-white/10 text-white/50 hover:text-white/70' : 'border-black/10 text-[#1C1917]/40 hover:text-[#1C1917]/60'
                }`}>
                {t.portal.admin.cookie_customize}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <LegalModal
      isOpen={showKvkk}
      onClose={() => setShowKvkk(false)}
      type="kvkk"
    />
    </>
  )
}
