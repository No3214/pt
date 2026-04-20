// ARENA Assessment Quiz - 7-question voleybol odakli plan recommendation
// Score: starter (0-14), pro (15-24), elite (25+); injury override -> starter.

export type PlanKey = 'starter' | 'pro' | 'elite'

export interface QuizChoice {
  /** i18n key suffix under assessment.questions.<qid>.choices */
  id: string
  /** base score when chosen */
  score: number
  /** overrides the final plan decision (e.g. current injury -> starter) */
  override?: PlanKey
}

export interface QuizQuestion {
  /** i18n key suffix under assessment.questions */
  id: string
  /** allow multi-select (max 2) for question types like "history" */
  multi?: boolean
  choices: QuizChoice[]
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'goal',
    choices: [
      { id: 'performance',   score: 5 },
      { id: 'national',      score: 6 },
      { id: 'rehab',         score: 2 },
      { id: 'fitness',       score: 3 },
    ],
  },
  {
    id: 'age',
    choices: [
      { id: 'u14',   score: 2 },
      { id: 'u18',   score: 4 },
      { id: 'adult', score: 5 },
      { id: 'over30',score: 3 },
    ],
  },
  {
    id: 'position',
    choices: [
      { id: 'outside', score: 4 },
      { id: 'opposite',score: 4 },
      { id: 'setter',  score: 5 },
      { id: 'middle',  score: 5 },
      { id: 'libero',  score: 3 },
      { id: 'none',    score: 2 },
    ],
  },
  {
    id: 'experience',
    choices: [
      { id: 'beginner',     score: 1 },
      { id: 'recreational', score: 3 },
      { id: 'club',         score: 5 },
      { id: 'elite',        score: 6 },
    ],
  },
  {
    id: 'frequency',
    choices: [
      { id: 'lt2',  score: 1 },
      { id: '2to3', score: 3 },
      { id: '4to5', score: 5 },
      { id: '6plus',score: 6 },
    ],
  },
  {
    id: 'injury',
    choices: [
      { id: 'none',     score: 3 },
      { id: 'past',     score: 2 },
      { id: 'current',  score: 0, override: 'starter' },
    ],
  },
  {
    id: 'commitment',
    choices: [
      { id: '1to3', score: 1 },
      { id: '4to6', score: 3 },
      { id: '6plus',score: 5 },
    ],
  },
]

export interface ScoreResult {
  plan: PlanKey
  total: number
  /** per-question choice ids for recap + analytics */
  selections: Record<string, string[]>
  /** was an override applied (e.g. current injury -> starter) */
  override?: PlanKey
}

/**
 * Compute plan from selected choice ids per question.
 * Tie-break: at 14/15 boundary -> pro (so borderline athletes get uplift).
 */
export function scoreQuiz(selections: Record<string, string[]>): ScoreResult {
  let total = 0
  let override: PlanKey | undefined

  for (const q of QUIZ) {
    const chosen = selections[q.id] ?? []
    for (const choiceId of chosen) {
      const c = q.choices.find((x) => x.id === choiceId)
      if (!c) continue
      total += c.score
      if (c.override) override = c.override
    }
  }

  const plan: PlanKey = override
    ? override
    : total >= 25
    ? 'elite'
    : total >= 15
    ? 'pro'
    : 'starter'

  return { plan, total, selections, override }
}
