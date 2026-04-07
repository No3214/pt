import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, type Client } from '../../stores/useStore'
import { useTranslation } from '../../locales'
import { supabase } from '../../lib/supabase'
import { encryptData } from '../../lib/crypto'

/**
 * StudentManager — Admin component for managing student portal access.
 * Generates invite links & PINs for students to access their portal.
 * V2: Also supports Supabase Auth student creation.
 */

export default function StudentManager() {
  const { t } = useTranslation()
  const { clients, updateClient, showToast } = useStore()
  const darkMode = useStore(s => s.darkMode)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [inviteMode, setInviteMode] = useState<'pin' | 'email'>('email')
  const [generatedLink, setGeneratedLink] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePassword, setInvitePassword] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const generatePIN = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleGenerateInvite = async (client: Client) => {
    if (inviteMode === 'pin') {
      // Legacy PIN-based
      const pin = generatePIN()
      const payload = JSON.stringify({ client, generatedAt: new Date().toISOString() })
      const encrypted = await encryptData(payload, pin)
      const link = `${window.location.origin}/portal-legacy?d=${encrypted}`
      setGeneratedLink(link)
      setStatusMsg(`PIN: ${pin}`)
    }
  }

  const handleCreateStudentAccount = async (client: Client) => {
    if (!inviteEmail) return
    setIsSending(true)
    setStatusMsg('')

    try {
      const tempPassword = invitePassword || `Sporcu${generatePIN()}!`

      // Create auth user via Supabase
      const { error: authError } = await supabase.auth.admin.createUser({
        email: inviteEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: client.name, role: 'student' }
      })

      if (authError) {
        // Fallback: use signUp if admin API not available
        const { error: signUpError } = await supabase.auth.signUp({
          email: inviteEmail,
          password: tempPassword,
          options: { data: { name: client.name, role: 'student' } }
        })
        if (signUpError) throw signUpError
      }
      
      setStatusMsg(t.admin.students_toast_success
        .replace('{email}', inviteEmail)
        .replace('{password}', tempPassword))
      updateClient(client.id, { email: inviteEmail })
    } catch (e: any) {
      setStatusMsg(t.admin.students_toast_error.replace('{message}', e.message))
    } finally {
      setIsSending(false)
    }
  }

  const cardBg = darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-lg'

  return (
    <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">{t.admin.students_title}</h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
            {t.admin.students_subtitle}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          {t.admin.students_count.replace('{}', clients.length.toString())}
        </span>
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {clients.map(client => (
          <div key={client.id} className={`p-5 rounded-2xl border transition-all ${
            selectedClient?.id === client.id
              ? 'border-primary/30 bg-primary/5'
              : darkMode ? 'border-white/[0.06] hover:border-white/[0.12]' : 'border-black/[0.06] hover:border-black/[0.12]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                  client.athleteLevel === 'Elite' ? 'bg-yellow-500/20 text-yellow-600' :
                  client.athleteLevel === 'Pro' ? 'bg-blue-500/20 text-blue-600' :
                  'bg-green-500/20 text-green-600'
                }`}>
                  {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm">{client.name}</div>
                  <div className={`text-xs ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                    {client.email || t.admin.students_no_email} • {client.athleteLevel || 'Rookie'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-[0.6rem] font-bold ${
                  client.sessions > 0
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {t.admin.students_sessions.replace('{}', `${client.sessions}/${client.max}`)}
                </span>
                <button
                  onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold"
                >
                  {selectedClient?.id === client.id ? t.admin.students_btn_close : t.admin.students_btn_invite}
                </button>
              </div>
            </div>

            {/* Expand: Invite Panel */}
            <AnimatePresence>
              {selectedClient?.id === client.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-4 pt-4 border-t space-y-4 ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                      {[
                        { key: 'email' as const, label: t.admin.students_mode_email },
                        { key: 'pin' as const, label: t.admin.students_mode_pin },
                      ].map(m => (
                        <button
                          key={m.key}
                          onClick={() => setInviteMode(m.key)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            inviteMode === m.key
                              ? 'bg-primary text-white'
                              : darkMode ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {inviteMode === 'email' ? (
                      <div className="space-y-3">
                        <input
                          type="email"
                          placeholder={t.admin.students_email_placeholder}
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-primary ${
                            darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-[#FAF6F1] border-black/[0.06]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder={t.admin.students_password_placeholder}
                          value={invitePassword}
                          onChange={e => setInvitePassword(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-primary ${
                            darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-[#FAF6F1] border-black/[0.06]'
                          }`}
                        />
                        <button
                          onClick={() => handleCreateStudentAccount(client)}
                          disabled={!inviteEmail || isSending}
                          className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50"
                        >
                          {isSending ? t.admin.students_btn_creating : t.admin.students_btn_create}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGenerateInvite(client)}
                        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm"
                      >
                        {t.admin.students_btn_generate_pin}
                      </button>
                    )}

                    {/* Result */}
                    {statusMsg && (
                      <div className={`p-4 rounded-xl text-sm whitespace-pre-line ${
                        statusMsg.startsWith('✅') ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                        statusMsg.startsWith('❌') ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {statusMsg}
                      </div>
                    )}

                    {generatedLink && (
                      <div className="space-y-2">
                        <div className={`p-3 rounded-xl text-xs break-all font-mono ${darkMode ? 'bg-white/[0.04]' : 'bg-black/[0.03]'}`}>
                          {generatedLink}
                        </div>
                        <button
                          onClick={() => { navigator.clipboard.writeText(generatedLink); showToast(t.admin.students_toast_copy_success) }}
                          className="text-xs text-primary font-medium"
                        >
                          {t.admin.students_btn_copy_link}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
