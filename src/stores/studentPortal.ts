import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decryptData } from '../lib/crypto'

interface StudentPortalState {
  encryptedData: string | null
  decryptedData: Record<string, unknown> | null
  error: string | null
  lastAccess: number | null
  
  // Actions
  receiveData: (base64: string) => void
  unlock: (pin: string) => Promise<boolean>
  logout: () => void
}

export const useStudentPortal = create<StudentPortalState>()(
  persist(
    (set, get) => ({
      encryptedData: null,
      decryptedData: null,
      error: null,
      lastAccess: null,

      receiveData: (base64) => {
        set({ encryptedData: base64, decryptedData: null, error: null })
      },

      unlock: async (pin) => {
        try {
          const { encryptedData } = get()
          if (!encryptedData) throw new Error('Veri bulunamadı.')
          
          const raw = await decryptData(encryptedData, pin)
          const data = JSON.parse(raw)
          
          set({ 
            decryptedData: data, 
            error: null, 
            lastAccess: Date.now() 
          })
          return true
        } catch (e: unknown) {
          set({ error: e.message || 'Hatalı PIN.' })
          return false
        }
      },

      logout: () => set({ decryptedData: null, encryptedData: null, error: null, lastAccess: null }),
    }),
    { name: 'ela-pt-student-portal' }
  )
)
