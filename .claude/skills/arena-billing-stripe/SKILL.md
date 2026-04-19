---
name: arena-billing-stripe
description: ARENA Performance icin Stripe + iyzico (TR) billing playbook. Subscription plans, trial, upgrade/downgrade, proration, customer portal, invoicing, webhook handler (idempotent), tax (IOSS/VAT/KDV), dunning management, failed-payment recovery, usage-based metering (active users/storage), refund policy, revenue reporting (MRR/ARR/churn). Monetization-ready. Tetikleyici: "billing", "stripe", "iyzico", "subscription", "payment", "odeme", "abonelik", "fatura", "invoice", "trial", "cancel", "refund", "mrr", "proration".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Billing Playbook

Hedef: 1 gun icinde para akisi basla; 0 payment bug production'da.

## 0) Neden Stripe + iyzico?

- **Stripe**: US/EU dunya standardi, iyi DX, tax, Strong Customer Auth (SCA)
- **iyzico**: Turkiye kart, 3D Secure, TL yerel odeme, alip-vermeye TR tuketici guveni

Recommendation: default Stripe (Subscription API); TR tenant icin iyzico opt-in.

## 1) Product / Price Setup

Stripe Dashboard:
- Product: "ARENA Pro"
- Price: `price_xxx_monthly` ($99/mo recurring, USD)
- Price: `price_xxx_yearly` ($950/yr, ~20% discount)
- Trial: 14 gun (metadata'ya ekle, price'a degil)

CLI:
```bash
stripe products create --name "ARENA Pro" --description "Pro tier ARENA"
stripe prices create --product prod_xxx --currency usd --unit-amount 9900 --recurring[interval]=month
```

## 2) Subscription Create Flow

### Client side
```tsx
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

// Form
const handleSubmit = async () => {
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement(CardElement)!,
    billing_details: { email, name },
  })
  if (error) return setError(error.message)
  
  const { clientSecret, subscriptionId } = await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId: paymentMethod.id, priceId, tenantId }),
  }).then(r => r.json())

  const result = await stripe.confirmCardPayment(clientSecret)
  if (result.error) setError(result.error.message)
  else navigate('/welcome')
}
```

### Server (Supabase Edge Function)
```ts
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })

Deno.serve(async (req) => {
  const { paymentMethodId, priceId, tenantId } = await req.json()
  const { data: tenant } = await supabaseAdmin.from('tenants').select('*').eq('id', tenantId).single()

  // Customer yarat / ara
  const customer = tenant.stripe_customer_id
    ? await stripe.customers.retrieve(tenant.stripe_customer_id)
    : await stripe.customers.create({
        email: tenant.email,
        name: tenant.name,
        metadata: { tenantId },
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      })

  // Subscription yarat
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    trial_period_days: 14,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: { tenantId },
  })

  // DB'ye kaydet
  await supabaseAdmin.from('tenants').update({
    stripe_customer_id: customer.id,
    stripe_subscription_id: subscription.id,
    plan: 'pro',
    status: 'trial',
  }).eq('id', tenantId)

  return new Response(JSON.stringify({
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    subscriptionId: subscription.id,
  }))
})
```

## 3) Webhook Handler (idempotent)

```ts
// supabase/functions/stripe-webhook/index.ts
import Stripe from 'https://esm.sh/stripe@14?target=deno'
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (e) {
    return new Response('bad sig', { status: 400 })
  }

  // Idempotency: event.id'yi DB'ye yaz, daha once varsa skip
  const { data: existing } = await supabase.from('stripe_events').select('id').eq('id', event.id).maybeSingle()
  if (existing) return new Response('ok')
  await supabase.from('stripe_events').insert({ id: event.id, type: event.type })

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubUpdated(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.deleted':
      await handleSubCanceled(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice)
      break
    case 'customer.subscription.trial_will_end':
      await handleTrialEnding(event.data.object as Stripe.Subscription)
      break
  }

  return new Response('ok')
})

async function handleSubUpdated(sub: Stripe.Subscription) {
  const tenantId = sub.metadata.tenantId
  const status = sub.status === 'trialing' ? 'trial' :
                 sub.status === 'active' ? 'active' :
                 sub.status === 'past_due' ? 'past_due' : sub.status
  await supabase.from('tenants').update({
    status,
    plan: mapPriceIdToPlan(sub.items.data[0].price.id),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  }).eq('id', tenantId)
}
```

## 4) Customer Portal (Self-service)

```ts
const session = await stripe.billingPortal.sessions.create({
  customer: tenant.stripe_customer_id,
  return_url: `https://${tenant.slug}.arena.app/settings/billing`,
})
return new Response(JSON.stringify({ url: session.url }))
```

Portal'da kullanici: plan degistir / iptal et / kart guncelle / fatura indir.

## 5) Proration (upgrade mid-cycle)

```ts
await stripe.subscriptions.update(subId, {
  items: [{ id: itemId, price: newPriceId }],
  proration_behavior: 'always_invoice',
})
```

- `always_invoice`: farki hemen fatura et (upgrade'te standart)
- `create_prorations`: bir sonraki donem faturasina ekle
- `none`: proration yok (duz fiyat)

## 6) Trial Ending + Dunning

### Trial ending email (3 gun kala)
Webhook `trial_will_end` → email gonder. Kullaniciya:
1. Karti ekledi mi? Evet: nothing to do.
2. Ekelemedi: "Kart ekle, devam et" CTA.

### Payment Failed flow
1. `invoice.payment_failed` → tenant `status='past_due'`
2. UI: "Odeme basarisiz, guncelle" banner
3. 3 retry otomatik (Stripe default smart retry)
4. 14 gun sonra hala basarisiz → `subscription.deleted` → suspend

Settings → Subscription → Smart Retry schedule'i devreye al.

## 7) Tax / KDV / VAT

### Stripe Tax
```ts
const subscription = await stripe.subscriptions.create({
  automatic_tax: { enabled: true },
  ...
})
```

Tenant billing address'den otomatik:
- TR: KDV %20 (dijital hizmet)
- EU: VAT MOSS / IOSS
- US: Sales tax (nexus'a bagli)

### Invoice customization
- Tenant company name + vergi numarasi
- VAT ID: `tax_ids` array
- Tenant logo: invoice setting'te upload

## 8) Iyzico Alternative (TR)

```bash
npm i iyzipay
```

```ts
import Iyzipay from 'iyzipay'

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: 'https://api.iyzipay.com',
})

// Abonelik — iyzico subscription da var
iyzipay.subscriptionCheckoutForm.initialize({
  locale: 'tr',
  conversationId: tenantId,
  pricingPlanReferenceCode: 'pro-monthly',
  subscriptionInitialStatus: 'ACTIVE',
  customer: {
    name, surname, email, gsmNumber, identityNumber,
    billingAddress: { ... },
  },
  callbackUrl: 'https://arena.app/iyzico-callback',
})
```

Webhook: 3DS callback + success/failure.

## 9) Revenue Metrics

```sql
-- MRR
SELECT
  DATE_TRUNC('month', current_period_start) AS month,
  SUM(CASE WHEN interval = 'month' THEN unit_amount
           WHEN interval = 'year' THEN unit_amount / 12
      END) / 100.0 AS mrr_usd
FROM stripe_subscription_items
WHERE status IN ('active', 'trialing')
GROUP BY 1
ORDER BY 1;

-- Churn rate (canceled / start-of-month active)
WITH monthly AS (
  SELECT DATE_TRUNC('month', t) AS m,
    COUNT(*) FILTER (WHERE status = 'active') AS active,
    COUNT(*) FILTER (WHERE status = 'canceled') AS canceled
  FROM tenants
  GROUP BY 1
)
SELECT m, canceled::float / NULLIF(active, 0) AS churn FROM monthly;
```

## 10) Dashboard (Internal)

Super admin dashboard:
- MRR / ARR
- Active / Trial / Past Due / Canceled count
- Churn chart
- LTV estimation (MRR / churn rate)
- Top 10 tenants by revenue

## 11) Refund Policy

```ts
await stripe.refunds.create({
  payment_intent: paymentIntentId,
  reason: 'requested_by_customer',
})
```

Policy:
- 30 gun icinde tum ucret iadesi
- Yillik plan: kullanilmayan donem iadesi (proration)
- Disputes'a hizli cevap (Stripe evidence submission)

## 12) Usage-based Metering (Elite plan)

```ts
// Her active user sonunda:
await stripe.billing.meterEvents.create({
  event_name: 'arena_active_user',
  payload: {
    stripe_customer_id: tenant.stripe_customer_id,
    value: '1',
  },
})
```

Aylik toplam → threshold-based tier pricing.

## 13) PCI Compliance

- Stripe Elements kullaniyoruz → PCI scope minimum (SAQ-A)
- Kart verisi **asla** server'imiza ulasmaz
- `https://` zorunlu
- CSP header: `frame-src js.stripe.com hooks.stripe.com`

## 14) Multi-currency

```ts
stripe.prices.list({ product: prodId }) // her currency icin ayri price
```

TR tenant → TRY; EU → EUR; US → USD. Sayfada `useTenantCurrency()` ile goster.

## 15) Invoicing (Manuel)

Enterprise tenant bank transferle odemek isterse:
```ts
await stripe.invoices.create({
  customer: customerId,
  collection_method: 'send_invoice',
  days_until_due: 30,
  pending_invoice_items_behavior: 'include',
})
```

## 16) Test Kartlari

- `4242 4242 4242 4242` → success
- `4000 0025 0000 3155` → 3DS required
- `4000 0000 0000 9995` → insufficient funds (payment_failed webhook test)

## 17) Env Variables

```
STRIPE_SECRET_KEY=sk_test_... (sk_live_ prod)
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PK=pk_test_...
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
```

## 18) Hata Yonetimi

```ts
try {
  await stripe.subscriptions.create(...)
} catch (e) {
  if (e instanceof Stripe.errors.StripeCardError) {
    return { error: 'card_declined', code: e.code, message: e.message }
  }
  if (e instanceof Stripe.errors.StripeAPIError) {
    return { error: 'api', retry: true }
  }
  throw e // unexpected
}
```

## 19) Checklist

- [ ] Webhook secret configured
- [ ] Idempotency (event.id DB kayit)
- [ ] Test mode: 4242 success + decline test
- [ ] 3DS test (IT/ES cards)
- [ ] Trial ending email
- [ ] Failed payment email
- [ ] Cancel immediate vs period-end option
- [ ] Tenant suspend after 14-day past_due
- [ ] Receipt / invoice download
- [ ] Tax automatic enabled
- [ ] Customer portal return URL

## 20) Red Flags

- Webhook signature verification yok → fake payment accept
- `stripe.subscriptions.create` without `idempotency key` → duplicate sub
- Client-side price calculation → tamper
- Card data logging → PCI violation
- No dunning → silent churn
- Plan downgrade hemen → kullanici paralarini yakti hissi

---

Hedef: First 10 paying tenant 90 gun icinde. MRR $1k → $10k scale icin pipeline hazir.
