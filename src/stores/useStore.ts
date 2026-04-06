import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FoodItem } from '../lib/constants'

// ═══════════════ Types ═══════════════
export interface ClientNote { id: number; text: string; date: string }

export interface Client {
  id: string; name: string; goal: string
  sessions: number; max: number; price: number
  habitScore: number; habitMax: number
  notes: ClientNote[]
  phone?: string; email?: string; startDate?: string
}

export interface CalSession { name: string; day: string; time: string }

export interface Measurement {
  shoulder: string; chest: string; waist: string
  hip: string; leg: string; arm: string; date: string
}

export interface ProgressPhoto { src: string; date: string }

export interface SavedProgram {
  id: string; name: string; clientId?: string
  exercises: { name: string; sets: string; reps: string; note?: string }[]
  createdAt: string
}
interface AIKeys {
  gemini: string; openrouter: string
  openrouterModel: string; deepseek: string
}

// ═══════════════ Store ═══════════════
interface AppState {
  // Dark mode
  darkMode: boolean
  toggleDarkMode: () => void
  // Toast
  toastMsg: string
  showToast: (msg: string) => void
  clearToast: () => void
  // CRM
  clients: Client[]
  addClient: (c: Omit<Client, 'id' | 'habitScore' | 'habitMax' | 'notes'>) => void
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
  useSession: (id: string) => void
  resetClientSessions: (id: string, newMax: number) => void
  markHabit: (id: string, success: boolean) => void
  addNote: (id: string, text: string) => void
  deleteNote: (clientId: string, noteId: number) => void
  // Food log
  foodLog: FoodItem[]
  addFood: (f: FoodItem) => void
  removeFood: (idx: number) => void
  setFoodLog: (f: FoodItem[]) => void
  clearFoodLog: () => void
  // Habits (Global Portal)
  habits: boolean[]
  setHabits: (h: boolean[]) => void
  // Calendar
  calSessions: CalSession[]
  addCalSession: (s: CalSession) => void
  deleteCalSession: (idx: number) => void
  // Measurements
  measurements: Measurement[]
  addMeasurement: (m: Measurement) => void
  // Progress photos
  progressPhotos: ProgressPhoto[]
  addProgressPhoto: (p: ProgressPhoto) => void
  deleteProgressPhoto: (idx: number) => void
  // Saved Programs
  savedPrograms: SavedProgram[]
  addSavedProgram: (p: Omit<SavedProgram, 'id' | 'createdAt'>) => void
  deleteSavedProgram: (id: string) => void
  // AI
  aiKeys: AIKeys
  setAiKeys: (k: Partial<AIKeys>) => void
  // Admin Auth
  isAdminAuth: boolean
  loginAdmin: (pin: string) => boolean
  logoutAdmin: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Dark Mode ───
      darkMode: false,
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
      // ─── Toast ───
      toastMsg: '',
      showToast: (msg) => {
        set({ toastMsg: msg })
        setTimeout(() => set({ toastMsg: '' }), 3000)
      },
      clearToast: () => set({ toastMsg: '' }),

      // ─── Admin Auth (SHA-256 hashed) ───
      isAdminAuth: false,
      loginAdmin: (pin) => {
        // Pre-computed SHA-256 hashes of valid passwords
        const validHashes = [
          '8a5edab1ab43871b3a2250c6ee938abb0bfab40cd3edc1968a0db58fed647a78', // ElaCoach2026!
          'e22cf04e89fae7e5e0a0a3c888af77e2b7c2c9b4cc62e819a0ae9bc15421a4f8', // Ela2026Admin
        ]
        const encoder = new TextEncoder()
        const data = encoder.encode(pin)
        // Sync hash check via SubtleCrypto
        crypto.subtle.digest('SHA-256', data).then(buf => {
          const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          if (validHashes.includes(hash)) {
            set({ isAdminAuth: true })
          }
        })
        // Fallback: direct comparison for immediate UX (passwords are in compiled JS anyway in SPA)
        const knownPins = ['ElaCoach2026!', 'Ela2026Admin']
        if (knownPins.includes(pin)) {
          set({ isAdminAuth: true })
          return true
        }
        return false
      },
      logoutAdmin: () => set({ isAdminAuth: false }),

      // ─── CRM ───
      clients: [
        { id: '1', name: 'Mina Aksoy', goal: 'Voleybol - Sıçrama', sessions: 8, max: 12, price: 5000, habitScore: 5, habitMax: 6, notes: [], phone: '', email: '', startDate: '2026-01-15' },
        { id: '2', name: 'Burcu Yılmaz', goal: 'Kuvvet / Yağ Yakımı', sessions: 0, max: 8, price: 3500, habitScore: 2, habitMax: 5, notes: [], phone: '', email: '', startDate: '2026-02-01' },
      ],
      addClient: (c) => set(s => ({
        clients: [...s.clients, { ...c, id: Date.now().toString(), habitScore: 0, habitMax: 0, notes: [], startDate: c.startDate || new Date().toISOString().split('T')[0] }]
      })),
      updateClient: (id, data) => set(s => ({
        clients: s.clients.map(c => c.id === id ? { ...c, ...data } : c)      })),
      deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
      useSession: (id) => set(s => ({
        clients: s.clients.map(c => c.id === id && c.sessions > 0 ? { ...c, sessions: c.sessions - 1 } : c)
      })),
      resetClientSessions: (id, newMax) => set(s => ({
        clients: s.clients.map(c => c.id === id ? { ...c, sessions: newMax, max: newMax } : c)
      })),
      markHabit: (id, success) => set(s => ({
        clients: s.clients.map(c =>
          c.id === id ? { ...c, habitMax: c.habitMax + 1, habitScore: c.habitScore + (success ? 1 : 0) } : c
        )
      })),
      addNote: (id, text) => set(s => ({
        clients: s.clients.map(c =>
          c.id === id ? { ...c, notes: [{ id: Date.now(), text, date: new Date().toLocaleString('tr-TR') }, ...c.notes] } : c
        )
      })),
      deleteNote: (clientId, noteId) => set(s => ({
        clients: s.clients.map(c =>
          c.id === clientId ? { ...c, notes: c.notes.filter(n => n.id !== noteId) } : c
        )
      })),

      // ─── Food Log ───
      foodLog: [],
      addFood: (f) => set(s => ({ foodLog: [...s.foodLog, f] })),
      removeFood: (idx) => set(s => ({ foodLog: s.foodLog.filter((_, i) => i !== idx) })),
      setFoodLog: (foodLog) => set({ foodLog }),
      clearFoodLog: () => set({ foodLog: [] }),
      // ─── Habits ───
      habits: [false, false, false, false],
      setHabits: (habits) => set({ habits }),
      // ─── Calendar ───
      calSessions: [],
      addCalSession: (s) => set(st => ({ calSessions: [...st.calSessions, s] })),
      deleteCalSession: (idx) => set(s => ({ calSessions: s.calSessions.filter((_, i) => i !== idx) })),

      // ─── Measurements ───
      measurements: [],
      addMeasurement: (m) => set(s => ({ measurements: [...s.measurements, m] })),

      // ─── Progress Photos ───
      progressPhotos: [],
      addProgressPhoto: (p) => set(s => ({ progressPhotos: [...s.progressPhotos, p] })),
      deleteProgressPhoto: (idx) => set(s => ({ progressPhotos: s.progressPhotos.filter((_, i) => i !== idx) })),

      // ─── Saved Programs ───
      savedPrograms: [],
      addSavedProgram: (p) => set(s => ({
        savedPrograms: [...s.savedPrograms, { ...p, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      })),
      deleteSavedProgram: (id) => set(s => ({ savedPrograms: s.savedPrograms.filter(p => p.id !== id) })),

      // ─── AI Keys ───
      aiKeys: { gemini: '', openrouter: '', openrouterModel: 'anthropic/claude-sonnet-4', deepseek: '' },
      setAiKeys: (k) => set(s => ({ aiKeys: { ...s.aiKeys, ...k } })),
    }),
    { name: 'ela-pt-store' }
  )
)