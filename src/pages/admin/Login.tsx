import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../../stores/useStore'

export default function AdminLogin() {
  const { loginAdmin, darkMode } = useStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginAdmin(pin)) {
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-[#0f0f23]' : 'bg-[#F3F4F6]'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-sm ${darkMode ? 'bg-card-dark border border-white/5' : 'bg-white border border-black/5'}`}>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Koç Girişi</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>Sisteme giriş yapmak için PIN kodunu giriniz.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="PIN Kodu (1234)"
              autoFocus
              className={`w-full p-4 rounded-sm border outline-none text-center text-xl tracking-widest transition-all focus:border-terracotta ${error ? 'border-red-500' : ''} ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`}
            />
            {error && <p className="text-red-500 text-xs text-center mt-2">Hatalı PIN kodu.</p>}
          </div>
          
          <button type="submit" className="btn-ripple w-full py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">
            Giriş Yap
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6 border-black/5 dark:border-white/5">
          <NavLink to="/" className={`text-sm tracking-wide no-underline ${darkMode ? 'text-gray-400 hover:text-white' : 'text-[#57534E] hover:text-black'}`}>
            &larr; Ana Siteye Dön
          </NavLink>
        </div>
      </div>
    </div>
  )
}
