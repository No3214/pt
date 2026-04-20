// ARENA Assessment quiz store — persisted, isolated from main useStore.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QUIZ, scoreQuiz, type ScoreResult } from '../data/assessmentQuiz'

interface AssessmentState {
  step: number
  selections: Record<string, string[]>
  email: string
  consent: boolean
  result: ScoreResult | null
  startedAt: number | null
  completedAt: number | null

  start: () => void
  setChoice: (questionId: string, choiceIds: string[]) => void
  next: () => void
  back: () => void
  reset: () => void
  setEmail: (email: string) => void
  setConsent: (consent: boolean) => void
  commit: () => ScoreResult
}

export const useAssessment = create<AssessmentState>()(
  persist(
    (set, get) => ({
      step: 0,
      selections: {},
      email: '',
      consent: false,
      result: null,
      startedAt: null,
      completedAt: null,

      start: () => set({ startedAt: Date.now(), step: 0, selections: {}, result: null, completedAt: null }),

      setChoice: (questionId, choiceIds) =>
        set((s) => ({ selections: { ...s.selections, [questionId]: choiceIds } })),

      next: () => set((s) => ({ step: Math.min(s.step + 1, QUIZ.length) })),

      back: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),

      reset: () =>
        set({
          step: 0,
          selections: {},
          email: '',
          consent: false,
          result: null,
          startedAt: null,
          completedAt: null,
        }),

      setEmail: (email) => set({ email }),

      setConsent: (consent) => set({ consent }),

      commit: () => {
        const { selections } = get()
        const result = scoreQuiz(selections)
        set({ result, completedAt: Date.now() })
        return result
      },
    }),
    {
      name: 'arena-assessment',
      partialize: (s) => ({
        selections: s.selections,
        email: s.email,
        consent: s.consent,
        result: s.result,
        step: s.step,
      }),
    }
  )
)
