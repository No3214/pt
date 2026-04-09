import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// ═══════════════ Types ═══════════════
export interface StudentProfile {
  id: string
  auth_id: string
  coach_id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  goal?: string
  athlete_level: 'Rookie' | 'Pro' | 'Elite' | 'Legend'
  personal_note?: string
  nutrition_goals: { cal: number; p: number; f: number; c: number }
  performance_stats: { strength: number; explosiveness: number; endurance: number; consistency: number; nutrition: number }
  allergens: string[]
  subscription_status: 'active' | 'paused' | 'expired' | 'trial'
  subscription_end?: string
  total_sessions: number
  remaining_sessions: number
  streak: number
  xp: number
  created_at: string
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'workout' | 'message' | 'payment' | 'achievement' | 'reminder'
  action_url?: string
  is_read: boolean
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'workout' | 'meal_plan' | 'voice' | 'system'
  metadata: Record<string, string | number | boolean | null | undefined>
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  coach_id: string
  student_id: string
  last_message?: string
  last_message_at?: string
  unread_student: number
}

export interface WorkoutSession {
  id: string
  plan_id?: string
  date: string
  duration_minutes?: number
  exercises_completed: string[]
  total_volume?: number
  calories_burned?: number
  rpe?: number
  notes?: string
  mood?: string
}

export interface WellnessLog {
  id: string
  date: string
  sleep_hours?: number
  sleep_quality?: number
  energy_level?: number
  stress_level?: number
  water_liters?: number
  steps?: number
  mood?: string
  notes?: string
}

// ═══════════════ Store ═══════════════
interface StudentAuthState {
  // Auth
  user: User | null
  session: Session | null
  profile: StudentProfile | null
  isLoading: boolean
  error: string | null

  // Data
  notifications: Notification[]
  unreadCount: number
  conversations: Conversation[]
  messages: Message[]
  activeConversation: string | null
  workoutSessions: WorkoutSession[]
  wellnessLogs: WellnessLog[]

  // Auth Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>
  loginWithMagicLink: (email: string) => Promise<boolean>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>

  // Notification Actions
  fetchNotifications: () => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>

  // Messaging Actions
  fetchConversations: () => Promise<void>
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (content: string, type?: string) => Promise<void>
  setActiveConversation: (id: string | null) => void

  // Workout Actions
  fetchWorkoutSessions: () => Promise<void>
  logWorkout: (session: Omit<WorkoutSession, 'id'>) => Promise<void>

  // Wellness Actions
  fetchWellnessLogs: () => Promise<void>
  logWellness: (log: Omit<WellnessLog, 'id'>) => Promise<void>

  // Subscriptions
  subscribeToRealtime: () => () => void
}

export const useStudentAuth = create<StudentAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      error: null,
      notifications: [],
      unreadCount: 0,
      conversations: [],
      messages: [],
      activeConversation: null,
      workoutSessions: [],
      wellnessLogs: [],

      // ─── Initialize (check existing session) ───
      initialize: async () => {
        try {
          set({ isLoading: true, error: null })
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user) {
            const { data: profile } = await supabase
              .from('student_profiles')
              .select('*')
              .eq('auth_id', session.user.id)
              .single()

            set({ user: session.user, session, profile, isLoading: false })
          } else {
            set({ isLoading: false })
          }
        } catch (e) {
          set({ isLoading: false, error: 'Oturum kontrol edilemedi.' })
        }
      },

      // ─── Email/Password Login ───
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })

          if (error) throw error
          if (!data.user) throw new Error('Giriş başarısız.')

          const { data: profile } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('auth_id', data.user.id)
            .single()

          set({ user: data.user, session: data.session, profile, isLoading: false })
          return true
        } catch (e: unknown) {
          const msg = e.message?.includes('Invalid login') ? 'E-posta veya şifre hatalı.' : e.message || 'Giriş başarısız.'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      // ─── Register ───
      register: async (email, password, name, phone) => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, phone, role: 'student' }
            }
          })

          if (error) throw error
          if (!data.user) throw new Error('Kayıt başarısız.')

          // Create student profile
          const { error: profileError } = await supabase.from('student_profiles').insert([{
            auth_id: data.user.id,
            coach_id: data.user.id, // Will be assigned by coach later
            name,
            email,
            phone: phone || null,
            athlete_level: 'Rookie',
            subscription_status: 'trial'
          }])

          if (profileError) console.error('Profile creation error:', profileError)

          set({ user: data.user, session: data.session, isLoading: false })
          return true
        } catch (e: unknown) {
          const msg = e.message?.includes('already registered') ? 'Bu e-posta zaten kayıtlı.' : e.message || 'Kayıt başarısız.'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      // ─── Magic Link Login ───
      loginWithMagicLink: async (email) => {
        try {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/portal` }
          })
          if (error) throw error
          set({ isLoading: false })
          return true
        } catch (e: unknown) {
          set({ error: e instanceof Error ? e.message : "Unknown error" || 'Bağlantı gönderilemedi.', isLoading: false })
          return false
        }
      },

      // ─── Logout ───
      logout: async () => {
        await supabase.auth.signOut()
        set({
          user: null, session: null, profile: null,
          notifications: [], unreadCount: 0,
          conversations: [], messages: [], activeConversation: null,
          workoutSessions: [], wellnessLogs: []
        })
      },

      // ─── Reset Password ───
      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/portal/reset-password`
          })
          if (error) throw error
          set({ isLoading: false })
          return true
        } catch (e: unknown) {
          set({ error: e instanceof Error ? e.message : "Unknown error" || 'Şifre sıfırlama başarısız.', isLoading: false })
          return false
        }
      },

      // ─── Update Profile ───
      updateProfile: async (data) => {
        const { user } = get()
        if (!user) return

        const { error } = await supabase
          .from('student_profiles')
          .update(data)
          .eq('auth_id', user.id)

        if (!error) {
          set(s => ({ profile: s.profile ? { ...s.profile, ...data } : null }))
        }
      },

      // ─── Notifications ───
      fetchNotifications: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (data) {
          set({
            notifications: data,
            unreadCount: data.filter(n => !n.is_read).length
          })
        }
      },

      markNotificationRead: async (id) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id)
        set(s => ({
          notifications: s.notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
          unreadCount: Math.max(0, s.unreadCount - 1)
        }))
      },

      markAllNotificationsRead: async () => {
        const { user } = get()
        if (!user) return
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
        set(s => ({
          notifications: s.notifications.map(n => ({ ...n, is_read: true })),
          unreadCount: 0
        }))
      },

      // ─── Messaging ───
      fetchConversations: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('conversations')
          .select('*')
          .or(`coach_id.eq.${user.id},student_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false })

        if (data) set({ conversations: data })
      },

      fetchMessages: async (conversationId) => {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(100)

        if (data) set({ messages: data, activeConversation: conversationId })

        // Mark as read
        const { user } = get()
        if (user) {
          await supabase.from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id)
            .eq('is_read', false)
        }
      },

      sendMessage: async (content, type = 'text') => {
        const { user, activeConversation } = get()
        if (!user || !activeConversation) return

        const { data } = await supabase.from('messages').insert([{
          conversation_id: activeConversation,
          sender_id: user.id,
          content,
          message_type: type
        }]).select().single()

        if (data) {
          set(s => ({ messages: [...s.messages, data] }))
          // Update conversation last message
          await supabase.from('conversations').update({
            last_message: content,
            last_message_at: new Date().toISOString()
          }).eq('id', activeConversation)
        }
      },

      setActiveConversation: (id) => set({ activeConversation: id }),

      // ─── Workouts ───
      fetchWorkoutSessions: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('student_id', user.id)
          .order('date', { ascending: false })
          .limit(90)

        if (data) set({ workoutSessions: data })
      },

      logWorkout: async (session) => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase.from('workout_sessions').insert([{
          ...session,
          student_id: user.id
        }]).select().single()

        if (data) set(s => ({ workoutSessions: [data, ...s.workoutSessions] }))
      },

      // ─── Wellness ───
      fetchWellnessLogs: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('wellness_logs')
          .select('*')
          .eq('student_id', user.id)
          .order('date', { ascending: false })
          .limit(90)

        if (data) set({ wellnessLogs: data })
      },

      logWellness: async (log) => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase.from('wellness_logs').insert([{
          ...log,
          student_id: user.id
        }]).select().single()

        if (data) set(s => ({ wellnessLogs: [data, ...s.wellnessLogs] }))
      },

      // ─── Realtime Subscriptions ───
      subscribeToRealtime: () => {
        const { user } = get()
        if (!user) return () => {}

        const channel = supabase.channel('student-realtime')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          }, (payload) => {
            const msg = payload.new as Message
            const { activeConversation } = get()
            if (msg.sender_id !== user.id) {
              if (msg.conversation_id === activeConversation) {
                set(s => ({ messages: [...s.messages, msg] }))
              }
              // Play notification sound
              try { new Audio('/notification.mp3').play().catch(() => {}) } catch {}
            }
          })
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            const notif = payload.new as Notification
            set(s => ({
              notifications: [notif, ...s.notifications],
              unreadCount: s.unreadCount + 1
            }))
          })
          .subscribe()

        return () => { supabase.removeChannel(channel) }
      }
    }),
    {
      name: 'ela-pt-student-auth',
      partialize: (state) => ({
        // Only persist session-related data, not full data arrays
        profile: state.profile
      })
    }
  )
)
