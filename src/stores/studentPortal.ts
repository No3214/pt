import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decryptData } from '../lib/crypto'

export interface StudentClientData {
  id?: string
  name?: string
  startDate?: string
  athleteLevel?: string
  personalNote?: string
  goal?: string
  nutritionGoals?: { calories?: number; protein?: number; carbs?: number; fats?: number }
  performanceStats?: {
    strength?: number
    explosiveness?: number
    endurance?: number
    consistency?: number
    nutrition?: number
  }
  weightHistory?: { date: string; weight: number }[]
  [key: string]: unknown
}

export interface StudentDecryptedData {
  client?: StudentClientData
  [key: string]: unknown
}

interface StudentPortalState {
  encryptedData: string | null
  decryptedData: StudentDecryptedData | null
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
          set({ error: e instanceof Error ? e.message : 'Hatalı PIN.' })
          return false
        }
      },

      logout: () => set({ decryptedData: null, encryptedData: null, error: null, lastAccess: null }),
    }),
    { name: 'ela-pt-student-portal' }
  )
)
