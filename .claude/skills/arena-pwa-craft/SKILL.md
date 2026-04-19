---
name: arena-pwa-craft
description: ARENA Performance PWA operasyon playbook. vite-plugin-pwa, workbox cache stratejileri, offline fallback, install prompt, update notification, push notification (Web Push + VAPID), background sync, app manifest optimizasyonu, iOS add-to-home-screen, badge API. Tetikleyici: "pwa", "service worker", "offline", "install", "manifest", "push notification", "workbox", "cache", "background sync", "web push".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × PWA Craft

vite-plugin-pwa ile production-grade progressive web app. Hedef kullanici: portal'daki sporcu — offline workout logu, push hatirlatma, install prompt.

## 0) Current Stack

`vite.config.ts` icinde:
- registerType: `autoUpdate`
- navigateFallback: `offline.html`
- skipWaiting + clientsClaim
- Runtime caching: Google Fonts (CacheFirst, 1y) + images (SWR)

## 1) Cache Stratejileri

| Strateji | Ne zaman |
|---|---|
| CacheFirst | Imza degismeyen: fonts, logo, static asset |
| StaleWhileRevalidate | Cok degisen ama yavas OK: news, product list |
| NetworkFirst | Taze data kritik: user profile, dashboard |
| NetworkOnly | Real-time: live workout sync |
| CacheOnly | Offline-first static: help docs |

### Extended config

```ts
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  navigateFallback: 'offline.html',
  navigateFallbackDenylist: [/^\/api/, /^\/auth/, /^\/admin/],
  runtimeCaching: [
    // Supabase data — NetworkFirst, kisa timeout
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Supabase Storage signed URL — kisa TTL
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'supabase-storage',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts',
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    // CDN images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'images', expiration: { maxEntries: 500 } },
    },
  ],
}
```

## 2) Offline Fallback

`public/offline.html` tasarim:
- ARENA marka renkleri
- Tekrar dene butonu (`window.location.reload()`)
- Son senkron zamani (localStorage'dan)
- Cachelenmis menu link'leri

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Cevrimdisi - ARENA</title>
  <style>
    body { font-family: system-ui; background: #FAF6F1; color: #0A0A0A; text-align: center; padding: 2rem; }
    h1 { color: #C2684A; }
    button { background: #C2684A; color: white; padding: 0.75rem 1.5rem; border: 0; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>ARENA</h1>
  <p>Cevrimdisisiniz. Baglanti kurulunca tekrar deneriz.</p>
  <button onclick="location.reload()">Tekrar Dene</button>
  <script>
    // Network gelince otomatik yenile
    window.addEventListener('online', () => location.reload())
  </script>
</body>
</html>
```

## 3) Update Flow

Kullaniciya yeni version indigini bildirin — zorlamayin:

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) { /* optional: schedule check */ },
    onRegisterError(e) { console.error('SW reg failed', e) },
  })

  if (!needRefresh[0]) return null
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-xl">
      <p>{t.pwa.updateAvailable}</p>
      <button onClick={() => updateServiceWorker(true)}>{t.pwa.refresh}</button>
      <button onClick={() => needRefresh[1](false)}>{t.pwa.later}</button>
    </div>
  )
}
```

## 4) Install Prompt (A2HS)

```tsx
function useInstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  useEffect(() => {
    const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', onBIP)
    return () => window.removeEventListener('beforeinstallprompt', onBIP)
  }, [])

  async function promptInstall() {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome === 'accepted'
  }

  return { canInstall: !!deferred, promptInstall }
}
```

UX: ikinci ziyarette / 30sn+ engagement sonrasi goster. Ilk ziyarette RAHATSIZ ETME.

iOS Safari: `beforeinstallprompt` YOK. Manuel talimat goster (`Share` > `Add to Home Screen`).

## 5) Manifest Optimizasyonu

`vite.config.ts` manifest:
```ts
manifest: {
  id: 'arena-performance',
  name: 'ARENA Performance',
  short_name: 'ARENA',
  description: 'Elit Voleybol & Performans Sistemi',
  theme_color: '#050505',
  background_color: '#FAF6F1',
  display: 'standalone',
  display_override: ['window-controls-overlay', 'standalone'],
  orientation: 'portrait',
  lang: 'tr',
  dir: 'ltr',
  scope: '/',
  start_url: '/?source=pwa',
  categories: ['sports', 'health', 'fitness'],
  icons: [
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  screenshots: [
    { src: 'screenshots/portal-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide' },
    { src: 'screenshots/portal-narrow.png', sizes: '720x1280', type: 'image/png', form_factor: 'narrow' },
  ],
  shortcuts: [
    { name: 'Workout Log', url: '/portal?tab=log', icons: [{ src: 'icon-log.png', sizes: '96x96' }] },
    { name: 'Coach Chat', url: '/portal?tab=chat', icons: [{ src: 'icon-chat.png', sizes: '96x96' }] },
  ],
}
```

## 6) Push Notification (Web Push)

### VAPID key uret
```bash
npx web-push generate-vapid-keys
```

### Service worker'a handler ekle
`public/sw-push.ts` (vite-plugin-pwa injectManifest mode):

```js
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'ARENA', {
      body: data.body,
      icon: '/pwa-192x192.png',
      badge: '/badge.png',
      image: data.image,
      tag: data.tag,
      data: { url: data.url },
      actions: data.actions,
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      const client = cs.find(c => c.url.includes(url))
      return client ? client.focus() : clients.openWindow(url)
    })
  )
})
```

### Subscribe client
```ts
async function subscribe(userId: string) {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY,
  })
  await supabase.from('push_subscriptions').upsert({
    user_id: userId,
    endpoint: sub.endpoint,
    keys: sub.toJSON().keys,
  })
}
```

### Server push (Supabase Edge Function)
```ts
import webpush from 'npm:web-push@3'
webpush.setVapidDetails('mailto:support@arena.tr', VAPID_PUB, VAPID_PRIV)
await webpush.sendNotification(subscription, JSON.stringify({ title, body, url }))
```

## 7) Background Sync (offline workout log)

```js
// SW
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workouts') {
    event.waitUntil(syncPendingWorkouts())
  }
})

async function syncPendingWorkouts() {
  const db = await openDB('arena-offline', 1)
  const pending = await db.getAll('workouts')
  for (const w of pending) {
    const res = await fetch('/api/workouts', { method: 'POST', body: JSON.stringify(w) })
    if (res.ok) await db.delete('workouts', w.id)
  }
}
```

Client:
```ts
const reg = await navigator.serviceWorker.ready
await reg.sync.register('sync-workouts')
```

## 8) Badge API (Android/Windows)

```ts
if ('setAppBadge' in navigator) {
  navigator.setAppBadge(unreadCount)
}
// clear
navigator.clearAppBadge?.()
```

## 9) File Handling API (ilerisi)

Manifest `file_handlers`:
```json
{
  "file_handlers": [
    { "action": "/import", "accept": { "text/csv": [".csv"] } }
  ]
}
```

## 10) Web Share API

```ts
async function shareProgress(progress: { text: string; url: string }) {
  if (navigator.share) {
    await navigator.share({ title: 'ARENA', text: progress.text, url: progress.url })
  } else {
    navigator.clipboard.writeText(`${progress.text}\n${progress.url}`)
  }
}
```

## 11) Debug

- Chrome DevTools > Application > Manifest (warnings?)
- Service Workers tab (update / unregister)
- Cache Storage (entries + size)
- `chrome://inspect/#service-workers` — butun register'li SW'lar
- Lighthouse PWA audit — `manifest valid + installable + SW active`

## 12) Common Gotchas

- Cache busting: Vite hash'li filename otomatik; SW precache'i temizler
- Stale SW: `skipWaiting` + `clientsClaim` var ama kullanici hala eski tab'de — UpdatePrompt sor
- iOS Safari push: iOS 16.4+ **sadece** home-screen PWA'da (tarayicida YOK)
- Range request (video): workbox rangeRequests config gerekli
- HTTPS zorunlu (localhost haric)
- `start_url` app trafik izolasyonu icin `?source=pwa` eklensin

## 13) Test Checklist

- [ ] Lighthouse PWA score 100
- [ ] Offline mode: critical sayfalar calisir
- [ ] Install prompt Android Chrome ve desktop Chrome
- [ ] iOS Add-to-Home-Screen — splash + icon dogru
- [ ] Update prompt gosteriliyor (yeni build deploy et, tab yenile)
- [ ] Push notification: subscribe + receive + click → dogru route
- [ ] Background sync: offline'da workout kaydet, online'da otomatik push

## 14) Analitik

PWA-specific metrik:
- Install rate: beforeinstallprompt → accepted %
- Standalone session: `window.matchMedia('(display-mode: standalone)').matches`
- Offline session: `navigator.onLine === false` iken goruntuleme
- Push opt-in rate

```ts
if (window.matchMedia('(display-mode: standalone)').matches) {
  analytics.track('pwa_launch')
}
```

## 15) White-label Uyum

Tenant kendi brand'iyle PWA satacagi icin:
- manifest icin tenant-config.json'dan name/color override
- icon'lar tenant bucket'indan yuklenir (build time)
- scope ve start_url tenant subdomain'ine gore

## 16) Red Flags

- `cache.add(url)` — asla unhashed asset, stale risk
- `skipWaiting` + sw update policy'siz → kullanici mid-action kirilir
- Push subscription endpoint'ini plaintext logla YASAK (PII)
- iOS icin `apple-touch-icon.png` yoksa logo kotu gorunur

---

Hedef: Lighthouse PWA 100, first install prompt > 15%, push opt-in > 30%.
