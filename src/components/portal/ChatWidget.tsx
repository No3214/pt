import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [_isTyping, _setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, conversations, fetchConversations, fetchMessages, activeConversation, user } = useStudentAuth()
  const darkMode = useStore(s => s.darkMode)

  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      fetchConversations()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && conversations.length > 0 && !activeConversation) {
      fetchMessages(conversations[0].id)
    }
  }, [conversations, isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!message.trim()) return
    const msg = message
    setMessage('')
    await sendMessage(msg)
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Bugün'
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Dün'
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/30 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {conversations.some(c => c.unread_student > 0) && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[0.6rem] font-bold flex items-center justify-center animate-pulse">
            {conversations.reduce((sum, c) => sum + c.unread_student, 0)}
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
              darkMode
                ? 'bg-[#0A0A0A] border-white/[0.08] shadow-black/40'
                : 'bg-white border-black/[0.06] shadow-black/10'
            }`}
          >
            {/* Header */}
            <div className={`px-5 py-4 border-b flex items-center gap-3 ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">EE</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Koç Ela</div>
                <div className={`text-[0.6rem] uppercase tracking-widest ${darkMode ? 'text-green-400/70' : 'text-green-600/70'}`}>Çevrimiçi</div>
              </div>
              <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={darkMode ? 'text-white/30' : 'text-black/30'}>
                  <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="font-bold text-sm mb-1">Koçunla Konuş</p>
                  <p className={`text-xs ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                    Sorularını sor, gelişimini paylaş.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id
                    const showDate = i === 0 || formatDate(messages[i-1].created_at) !== formatDate(msg.created_at)

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                              darkMode ? 'bg-white/[0.04] text-white/20' : 'bg-black/[0.03] text-black/20'
                            }`}>
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? 'bg-primary text-white rounded-br-lg'
                              : darkMode
                                ? 'bg-white/[0.06] text-white/80 rounded-bl-lg'
                                : 'bg-black/[0.04] text-black/80 rounded-bl-lg'
                          }`}>
                            <p>{msg.content}</p>
                            <p className={`text-[0.55rem] mt-1 ${isMe ? 'text-white/40' : darkMode ? 'text-white/20' : 'text-black/20'}`}>
                              {formatTime(msg.created_at)}
                              {isMe && msg.is_read && ' ✓✓'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}

              {_isTyping && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-lg ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-white/30' : 'bg-black/30'}`}
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={`px-4 py-3 border-t ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.04] text-black/30'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Mesaj yaz..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border-none outline-none text-sm ${
                    darkMode ? 'bg-white/[0.04] text-white placeholder:text-white/20' : 'bg-black/[0.03] text-black placeholder:text-black/20'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-30 transition-opacity"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
