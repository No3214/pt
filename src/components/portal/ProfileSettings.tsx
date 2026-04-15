import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'
import { fadeUp, successPop } from '../../lib/motion'

const AVATAR_OPTIONS = ['🏐', '🏋️', '💪', '🔥', '⚡', '🎯', '🏆', '🥇', '👟', '🚀', '⭐', '💎']

/**
 * Editable profile & preferences card.
 * - Avatar emoji picker (stored in personal_note as JSON key)
 * - Editable goal / phone
 * - App preferences: theme (dark mode), language (TR/EN)
 */
export default function ProfileSettings() {
  const { profile, updateProfile } = useStudentAuth()
  const { darkMode: dm, toggleDarkMode, language, setLanguage, showToast } = useStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedBurst, setSavedBurst] = useState(0)
  const [form, setForm] = useState({
    goal: profile?.goal || '',
    phone: profile?.phone || '',
    avatar: extractAvatar(profile?.personal_note) || '🏐',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        goal: form.goal,
        phone: form.phone,
        personal_note: mergeAvatar(profile?.personal_note, form.avatar),
      })
      setSavedBurst(k => k + 1)
      showToast(language === 'tr' ? 'Profil güncellendi' : 'Profile updated')
      setIsEditing(false)
    } catch {
      showToast(language === 'tr' ? 'Kaydedilemedi' : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      goal: profile?.goal || '',
      phone: profile?.phone || '',
      avatar: extractAvatar(profile?.personal_note) || '🏐',
    })
    setIsEditing(false)
  }

  const label = `block text-xs font-medium uppercase tracking-wider mb-2 ${dm ? 'text-white/40' : 'text-black/40'}`
  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:border-primary/50 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`

  return (
    <motion.div variants={fadeUp} className="max-w-2xl space-y-6">
      <div className={`p-8 rounded-[2rem] border ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-xl'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            <motion.div
              layout
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center text-4xl border border-primary/10"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={form.avatar}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 30 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                >
                  {form.avatar}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">{profile?.name}</h2>
              <p className={`text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{profile?.athlete_level}</span>
                <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold">{profile?.xp || 0} XP</span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              {language === 'tr' ? '✏️ Düzenle' : '✏️ Edit'}
            </motion.button>
          )}
        </div>

        {/* Avatar picker — only while editing */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <label className={label}>{language === 'tr' ? 'Avatar' : 'Avatar'}</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((a) => (
                  <motion.button
                    key={a}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm(f => ({ ...f, avatar: a }))}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                      form.avatar === a
                        ? 'bg-primary/20 ring-2 ring-primary/60'
                        : (dm ? 'bg-white/[0.04] hover:bg-white/[0.08]' : 'bg-black/[0.03] hover:bg-black/[0.06]')
                    }`}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editable fields */}
        <div className="space-y-4">
          <div>
            <label className={label}>{language === 'tr' ? 'Hedef' : 'Goal'}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.goal}
                onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                placeholder={language === 'tr' ? 'Örn: Voleybol için patlayıcılık' : 'e.g. Explosiveness for volleyball'}
                className={inp}
              />
            ) : (
              <p className={`p-3.5 rounded-xl ${dm ? 'bg-white/[0.02] text-white/80' : 'bg-black/[0.02] text-black/80'} text-sm`}>
                {profile?.goal || (language === 'tr' ? 'Belirlenmedi' : 'Not set')}
              </p>
            )}
          </div>

          <div>
            <label className={label}>{language === 'tr' ? 'Telefon' : 'Phone'}</label>
            {isEditing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+90 5xx xxx xx xx"
                className={inp}
              />
            ) : (
              <p className={`p-3.5 rounded-xl ${dm ? 'bg-white/[0.02] text-white/80' : 'bg-black/[0.02] text-black/80'} text-sm`}>
                {profile?.phone || (language === 'tr' ? 'Eklenmedi' : 'Not added')}
              </p>
            )}
          </div>
        </div>

        {/* Save / Cancel */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3 mt-6"
            >
              <motion.button
                whileHover={isSaving ? undefined : { scale: 1.01 }}
                whileTap={isSaving ? undefined : { scale: 0.99 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving && (
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </motion.svg>
                )}
                {isSaving
                  ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                  : (language === 'tr' ? 'Kaydet' : 'Save')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCancel}
                disabled={isSaving}
                className={`px-5 py-3.5 rounded-xl font-semibold text-sm ${dm ? 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08]'}`}
              >
                {language === 'tr' ? 'İptal' : 'Cancel'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved burst confirmation */}
        <AnimatePresence>
          {savedBurst > 0 && (
            <motion.div
              key={savedBurst}
              variants={successPop}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.8 }}
              onAnimationComplete={() => {
                setTimeout(() => setSavedBurst(0), 1200)
              }}
              className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-medium"
            >
              <span>✅</span>
              <span>{language === 'tr' ? 'Değişiklikler kaydedildi' : 'Changes saved'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preferences card */}
      <div className={`p-8 rounded-[2rem] border ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-xl'}`}>
        <h3 className="font-display text-lg font-bold mb-6 tracking-tight">
          {language === 'tr' ? 'Uygulama Tercihleri' : 'App Preferences'}
        </h3>

        <div className="space-y-3">
          {/* Theme */}
          <div className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
            <div>
              <p className="text-sm font-medium">{language === 'tr' ? 'Karanlık Mod' : 'Dark Mode'}</p>
              <p className={`text-xs mt-0.5 ${dm ? 'text-white/30' : 'text-black/30'}`}>
                {language === 'tr' ? 'Arayüz temasını değiştir' : 'Toggle interface theme'}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors ${dm ? 'bg-primary' : 'bg-black/10'}`}
              aria-label="Toggle dark mode"
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow ${dm ? 'right-0.5' : 'left-0.5'}`}
              />
            </button>
          </div>

          {/* Language */}
          <div className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
            <div>
              <p className="text-sm font-medium">{language === 'tr' ? 'Dil' : 'Language'}</p>
              <p className={`text-xs mt-0.5 ${dm ? 'text-white/30' : 'text-black/30'}`}>
                {language === 'tr' ? 'Görüntülenecek dil' : 'Display language'}
              </p>
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-black/[0.04]">
              {(['tr', 'en'] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all ${
                    language === lng ? 'bg-primary text-white shadow-sm' : (dm ? 'text-white/50' : 'text-black/50')
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ────────────────────────────────────────────────────────────────
// Helpers: we store avatar emoji inside `personal_note` as a JSON
// prefix so we don't need to alter the database schema.
// Format: `{"avatar":"🏐"}\n<rest of note>`
// ────────────────────────────────────────────────────────────────
function extractAvatar(note?: string): string | null {
  if (!note) return null
  const match = note.match(/^\{"avatar":"([^"]+)"\}/)
  return match ? match[1] : null
}

function mergeAvatar(note: string | undefined, avatar: string): string {
  const existing = note || ''
  const stripped = existing.replace(/^\{"avatar":"[^"]*"\}\n?/, '')
  return `{"avatar":"${avatar}"}\n${stripped}`
}
