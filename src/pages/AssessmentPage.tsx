// ARENA Assessment — 7 soruluk voleybol degerlendirme + plan onerisi.
// /assessment -> /assessment/result (commit -> email gate + final reveal)

import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../locales'
import { useAssessment } from '../stores/useAssessment'
import { QUIZ, type PlanKey } from '../data/assessmentQuiz'
import FadeUpSection from '../components/premium/FadeUpSection'
import SEO from '../components/SEO'

// ───────────────────────── helpers ─────────────────────────

type TranslationDict = ReturnType<typeof useTranslation>['t']

type AssessmentDict = {
  title?: string
  subtitle?: string
  cta?: {
    start?: string
    next?: string
    back?: string
    submit?: string
    restart?: string
    book?: string
  }
  progress?: string
  email?: {
    title?: string
    subtitle?: string
    placeholder?: string
    consent?: string
    privacy?: string
    submit?: string
    required?: string
    invalid?: string
  }
  result?: {
    title?: string
    starter?: { name?: string; desc?: string; price?: string; features?: string[] }
    pro?: { name?: string; desc?: string; price?: string; features?: string[] }
    elite?: { name?: string; desc?: string; price?: string; features?: string[] }
  }
  questions?: Record<string, { label?: string; choices?: Record<string, string> }>
}

function getAssessmentDict(t: TranslationDict): AssessmentDict {
  const maybe = (t as unknown as { assessment?: AssessmentDict }).assessment
  return maybe ?? {}
}

// ───────────────────────── progress ─────────────────────────

function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.min(100, Math.round((step / total) * 100))
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="h-1.5 bg-text-main/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 text-xs text-text-main/50 text-center tabular-nums">
        {step} / {total}
      </p>
    </div>
  )
}

// ───────────────────────── question card ─────────────────────────

interface QuestionProps {
  questionId: string
  multi?: boolean
  choices: { id: string; score: number }[]
  dict: AssessmentDict
  value: string[]
  onChange: (ids: string[]) => void
}

function QuestionCard({ questionId, multi, choices, dict, value, onChange }: QuestionProps) {
  const qDict = dict.questions?.[questionId]
  const label = qDict?.label ?? questionId

  const toggle = (id: string) => {
    if (multi) {
      const next = value.includes(id) ? value.filter((x) => x !== id) : [...value, id].slice(0, 2)
      onChange(next)
    } else {
      onChange([id])
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5">
      <h2 className="text-2xl md:text-3xl font-semibold text-text-main mb-2 text-center tracking-tight">
        {label}
      </h2>
      <p className="text-sm text-text-main/50 mb-8 text-center">
        {multi ? (dict.cta?.next ? '' : '') : null}
      </p>

      <div className="grid gap-3">
        {choices.map((c) => {
          const selected = value.includes(c.id)
          const cLabel = qDict?.choices?.[c.id] ?? c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              aria-pressed={selected}
              className={[
                'group w-full text-left px-5 py-4 rounded-2xl',
                'backdrop-blur-xl transition-all duration-300',
                'border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                selected
                  ? 'bg-primary/10 border-primary/60 text-text-main shadow-[0_8px_32px_rgba(194,104,74,0.18)]'
                  : 'bg-white/40 dark:bg-white/[0.03] border-text-main/10 hover:border-primary/40 text-text-main/80 hover:text-text-main',
              ].join(' ')}
            >
              <span className="flex items-center gap-3">
                <span
                  className={[
                    'inline-flex w-5 h-5 rounded-full border-2 items-center justify-center shrink-0 transition-colors',
                    selected ? 'border-primary bg-primary' : 'border-text-main/25',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <span className="flex-1 text-base leading-snug">{cLabel}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ───────────────────────── email gate ─────────────────────────

function EmailGate({
  dict,
  email,
  consent,
  onEmail,
  onConsent,
  onSubmit,
  error,
}: {
  dict: AssessmentDict
  email: string
  consent: boolean
  onEmail: (v: string) => void
  onConsent: (v: boolean) => void
  onSubmit: () => void
  error?: string
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="max-w-md mx-auto px-5"
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-text-main mb-2 text-center tracking-tight">
        {dict.email?.title ?? 'Planini al'}
      </h2>
      <p className="text-sm text-text-main/60 mb-8 text-center">
        {dict.email?.subtitle ?? ''}
      </p>

      <label className="block mb-4">
        <span className="sr-only">E-mail</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          placeholder={dict.email?.placeholder ?? 'you@example.com'}
          className={[
            'w-full px-4 py-3 rounded-xl',
            'bg-white/60 dark:bg-white/[0.04] border',
            error ? 'border-red-500/60' : 'border-text-main/15',
            'text-text-main placeholder:text-text-main/40',
            'focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60',
          ].join(' ')}
        />
      </label>

      <label className="flex items-start gap-3 mb-6 text-xs text-text-main/60 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary"
        />
        <span>{dict.email?.consent ?? ''}</span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!email || !consent}
        className={[
          'w-full px-6 py-3.5 rounded-xl font-semibold transition-all',
          'bg-primary text-white shadow-[0_10px_30px_rgba(194,104,74,0.35)]',
          'hover:shadow-[0_14px_40px_rgba(194,104,74,0.45)] hover:-translate-y-0.5',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        ].join(' ')}
      >
        {dict.email?.submit ?? 'Planini goster'}
      </button>
    </form>
  )
}

// ───────────────────────── result ─────────────────────────

const PLAN_ACCENTS: Record<PlanKey, { grad: string; ring: string; badge: string }> = {
  starter: {
    grad: 'from-sand/40 via-sand/20 to-transparent',
    ring: 'ring-sand/40',
    badge: 'bg-sand/20 text-sand',
  },
  pro: {
    grad: 'from-secondary/40 via-secondary/20 to-transparent',
    ring: 'ring-secondary/40',
    badge: 'bg-secondary/20 text-secondary',
  },
  elite: {
    grad: 'from-primary/50 via-primary/25 to-transparent',
    ring: 'ring-primary/50',
    badge: 'bg-primary/20 text-primary',
  },
}

function Result({
  plan,
  dict,
  onRestart,
}: {
  plan: PlanKey
  dict: AssessmentDict
  onRestart: () => void
}) {
  const planDict = dict.result?.[plan] ?? {}
  const planName = planDict.name ?? plan
  const planDesc = planDict.desc ?? ''
  const planPrice = planDict.price ?? ''
  const features = planDict.features ?? []
  const accent = PLAN_ACCENTS[plan]

  return (
    <div className="max-w-2xl mx-auto px-5">
      <div
        className={[
          'relative overflow-hidden rounded-3xl p-8 md:p-12',
          'bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl',
          'ring-1',
          accent.ring,
          'shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
        ].join(' ')}
      >
        <div className={`absolute -inset-px -z-10 bg-gradient-to-br ${accent.grad} blur-2xl`} />

        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${accent.badge}`}
        >
          {plan}
        </span>

        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-text-main tracking-tight">
          {planName}
        </h2>

        {planPrice && (
          <p className="mt-2 text-text-main/70 tabular-nums text-lg">{planPrice}</p>
        )}

        {planDesc && (
          <p className="mt-4 text-text-main/70 leading-relaxed">{planDesc}</p>
        )}

        {features.length > 0 && (
          <ul className="mt-6 grid gap-2.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main/80">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="/#programs"
            className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-center bg-primary text-white shadow-[0_10px_30px_rgba(194,104,74,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(194,104,74,0.45)] transition-all"
          >
            {dict.cta?.book ?? 'Randevu al'}
          </a>
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-3.5 rounded-xl font-semibold border border-text-main/15 text-text-main/80 hover:text-text-main hover:border-text-main/30 transition-colors"
          >
            {dict.cta?.restart ?? 'Tekrar degerlendir'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────── main page ─────────────────────────

export default function AssessmentPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dict = getAssessmentDict(t)

  const {
    step,
    selections,
    email,
    consent,
    result,
    start,
    setChoice,
    next,
    back,
    reset,
    setEmail,
    setConsent,
    commit,
  } = useAssessment()

  const totalSteps = QUIZ.length + 1 // +1 = email gate
  const isEmailStep = step === QUIZ.length
  const isResultStep = step > QUIZ.length

  useEffect(() => {
    if (!result && step === 0 && Object.keys(selections).length === 0) start()
  }, [result, step, selections, start])

  const currentQ = QUIZ[step]
  const currentChoices = useMemo(() => (currentQ ? currentQ.choices : []), [currentQ])
  const currentValue = currentQ ? selections[currentQ.id] ?? [] : []
  const canAdvance = currentQ ? currentValue.length > 0 : true

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleEmailSubmit = () => {
    if (!emailValid || !consent) return
    commit()
    next()
  }

  const handleRestart = () => {
    reset()
    start()
  }

  // ── render guards

  const title = dict.title ?? 'ARENA Degerlendirme'
  const subtitle = dict.subtitle ?? ''

  return (
    <div className="min-h-screen bg-bg text-text-main">
      <SEO title={title} description={subtitle} />

      <header className="pt-24 md:pt-28 pb-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-text-main/50 hover:text-text-main/80 tracking-[0.2em] uppercase transition-colors"
        >
          ARENA
        </button>
        <FadeUpSection delay={0.05}>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 max-w-xl mx-auto text-text-main/60 text-sm md:text-base px-5">
              {subtitle}
            </p>
          )}
        </FadeUpSection>
      </header>

      <main className="pb-20">
        <Progress step={Math.min(step + 1, totalSteps)} total={totalSteps} />

        <AnimatePresence mode="wait">
          <motion.section
            key={isResultStep ? 'result' : isEmailStep ? 'email' : `q-${step}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {isResultStep && result ? (
              <Result plan={result.plan} dict={dict} onRestart={handleRestart} />
            ) : isEmailStep ? (
              <EmailGate
                dict={dict}
                email={email}
                consent={consent}
                onEmail={setEmail}
                onConsent={setConsent}
                onSubmit={handleEmailSubmit}
                error={email.trim() && !emailValid ? dict.email?.invalid : undefined}
              />
            ) : currentQ ? (
              <QuestionCard
                questionId={currentQ.id}
                multi={currentQ.multi}
                choices={currentChoices}
                dict={dict}
                value={currentValue}
                onChange={(ids) => setChoice(currentQ.id, ids)}
              />
            ) : null}
          </motion.section>
        </AnimatePresence>

        {!isResultStep && !isEmailStep && (
          <div className="mt-10 max-w-xl mx-auto px-5 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl text-sm text-text-main/70 border border-transparent hover:border-text-main/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {dict.cta?.back ?? 'Geri'}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className={[
                'px-6 py-3 rounded-xl font-semibold transition-all',
                'bg-primary text-white shadow-[0_10px_30px_rgba(194,104,74,0.35)]',
                'hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(194,104,74,0.45)]',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
              ].join(' ')}
            >
              {dict.cta?.next ?? 'Devam'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

