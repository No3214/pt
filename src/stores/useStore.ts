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
}

export interface CalSession { name: string; day: string; time: string }

export interface Measurement {
  shoulder: string; chest: string; waist: string
  hip: string; leg: string; arm: string; date: string
}

export interface ProgressPhoto { src: string; date: string }

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
  deleteClient: (id: string) => void
  useSession: (id: string) => void
  markHabit: (id: string, success: boolean) => void
  addNote: (id: string, text: string) => void
  deleteNote: (clientId: string, noteId: number) => void
  // Food log
  foodLog: FoodItem[]
  addFood: (f: FoodItem) => void
  removeFood: (idx: number) => void
  clearFoodLog: () => void
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

      // ─── Admin Auth ───
      isAdminAuth: false,
      loginAdmin: (pin) => {
        // Geçici basit PIN: 1234
        if (pin === '1234') {
          set({ isAdminAuth: true })
          return true
        }
        return false
      },
      logoutAdmin: () => set({ isAdminAuth: false }),

      // ─── CRM ───
      clients: [
        { id: '1', name: 'Mina Aksoy', goal: 'Voleybol - Sıçrama', sessions: 8, max: 12, price: 5000, habitScore: 5, habitMax: 6, notes: [] },
        { id: '2', name: 'Burcu Yılmaz', goal: 'Kuvvet / Yağ Yakımı', sessions: 0, max: 8, price: 3500, habitScore: 2, habitMax: 5, notes: [] },
      ],
      addClient: (c) => set(s => ({
        clients: [...s.clients, { ...c, id: Date.now().toString(), habitScore: 0, habitMax: 0, notes: [] }]
      })),
      deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
      useSession: (id) => set(s => ({
        clients: s.clients.map(c => c.id === id && c.sessions > 0 ? { ...c, sessions: c.sessions - 1 } : c)
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
      clearFoodLog: () => set({ foodLog: [] }),

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

      // ─── AI Keys ───
      aiKeys: { gemini: '', openrouter: '', openrouterModel: 'anthropic/claude-sonnet-4', deepseek: '' },
      setAiKeys: (k) => set(s => ({ aiKeys: { ...s.aiKeys, ...k } })),
    }),
    { name: 'ela-pt-store' }
  )
)
