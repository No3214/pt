import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FoodItem } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { exercises as _exerciseDB } from '../lib/exercises'

// ═══════════════ Types ═══════════════
export interface ClientNote { id: number; text: string; date: string }

export interface WellnessLog {
  id: string; date: string; rpe: number; sleep: number; energy: number; stress: number; coachFeedback?: string;
}

export interface Lead {
  id: string; name: string; phone: string; goal: string; email?: string; message?: string; notes?: string; status: 'New' | 'Contacted'; date: string;
  height?: string; weight?: string; age?: string; healthIssues?: string; allergies?: string;
}

export interface Client {
  id: string; name: string; goal: string
  sessions: number; max: number; price: number
  habitScore: number; habitMax: number
  notes: ClientNote[]
  phone?: string; email?: string; startDate?: string
  allergens?: string[]
  athleteLevel?: 'Rookie' | 'Pro' | 'Elite'
  personalNote?: string
  nutritionGoals?: { cal: number; p: number; f: number; c: number }
  performanceStats?: { strength: number; explosiveness: number; endurance: number; consistency: number; nutrition: number }
  wellnessLogs?: WellnessLog[]
}

export interface CalSession {
  name: string
  day: string
  time: string
  meetingLink?: string
  meetingType?: 'zoom' | 'teams' | 'meet' | 'other'
  meetingNote?: string
  isOnline?: boolean
}

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  goal: string
  message?: string
  preferredDay?: string
  preferredTime?: string
  status: 'pending' | 'approved' | 'paid' | 'scheduled' | 'completed' | 'rejected'
  sessionType: 'consultation' | 'assessment' | 'training'
  price?: number
  meetingLink?: string
  meetingType?: 'zoom' | 'teams' | 'meet' | 'other'
  scheduledDate?: string
  scheduledTime?: string
  adminNote?: string
  createdAt: string
  updatedAt?: string
}

export interface Measurement {
  id: string
  clientId: string
  weight: string; bodyFat: string
  shoulder: string; chest: string; waist: string
  hip: string; leg: string; arm: string; date: string; notes?: string
}

export interface ProgressPhoto { clientId: string; src: string; date: string }

export interface SavedProgram {
  id: string; name: string; clientId?: string
  exercises: { name: string; sets: string; reps: string; note?: string; youtubeId?: string }[]
  createdAt: string
}

// ═══════════════ Store ═══════════════
interface AppState {
  // Dark mode
  darkMode: boolean
  toggleDarkMode: () => void
  // Language
  language: string
  setLanguage: (lang: string) => void
  // Toast
  toastMsg: string
  showToast: (msg: string) => void
  clearToast: () => void
  // Leads CRM
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => Promise<void>
  updateLeadStatus: (id: string, status: 'New' | 'Contacted') => void
  // CRM
  clients: Client[]
  addClient: (c: Omit<Client, 'id' | 'habitScore' | 'habitMax' | 'notes' | 'athleteLevel'>) => void
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
  deductSession: (id: string) => void
  resetClientSessions: (id: string, newMax: number) => void
  markHabit: (id: string, success: boolean) => void
  addNote: (id: string, text: string) => void
  deleteNote: (clientId: string, noteId: number) => void
  // UI / AI Keys
  aiConfig: { gemini: string; openrouter: string; deepseek: string }
  setAiConfig: (config: Partial<{ gemini: string; openrouter: string; deepseek: string }>) => void
  // Food log
  foodLog: FoodItem[]
  addFood: (f: FoodItem) => void
  removeFood: (idx: number) => void
  setFoodLog: (f: FoodItem[]) => void
  clearFoodLog: () => void
  addWellnessLog: (clientId: string, log: Omit<WellnessLog, 'id'>) => void
  // Habits (Global Portal)
  habits: boolean[]
  setHabits: (h: boolean[]) => void
  streak: number
  lastCheckIn: string | null
  doCheckIn: () => void
  // Calendar
  calSessions: CalSession[]
  addCalSession: (s: CalSession) => void
  deleteCalSession: (idx: number) => void
  // Measurements
  measurements: Measurement[]
  addMeasurement: (clientId: string, m: Omit<Measurement, 'clientId' | 'id'>) => Promise<void>
  targetWeight: number
  workoutLogs: { date: string; completed: boolean }[]
  lastResetDate: string | null
  checkDailyReset: () => void
  generateMockData: (clientId: string) => void
  // Progress photos
  progressPhotos: ProgressPhoto[]
  addProgressPhoto: (clientId: string, p: Omit<ProgressPhoto, 'clientId'>) => void
  deleteProgressPhoto: (idx: number) => void
  // Saved Programs
  savedPrograms: SavedProgram[]
  addSavedProgram: (p: Omit<SavedProgram, 'id' | 'createdAt'>) => void
  deleteSavedProgram: (id: string) => void
  // Admin Auth
  isAdminAuth: boolean
  loginAdmin: (pin: string) => Promise<boolean>
  logoutAdmin: () => void
  // WhatsApp Templates
  whatsappTemplates: { onboarding: string; measurement: string }
  updateTemplate: (key: 'onboarding' | 'measurement', value: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Dark Mode ───
      darkMode: false,
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
      // ─── Language ───
      language: 'tr',
      setLanguage: (language) => set({ language }),
      // ─── Toast ───
      toastMsg: '',
      showToast: (msg) => {
        set({ toastMsg: msg })
        setTimeout(() => set({ toastMsg: '' }), 3000)
      },
      clearToast: () => set({ toastMsg: '' }),

      // ─── Admin Auth (SHA-256 hashed) ───
      isAdminAuth: false,
      loginAdmin: async (pin) => {
        const validHashes = [
          '45801e4070883701f718fa8c4c6268558c48eaef8fb93a51283af1fb608ca5c7', // ela2026
          '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // 1234
        ]
        const encoder = new TextEncoder()
        const data = encoder.encode(pin)
        
        try {
          const buf = await crypto.subtle.digest('SHA-256', data)
          const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          
          if (validHashes.includes(hash)) {
            set({ isAdminAuth: true })
            return true
          }
        } catch (e) {
          console.error('Hash calculation failed', e)
        }
        
        return false
      },
      logoutAdmin: () => set({ isAdminAuth: false }),

      // ─── Leads CRM ───
      leads: [],
      addLead: async (lead) => {
        const newLead = {
          ...lead,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: 'New'
        } as Lead
        
        set(s => ({ leads: [newLead, ...s.leads] }))

        // Sync to Supabase
        await supabase.from('leads').insert([{
           name: lead.name,
           phone: lead.phone,
           email: lead.email,
           goal: lead.goal,
           message: lead.message,
           height: lead.height ? parseFloat(lead.height) : null,
           weight: lead.weight ? parseFloat(lead.weight) : null,
           age: lead.age ? parseInt(lead.age) : null,
           health_issues: lead.healthIssues,
           allergies: lead.allergies,
           status: 'New'
        }])
      },
      updateLeadStatus: (id, status) => set(s => ({
        leads: s.leads.map(l => l.id === id ? { ...l, status } : l)
      })),

      // ─── CRM ───
      clients: [
        { id: '1', name: 'Mina Aksoy', goal: 'Voleybol - Sıçrama', sessions: 8, max: 12, price: 5000, habitScore: 5, habitMax: 6, notes: [], phone: '905551234567', email: 'mina@example.com', startDate: '2026-01-15', allergens: [], athleteLevel: 'Elite', personalNote: 'Sıçrama kapasiten bu hafta %15 arttı, harika gidiyorsun Mina!', nutritionGoals: { cal: 2400, p: 160, f: 70, c: 280 }, performanceStats: { strength: 85, explosiveness: 92, endurance: 74, consistency: 88, nutrition: 80 }, wellnessLogs: [
          { id: '1', date: new Date().toISOString(), rpe: 8, sleep: 7, energy: 9, stress: 2, coachFeedback: 'Bugün harika bir enerji seviyesindesin Mina! Antrenman zorluğu ideal.' }
        ] },
        { id: '2', name: 'Burcu Yılmaz', goal: 'Kuvvet / Yağ Yakımı', sessions: 0, max: 8, price: 3500, habitScore: 2, habitMax: 5, notes: [], phone: '', email: '', startDate: '2026-02-01', allergens: ['Gluten'], athleteLevel: 'Pro', nutritionGoals: { cal: 1800, p: 130, f: 60, c: 180 }, performanceStats: { strength: 65, explosiveness: 45, endurance: 55, consistency: 72, nutrition: 60 }, wellnessLogs: [
          { id: '2', date: new Date().toISOString(), rpe: 4, sleep: 5, energy: 4, stress: 7, coachFeedback: 'Burcu, uykun düşük ve stresin yüksek görünüyor. Bugün aktif dinlenmeye odaklanalım.' }
        ] },
      ],
      addClient: (c) => set(s => {
        const nClient = { ...c, name: c.name.replace(/[<>]/g, '').slice(0,100), goal: c.goal.replace(/[<>]/g, '').slice(0, 200) };
        return {
          clients: [...s.clients, { ...nClient, id: Date.now().toString(), habitScore: 0, habitMax: 0, notes: [], allergens: c.allergens || [], startDate: c.startDate || new Date().toISOString().split('T')[0], athleteLevel: 'Rookie' }]
        }
      }),
      updateClient: (id, data) => set(s => {
        const safeData = { ...data };
        if (safeData.name) safeData.name = safeData.name.replace(/[<>]/g, '').slice(0,100);
        if (safeData.goal) safeData.goal = safeData.goal.replace(/[<>]/g, '').slice(0,200);
        return {
          clients: s.clients.map(c => c.id === id ? { ...c, ...safeData } : c)
        }
      }),
      deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
      deductSession: (id) => set(s => ({
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
      addNote: (id, text) => set(s => {
        if (!text || typeof text !== 'string') return s;
        const cleanText = text.replace(/[<>]/g, '').slice(0, 1000); 
        return {
          clients: s.clients.map(c =>
            c.id === id ? { ...c, notes: [{ id: Date.now(), text: cleanText, date: new Date().toLocaleString('tr-TR') }, ...c.notes] } : c
          )
        }
      }),
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
      addWellnessLog: (clientId: string, log: Omit<WellnessLog, 'id'>) => set(s => ({
        clients: s.clients.map(c => c.id === clientId ? { ...c, wellnessLogs: [...(c.wellnessLogs || []), { ...log, id: Date.now().toString() }] } : c)
      })),
      // ─── Habits & Streak ───
      habits: [false, false, false, false],
      setHabits: (habits) => set({ habits }),
      streak: 0,
      lastCheckIn: null,
      doCheckIn: () => set(s => {
        const today = new Date().toISOString().split('T')[0];
        if (s.lastCheckIn === today) return {};
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        return {
          lastCheckIn: today,
          streak: s.lastCheckIn === yesterday ? s.streak + 1 : 1
        };
      }),
      // ─── Calendar ───
      calSessions: [],
      addCalSession: (s) => set(st => ({ calSessions: [...st.calSessions, s] })),
      deleteCalSession: (idx) => set(s => ({ calSessions: s.calSessions.filter((_, i) => i !== idx) })),

      // ─── Measurements ───
      measurements: [],
      addMeasurement: async (clientId, m) => {
        const newM = { ...m, id: Date.now().toString(), clientId }
        set(s => ({ measurements: [newM, ...s.measurements] }))

        // Sync to Supabase
        await supabase.from('measurements').insert([{
          client_id: clientId,
          date: m.date,
          weight: parseFloat(m.weight),
          body_fat: parseFloat(m.bodyFat),
          shoulder: parseFloat(m.shoulder),
          chest: parseFloat(m.chest),
          waist: parseFloat(m.waist),
          hip: parseFloat(m.hip),
          leg: parseFloat(m.leg),
          arm: parseFloat(m.arm),
          notes: m.notes
        }])
      },
      targetWeight: 75,
      workoutLogs: [],
      lastResetDate: null,
      checkDailyReset: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastResetDate } = get();
        if (lastResetDate !== today) {
          set((state) => ({
            clients: state.clients.map(c => ({ ...c, habitScore: 0, habitMax: 0 })),
            lastResetDate: today
          }));
        }
      },
      generateMockData: (clientId: string) => {
        const mockMeasurements: Measurement[] = [];
        const mockLogs: { date: string; completed: boolean }[] = [];
        const now = new Date();
        for (let i = 90; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          if (i % 7 === 0) {
            mockMeasurements.push({
              id: Math.random().toString(),
              clientId,
              date: dateStr,
              weight: (85 - (90 - i) * 0.1 + (Math.random() * 0.5)).toFixed(1),
              bodyFat: (20 - (90 - i) * 0.05).toFixed(1),
              shoulder: '120', chest: '100', waist: '90', hip: '100', leg: '60', arm: '35',
              notes: 'Mock data'
            });
          }
          if (Math.random() > 0.3) {
            mockLogs.push({ date: dateStr, completed: true });
          }
        }
        set((state) => ({
          measurements: [...state.measurements.filter(m => m.clientId !== clientId), ...mockMeasurements],
          workoutLogs: mockLogs
        }));
      },

      // ─── Progress Photos ───
      progressPhotos: [],
      addProgressPhoto: (clientId, p) => set(s => ({ progressPhotos: [...s.progressPhotos, { ...p, clientId }] })),
      deleteProgressPhoto: (idx) => set(s => ({ progressPhotos: s.progressPhotos.filter((_, i) => i !== idx) })),

      // ─── Saved Programs ───
      savedPrograms: [],
      addSavedProgram: (p) => set(s => ({
        savedPrograms: [...s.savedPrograms, { ...p, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      })),
      deleteSavedProgram: (id) => set(s => ({
        savedPrograms: s.savedPrograms.filter(p => p.id !== id)
      })),

      // ─── AI Config ───
      aiConfig: { gemini: '', openrouter: '', deepseek: '' },
      setAiConfig: (config) => set(s => ({ aiConfig: { ...s.aiConfig, ...config } })),

      // ─── WhatsApp Templates ───
      whatsappTemplates: {
        onboarding: 'Merhaba {name}! Ela Ebeoğlu PT ailesine hoş geldin 🎉\n\nBaşlangıç formunu doldurman gerekiyor:\n{link}\n\nSorularını bana sorabilirsin!',
        measurement: 'Merhaba {name}! Ölçüm zamanı geldi 📏\n\nAşağıdaki linkten ölçümlerini girebilirsin:\n{link}'
      },
      updateTemplate: (key, value) => set(s => ({
        whatsappTemplates: { ...s.whatsappTemplates, [key]: value }
      })),
    }),
    { name: 'ela-pt-store' }
  )
)