# TB12 — Program Funnel + Assessment-to-Plan Teardown

**URL:** https://tb12sports.com
**Kategori:** Elite atletik performans markasi, Tom Brady's method
**ARENA'da kopyalanacak:** assessment quiz -> plan recommendation -> paywall conversion flow

## Ne iyi yapiyorlar

1. **"Take the TB12 Method" CTA — quiz giris kapisi**
   - Homepage hero'nun CTA'si "Start Your Assessment" (urun listesi degil)
   - Kullanici urun secmeden once 7-9 soruluk fiziksel durum/hedef quiz cozuyor
   - Quiz sonunda "Recommended Plan: Rookie / Champion / Hall of Fame"
   - Psikoloji: kullanici urun hakkinda degil, kendi ihtiyaci hakkinda karar verdi -> satin alma reddi dusuk
   - ARENA: "Voleybol Seviye Testi" + "AI ile hedef kisisellestirme" -> plan onerisi

2. **Quiz UX — bir seferde tek soru, progress bar**
   - Her soru full-viewport, 3-4 buton secenegi (metin degil, ikon + kart)
   - Ust'te "2 / 8" progress + yesil dolum
   - "Back" ikon sag alt (soft: onceki cevabini degistirmek mumkun)
   - Sorular kademeli:
     1. Hedefin nedir? (performance / recovery / weight-loss / rehab)
     2. Yasin kac? (16-25, 26-35, 36-50, 50+)
     3. Haftada kac gun antrenman yapiyorsun?
     4. Spor yapiyor musun? (hangi brans)
     5. Mevcut yaralanma/agri? (var/yok)
     6. Ne kadar zaman ayirabilirsin?
     7. Rakip/takim var mi? (solo / takim / yaris)
   - ARENA voleybol-specific: mevki (setter/spiker/libero), yas grubu, takim/bireysel, hedef (milli takim/bolgesel/fitness), antrenman ekipmani

3. **Plan presentation — 3 level (aynen pricing pattern)**
   - Rookie ($49/ay)     — temel video + ebook + 1 coach Q&A
   - Champion ($99/ay)   — **"Most Popular"** — video + personalized plan + biweekly video call
   - Hall of Fame ($249/ay) — 1-on-1 antrenor + gear + retreat erisimi
   - Orta tier'a "Best match for you" etiketi ekleniyor (quiz cevaplarina gore)
   - Sosyal kanit: "68% of users in your category choose Champion"
   - ARENA: Starter / Pro / Elite ile ayni ama ortayi quiz sonucuna gore kisisellestir

4. **Money-back guarantee framing**
   - "Cancel anytime. 30-day refund if you don't see progress"
   - Bu mesaj checkout basinda, sepet gorunmeden ONCE
   - "Progress tracked in app" -> iade gerceklesmezse bile kullanici app'i acar -> engagement
   - ARENA: TR market icin cayma hakki + "performance improvement guarantee" kombinasyonu

5. **Coach credential badges**
   - "Designed with Tom Brady's trainers" — isim + yuz + NFL yillari
   - "Applied by 2000+ pro athletes"
   - "NIH-published recovery protocols"
   - ARENA: "Mehmet Kozbeyli Akademisi ortakligi" + "Milli Takim oyunculari kullandi" + "Saglik Bakanligi icin onayli" (gelecek)

6. **Email capture BEFORE result**
   - Quiz son sorunun ardindan: "Get your personalized plan — enter email"
   - Sonuc sayfasi sadece email verdikten sonra acilir
   - Buyuk email-list buyume + gated result = komitman arttirici
   - ARENA: legal-compliant consent checkbox (KVKK) + marketing email onay (optional)

7. **"Start free trial" CTA yerine "Reserve your plan"**
   - Scarcity dili: "Only 5 Champion slots left this week" (dinamik countdown)
   - Gercekten slot sayisi yok ama psikolojik trigger
   - DIKKAT: TR Reklam Kurulu/KVKK icin 'gercek kisitlama' ifadesi yasak. Alternatif: "Haftalik yeni uyelik kontejani" kullan

## Teknik pattern

- Next.js 14 + server components (quiz state URL search params, paylasilabilir)
- Tailwind + Radix UI (accessible questions + progress)
- Stripe Checkout session + Stripe Tax
- Email capture: HubSpot Forms embed
- Analytics: Segment -> Amplitude (quiz-complete, plan-view, checkout-start, trial-start events)
- AB test: Optimizely (quiz vs direct pricing LP)

## ARENA icin kopyalama plani

**Rota:** `/assessment` -> 7-soruluk quiz -> `/assessment/sonuc?plan=...` -> `/fiyatlar?recommended=...`

**Yeni dosyalar:**
```
src/pages/AssessmentPage.tsx
src/components/assessment/
  QuizContainer.tsx          # state + routing
  QuizQuestion.tsx           # tek soru renderer
  QuizProgress.tsx           # ust progress bar
  QuizResult.tsx             # plan recommendation card
  QuizEmailGate.tsx          # email capture before result
src/data/assessmentQuestions.ts  # quiz akis konfigurasyonu
src/stores/assessmentStore.ts    # Zustand: answers, currentStep, email
src/lib/assessment/
  scoring.ts                 # cevap -> plan mapping
  eventTracking.ts           # PostHog events
```

## Quiz container ornek

```tsx
// src/components/assessment/QuizContainer.tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAssessmentStore } from '@/stores/assessmentStore'
import { QUIZ_QUESTIONS } from '@/data/assessmentQuestions'
import { scoreAnswers } from '@/lib/assessment/scoring'
import { trackQuizEvent } from '@/lib/assessment/eventTracking'
import { QuizQuestion } from './QuizQuestion'
import { QuizProgress } from './QuizProgress'
import { QuizEmailGate } from './QuizEmailGate'
import { QuizResult } from './QuizResult'

export function QuizContainer() {
  const { answers, currentStep, email, setAnswer, setStep, setEmail } =
    useAssessmentStore()
  const [phase, setPhase] = useState<'quiz' | 'email' | 'result'>('quiz')
  const totalQuestions = QUIZ_QUESTIONS.length

  useEffect(() => {
    trackQuizEvent('assessment_started')
  }, [])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswer(questionId, value)
    trackQuizEvent('assessment_answered', { questionId, value })

    const next = currentStep + 1
    if (next >= totalQuestions) {
      setPhase('email')
      trackQuizEvent('assessment_email_gate_reached')
    } else {
      setStep(next)
    }
  }

  const handleEmailSubmit = (value: string) => {
    setEmail(value)
    setPhase('result')
    trackQuizEvent('assessment_completed', {
      recommendedPlan: scoreAnswers(answers),
    })
  }

  if (phase === 'email') {
    return <QuizEmailGate onSubmit={handleEmailSubmit} />
  }

  if (phase === 'result') {
    return <QuizResult answers={answers} email={email} />
  }

  const question = QUIZ_QUESTIONS[currentStep]

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      <QuizProgress current={currentStep + 1} total={totalQuestions} />
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            <QuizQuestion
              question={question}
              onAnswer={(v) => handleAnswer(question.id, v)}
              onBack={currentStep > 0 ? () => setStep(currentStep - 1) : undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
```

## Quiz questions data

```ts
// src/data/assessmentQuestions.ts
export type QuizOption = { value: string; labelKey: string; iconKey?: string }
export type QuizQuestion = {
  id: string
  labelKey: string
  helpKey?: string
  options: QuizOption[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'goal',
    labelKey: 'assessment.goal.q',
    options: [
      { value: 'milli_takim', labelKey: 'assessment.goal.milli_takim', iconKey: 'flag' },
      { value: 'universite', labelKey: 'assessment.goal.universite', iconKey: 'cap' },
      { value: 'bolgesel',    labelKey: 'assessment.goal.bolgesel',    iconKey: 'map' },
      { value: 'fitness',     labelKey: 'assessment.goal.fitness',     iconKey: 'dumbbell' },
    ],
  },
  {
    id: 'age',
    labelKey: 'assessment.age.q',
    options: [
      { value: '10-13', labelKey: 'assessment.age.10_13' },
      { value: '14-16', labelKey: 'assessment.age.14_16' },
      { value: '17-20', labelKey: 'assessment.age.17_20' },
      { value: '21+',   labelKey: 'assessment.age.21plus' },
    ],
  },
  {
    id: 'position',
    labelKey: 'assessment.position.q',
    options: [
      { value: 'setter',    labelKey: 'assessment.position.setter',    iconKey: 'pass' },
      { value: 'spiker',    labelKey: 'assessment.position.spiker',    iconKey: 'spike' },
      { value: 'libero',    labelKey: 'assessment.position.libero',    iconKey: 'shield' },
      { value: 'middle',    labelKey: 'assessment.position.middle',    iconKey: 'block' },
      { value: 'belirsiz',  labelKey: 'assessment.position.belirsiz' },
    ],
  },
  {
    id: 'experience',
    labelKey: 'assessment.experience.q',
    options: [
      { value: 'yeni',         labelKey: 'assessment.experience.yeni' },
      { value: 'amator',       labelKey: 'assessment.experience.amator' },
      { value: 'okul_takimi',  labelKey: 'assessment.experience.okul_takimi' },
      { value: 'kulup',        labelKey: 'assessment.experience.kulup' },
    ],
  },
  {
    id: 'frequency',
    labelKey: 'assessment.frequency.q',
    options: [
      { value: '1-2', labelKey: 'assessment.frequency.1_2' },
      { value: '3-4', labelKey: 'assessment.frequency.3_4' },
      { value: '5-6', labelKey: 'assessment.frequency.5_6' },
      { value: '7+',  labelKey: 'assessment.frequency.7plus' },
    ],
  },
  {
    id: 'injury',
    labelKey: 'assessment.injury.q',
    options: [
      { value: 'yok',       labelKey: 'assessment.injury.yok' },
      { value: 'eski',      labelKey: 'assessment.injury.eski' },
      { value: 'mevcut',    labelKey: 'assessment.injury.mevcut' },
    ],
  },
  {
    id: 'commitment',
    labelKey: 'assessment.commitment.q',
    options: [
      { value: '15-30',  labelKey: 'assessment.commitment.15_30' },
      { value: '30-60',  labelKey: 'assessment.commitment.30_60' },
      { value: '60-90',  labelKey: 'assessment.commitment.60_90' },
      { value: '90+',    labelKey: 'assessment.commitment.90plus' },
    ],
  },
]
```

## Scoring engine

```ts
// src/lib/assessment/scoring.ts
export type Plan = 'starter' | 'pro' | 'elite'

const PLAN_WEIGHTS: Record<string, Plan> = {
  // Hedef
  milli_takim: 'elite',
  universite:  'pro',
  bolgesel:    'pro',
  fitness:     'starter',
  // Deneyim
  yeni:         'starter',
  amator:       'starter',
  okul_takimi:  'pro',
  kulup:        'elite',
  // Sikligi
  '1-2': 'starter',
  '3-4': 'pro',
  '5-6': 'pro',
  '7+':  'elite',
  // Komitman
  '15-30': 'starter',
  '30-60': 'pro',
  '60-90': 'pro',
  '90+':   'elite',
}

export function scoreAnswers(answers: Record<string, string>): Plan {
  const score: Record<Plan, number> = { starter: 0, pro: 0, elite: 0 }
  for (const value of Object.values(answers)) {
    const plan = PLAN_WEIGHTS[value]
    if (plan) score[plan] += 1
  }
  // Injury override: 'mevcut' -> starter (onerilen rehab yolu)
  if (answers.injury === 'mevcut') return 'starter'
  // Top score wins, tie -> pro (orta fiyat kanca)
  const entries = Object.entries(score) as Array<[Plan, number]>
  entries.sort((a, b) => b[1] - a[1])
  const [top, second] = entries
  if (top[1] === second[1]) return 'pro'
  return top[0]
}
```

## Email gate

```tsx
// src/components/assessment/QuizEmailGate.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onSubmit: (email: string) => void
}

export function QuizEmailGate({ onSubmit }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && consent

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isValid) onSubmit(email)
        }}
        className="w-full max-w-md space-y-5 rounded-3xl border border-neutral-200 bg-white/80 p-8 backdrop-blur"
      >
        <h2 className="text-2xl font-semibold text-neutral-900">
          {t('assessment.email.heading')}
        </h2>
        <p className="text-sm text-neutral-600">{t('assessment.email.subtitle')}</p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('assessment.email.placeholder') ?? ''}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base focus:border-[#C2684A] focus:outline-none focus:ring-2 focus:ring-[#C2684A]/20"
        />

        <label className="flex items-start gap-3 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#C2684A] focus:ring-[#C2684A]"
          />
          <span>{t('assessment.email.consent')}</span>
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-xl bg-[#C2684A] px-5 py-3 font-semibold text-white transition hover:bg-[#A8553A] disabled:opacity-40"
        >
          {t('assessment.email.cta')}
        </button>
      </form>
    </div>
  )
}
```

## Result page — plan recommendation

```tsx
// src/components/assessment/QuizResult.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { scoreAnswers, type Plan } from '@/lib/assessment/scoring'
import { trackQuizEvent } from '@/lib/assessment/eventTracking'

const PLAN_COPY: Record<Plan, { labelKey: string; blurbKey: string; priceKey: string }> = {
  starter: { labelKey: 'pricing.starter.name', blurbKey: 'assessment.result.starter',  priceKey: 'pricing.starter.price' },
  pro:     { labelKey: 'pricing.pro.name',     blurbKey: 'assessment.result.pro',      priceKey: 'pricing.pro.price' },
  elite:   { labelKey: 'pricing.elite.name',   blurbKey: 'assessment.result.elite',    priceKey: 'pricing.elite.price' },
}

interface Props {
  answers: Record<string, string>
  email: string
}

export function QuizResult({ answers, email }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const plan = scoreAnswers(answers)
  const copy = PLAN_COPY[plan]

  useEffect(() => {
    trackQuizEvent('assessment_result_view', { plan, email })
  }, [plan, email])

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#7A9E82]">
        {t('assessment.result.eyebrow')}
      </p>
      <h1 className="text-4xl font-bold text-neutral-900 md:text-5xl">
        {t(copy.labelKey)}
      </h1>
      <p className="mt-6 text-lg text-neutral-600">{t(copy.blurbKey)}</p>

      <div className="mt-10 inline-flex items-baseline gap-2 rounded-full bg-[#FAF6F1] px-6 py-3">
        <span className="text-3xl font-bold text-[#C2684A]">{t(copy.priceKey)}</span>
        <span className="text-sm text-neutral-500">{t('pricing.perMonth')}</span>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => navigate(`/fiyatlar?recommended=${plan}`)}
          className="rounded-xl bg-[#C2684A] px-8 py-3 font-semibold text-white transition hover:bg-[#A8553A]"
        >
          {t('assessment.result.cta_primary')}
        </button>
        <button
          onClick={() => navigate('/fiyatlar')}
          className="rounded-xl border border-neutral-300 px-8 py-3 font-medium text-neutral-700 transition hover:border-neutral-900"
        >
          {t('assessment.result.cta_secondary')}
        </button>
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        {t('assessment.result.guarantee')}
      </p>
    </section>
  )
}
```

## i18n anahtarlari (13 locale)

```json
// locales/tr/assessment.json
{
  "assessment": {
    "goal": {
      "q": "Arena yolculugundaki ana hedefin ne?",
      "milli_takim": "Milli Takim seviyesi",
      "universite":  "Universite / burslu spor",
      "bolgesel":    "Bolgesel lig / kulup",
      "fitness":     "Fitness ve kendine guven"
    },
    "email": {
      "heading":    "Kisisel planini gor",
      "subtitle":   "E-postani gir, sana ozel onerimizi gonderelim.",
      "placeholder":"ornek@eposta.com",
      "consent":    "KVKK aydinlatma metnini okudum. Kisisel plan onerisi ve egitim iceriklerini almayi kabul ediyorum.",
      "cta":        "Planimi goster"
    },
    "result": {
      "eyebrow":      "Sana Onerilen",
      "starter":      "Temellerden baslayan, her gun kucuk adimlarla ilerleyen plan.",
      "pro":          "Gelisen sporcu icin optimum ritim — haftalik antrenman + beslenme + analiz.",
      "elite":        "Rekabetin zirvesi icin — bire-bir kocluk, takvim analizi, veri izleme.",
      "cta_primary":  "Plani satin al",
      "cta_secondary":"Tum planlari goster",
      "guarantee":    "30 gun icinde istediginde iptal et. Fark yoksa iade garantisi."
    }
  }
}
```

## Scoring test vektorleri

```ts
// src/lib/assessment/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest'
import { scoreAnswers } from '../scoring'

describe('scoreAnswers', () => {
  it('elite cevaplarin hepsi elite verir', () => {
    expect(scoreAnswers({
      goal: 'milli_takim', experience: 'kulup', frequency: '7+', commitment: '90+',
    })).toBe('elite')
  })
  it('starter cevaplarin hepsi starter verir', () => {
    expect(scoreAnswers({
      goal: 'fitness', experience: 'yeni', frequency: '1-2', commitment: '15-30',
    })).toBe('starter')
  })
  it('injury mevcut -> starter (rehab)', () => {
    expect(scoreAnswers({
      goal: 'milli_takim', frequency: '7+', injury: 'mevcut',
    })).toBe('starter')
  })
  it('dengeli esitlikte pro onerir (orta kanca)', () => {
    expect(scoreAnswers({
      goal: 'fitness', experience: 'kulup',
    })).toBe('pro')
  })
})
```

## Kacinilmasi gereken tuzaklar

- **Email-gate cok erken** — 2. sorunun ardindan email istemek abandon rate'i %60+ yapar. TB12 son soru + 7. questiondan sonra istiyor, ayni sirayi koru
- **Scarcity yalani** — "5 slot kaldi" TR Reklam Kurulu'nda yasak (dezenformasyon). "Yeni uye basvuru penceresi" gibi yumusak dil
- **Quiz'i skip edilemez yapma** — zorunlu quiz kullaniciyi kacirir. Sag ust'te kucuk "skip" link'i: direkt `/fiyatlar`
- **Sonuc paylasiminda email otomatik gonder** — Supabase edge function + SMTP, 30 saniye icinde email atma beklentisi kir
- **Back button kirilmali degil** — browser back'e quiz state persist. Zustand `persist` middleware ile URL search params senkronu

## Olcum

- **Quiz start -> complete conversion:** hedef %65+ (TB12 %72 raporluyor)
- **Email gate -> enter rate:** hedef %55+
- **Result view -> plan click:** hedef %35+
- **Checkout convert:** hedef %18+ (quiz path'ta directfrom-pricing 2x)
- **Events:** `assessment_started`, `assessment_answered`, `assessment_email_gate_reached`, `assessment_completed`, `assessment_result_view`, `assessment_cta_click`

## A/B test onerileri

1. Quiz 5 soru vs 8 soru (kisa version conversion artirir mi?)
2. Email gate before vs after result (TB12 before kullaniyor — doğrula)
3. Recommended plan highlight vs tum 3 planlar equal (hangi daha yuksek revenue?)
4. TR market: sorular arasi voleybol gorseli vs jenerik fitness gorseli

## Kaynaklar

- https://tb12sports.com (canli)
- https://www.hotjar.com/blog/quiz-funnel (quiz funnel best-practice)
- https://github.com/typeform/quiz-funnel-template (OSS MIT benzer implementation)
- https://posthog.com/tutorials/funnels (funnel analytics)
- CAC/LTV benchmarks: https://davidcummings.org/2014/08/17/saas-customer-acquisition-cost/
