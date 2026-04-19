---
name: arena-form-craft
description: ARENA Performance form playbook'u. react-hook-form 7, zod 3 schema validasyonu, i18n'li hata mesajlari, async validation (Supabase uniqueness), multi-step wizard, conditional fields, file upload with preview, dirty tracking + unsaved changes warning, optimistic UI, error recovery. Tetikleyici: "form", "validation", "zod", "react-hook-form", "multi-step", "wizard", "schema", "input", "required", "submit".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Form Craft

react-hook-form + zod + i18n uclusu. Hedef: 0 invalid submission, hizli UX, WCAG AA.

## 0) Temel Setup

```ts
// src/lib/form.ts
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export { z, zodResolver, useForm }
```

## 1) Zod Schema + i18n

```ts
import { z } from 'zod'
import { t } from '@/lib/i18n'

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'errors.required' }).email({ message: 'errors.email' }),
  password: z.string().min(8, { message: 'errors.passwordMin' }),
})

export type LoginInput = z.infer<typeof loginSchema>
```

Render'da `message` key'ini `t.errors.required` gibi cevir:

```tsx
<span role="alert">{t(errors.email?.message)}</span>
```

Parameter'li mesaj:
```ts
z.string().min(8, { message: JSON.stringify({ key: 'errors.min', params: { n: 8 } }) })
// render: const { key, params } = JSON.parse(msg); format(t(key), params)
```

## 2) Form Hook Pattern

```tsx
export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: LoginInput) => {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) throw error
    navigate('/portal')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">{t.form.email}</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-err' : undefined}
        {...register('email')}
      />
      {errors.email && <p id="email-err" role="alert">{t(errors.email.message)}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.form.submitting : t.form.submit}
      </button>
    </form>
  )
}
```

## 3) Async Validation (Supabase Uniqueness)

```ts
const registerSchema = z.object({
  email: z.string().email(),
})

// RHF custom validate (async)
const { register } = useForm({
  resolver: zodResolver(registerSchema),
})

<input
  {...register('email', {
    validate: async (value) => {
      const { data } = await supabase.from('profiles').select('id').eq('email', value).maybeSingle()
      return data ? 'errors.emailTaken' : true
    },
  })}
/>
```

Debounce: 500ms delay once kullaniciyi bos birakma.

## 4) Multi-step Wizard

```tsx
const steps = ['personal', 'goals', 'payment', 'confirm'] as const

function Wizard() {
  const [step, setStep] = useState(0)
  const form = useForm<WizardInput>({
    resolver: zodResolver(wizardSchema),
    mode: 'onBlur',
  })

  const next = async () => {
    const fields = stepFields[steps[step]]
    const valid = await form.trigger(fields)
    if (valid) setStep(s => Math.min(s + 1, steps.length - 1))
  }

  return (
    <FormProvider {...form}>
      <ol aria-label={t.wizard.progress}>
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined}>{t.wizard[s]}</li>
        ))}
      </ol>
      {step === 0 && <PersonalStep />}
      {step === 1 && <GoalsStep />}
      {step === 2 && <PaymentStep />}
      {step === 3 && <ConfirmStep />}
      <nav>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
          {t.wizard.back}
        </button>
        <button onClick={next}>{t.wizard.next}</button>
      </nav>
    </FormProvider>
  )
}
```

## 5) Conditional Fields

```tsx
const subscribed = useWatch({ name: 'subscribed' })
{subscribed && <input {...register('plan')} />}
```

## 6) File Upload with Preview

```tsx
const [preview, setPreview] = useState<string>()
const { register, setValue } = useForm<AvatarInput>()

const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2_000_000) { setError('file', { message: 'errors.fileMax2MB' }); return }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    setError('file', { message: 'errors.fileType' }); return
  }
  setValue('file', file)
  setPreview(URL.createObjectURL(file))
}

// cleanup
useEffect(() => () => { preview && URL.revokeObjectURL(preview) }, [preview])
```

## 7) Dirty Tracking + Unsaved Warning

```tsx
const { formState: { isDirty } } = useForm()

useEffect(() => {
  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) { e.preventDefault(); e.returnValue = '' }
  }
  window.addEventListener('beforeunload', onBeforeUnload)
  return () => window.removeEventListener('beforeunload', onBeforeUnload)
}, [isDirty])

// react-router v6+
import { useBlocker } from 'react-router-dom'
const blocker = useBlocker(({ currentLocation, nextLocation }) =>
  isDirty && currentLocation.pathname !== nextLocation.pathname
)
```

## 8) Optimistic UI

```ts
const save = async (data: WorkoutInput) => {
  const temp = { ...data, id: crypto.randomUUID(), _optimistic: true }
  setLocal(prev => [...prev, temp])
  try {
    const { data: saved } = await supabase.from('workouts').insert(data).select().single()
    setLocal(prev => prev.map(w => w.id === temp.id ? saved : w))
  } catch (e) {
    setLocal(prev => prev.filter(w => w.id !== temp.id))
    toast.error(t.errors.saveFailed)
  }
}
```

## 9) Error Recovery

- Network hatasi: "Tekrar dene" button + retry count
- Server hatasi: hata kodunu localize et; kullaniciya ne yapacagini soyle
- Validation hatasi: focus'u ilk invalid field'a al

```ts
onSubmit = async (data) => {
  try {
    await save(data)
  } catch (e) {
    const first = Object.keys(errors)[0]
    if (first) document.getElementById(first)?.focus()
  }
}
```

## 10) Rich Input Types

### Phone (intl)
`react-phone-number-input` + zod `libphonenumber-js`.

```ts
import { isValidPhoneNumber } from 'libphonenumber-js'
const schema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: 'errors.phone' }),
})
```

### Date range
`react-day-picker` + zod:
```ts
date: z.object({
  from: z.date(),
  to: z.date(),
}).refine(d => d.to >= d.from, { message: 'errors.dateRange' })
```

### OTP 6-digit
```tsx
<input inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" {...register('code')} />
```

## 11) Accessibility

- Her input `<label htmlFor>` ile baglanir
- Hata `aria-describedby` + `role="alert"`
- Submit disabled durumu: `aria-disabled="true"` + `title` hint
- Required: `required` attribute (server side tekrar valide edilmeli)
- Error summary top (multi-error form): `<ul role="alert">`

## 12) Server-side Double Validation

Client validation sadece UX icin. Server (Supabase edge function veya RPC) tekrar validate eder:

```ts
// edge function
const result = loginSchema.safeParse(await req.json())
if (!result.success) return new Response(JSON.stringify(result.error), { status: 400 })
```

## 13) Submit Throttle

```ts
const [lastSubmit, setLastSubmit] = useState(0)
const onSubmit = async (data) => {
  if (Date.now() - lastSubmit < 2000) return toast.error(t.errors.tooFast)
  setLastSubmit(Date.now())
  // ...
}
```

## 14) Payment Form (PCI hint)

Asla kart numarasi dogrudan toplama. Stripe Elements / iyzico inline.

```tsx
<CardElement options={{ style: { base: { color: '#0A0A0A' } } }} />
// kayit at sunucuda: paymentMethodId only
```

## 15) Red Flags

- `onChange` mode butun form'da → render cost
- Controlled + defaultValue karistir → warning
- `.trim()` unutma (email eslesmesi kirar)
- `zod.string()` default nullable degildir — `optional()` ekle
- File upload'da `accept` attribute yok → os buttondan her sey secilir

## 16) Checklist

- [ ] Schema zod + infer type kullan
- [ ] Tum hata mesajlari i18n key
- [ ] `autoComplete` attribute
- [ ] `inputMode` mobile klavye
- [ ] Submit pending state
- [ ] `aria-invalid` + `aria-describedby`
- [ ] Focus trap if in modal
- [ ] Keyboard submit (Enter)
- [ ] Server-side validation mirror
- [ ] Analytics event (form_start, form_submit, form_error)

---

Hedef: tum form'larda bounce < %15, completion > %85, error rate < %5.
