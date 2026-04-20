# Nike Training Club — PWA + Workout UX Teardown

**URL:** https://www.nike.com/ntc-app + iOS/Android app
**Kategori:** Fitness uygulamasi, gamified workout library
**ARENA'da kopyalanacak:** Portal workout screen, video player, progression system

## Ne iyi yapiyorlar

1. **Workout kart anatomisi**
   - Ust: full-bleed image (antrenor yuzu degil, hareket snapshot'i)
   - Alt 3 satir: baslik, sure + difficulty + equipment, hover'da "start" buton
   - 3 dot rating yerine "Featured/Popular/New" etiketi — ezberlemesi kolay
   - ARENA: sezon/hafta/gun yapisini bu kart pattern'i ile goster

2. **"Coach mode" video player**
   - Video alt-sag'da mini picture-in-picture — kullanici ekrandan bakmadan antrenmanda
   - Audio-only toggle — kulaklik ile spor yaparken ekran kapali
   - Countdown overlay: "3, 2, 1, GO" buyuk text
   - Rest period: dairesel countdown + sonraki hareket onizleme
   - ARENA: `src/components/portal/WorkoutPlayer.tsx` — ayni pattern

3. **Progress tracking: streak + milestones**
   - Haftalik streak (7 consecutive days -> rozet)
   - Aylik milestone (20 antrenman -> "Strong Start" rozet)
   - Uzun-vadeli: 100 toplam antrenman -> "Centurion"
   - Rozet'ler social share-ready (Instagram story template ready)
   - ARENA: voleybol-specific rozet. "100 servis" / "50 smash drill" / "1000 dakika sahada"

4. **Offline-first PWA**
   - Video download: ust sag'da bulut-ikonu -> "download for offline"
   - Quality secim: 480p/720p/1080p — veri tasarrufu
   - IndexedDB ile session state persist
   - Service worker ile video cache (max 500MB, LRU eviction)
   - ARENA: VolleyballWorkouts low-signal saha icin offline critical

5. **Athlete takeover hafta**
   - Her hafta 1 NBA/NFL yildizi "custom workout" yonlendiriyor
   - Intro video + 3-5 custom exercise — sosyal kanit + reach
   - ARENA: Voleybol Milli Takim oyuncusu + yerel efsaneler ile rotasyon

6. **Breathing + recovery section**
   - "5-min reset" gibi kisa recovery oturumlari
   - Ambient ses + gorsel (ocean, forest) — mindfulness entegrasyonu
   - ARENA: "mac oncesi 3-dakika zihin hazirligi" icin aynen al

## Teknik pattern

- React + React Native shared component library (Yoga layout)
- Video: HLS adaptive bitrate streaming (hls.js web'de, native'de AVFoundation)
- Workout state: useReducer + Redux Persist (7gun streak, mevcut session)
- Offline: Workbox + IndexedDB (video blob cache)
- Push: OneSignal ile "yarinki antrenman 09:00" reminder
- Analytics: Amplitude + Firebase A/B

## ARENA PWA gereksinimi

**Mevcut:** `vite-plugin-pwa` yuklu, manifest var
**Eksik:**
- Video cache stratejisi
- Streak tracking (stores/workoutStore.ts'da day_streak alani yok)
- Rozet sistemi (stores/achievementStore.ts yok)
- Background sync (saat offline streak sayimi)

**Yeni dosyalar:**
```
src/stores/workoutStore.ts       # mevcut, extend et
src/stores/achievementStore.ts   # YENI
src/stores/streakStore.ts        # YENI
src/lib/offline/videoCache.ts    # YENI — IDB wrapper
src/components/portal/
  WorkoutCard.tsx                # mevcut, refactor
  WorkoutPlayer.tsx              # YENI
  CountdownOverlay.tsx           # YENI
  RestPeriod.tsx                 # YENI
  AchievementToast.tsx           # YENI
  StreakFlame.tsx                # YENI
```

## Workout player ornek

```tsx
// src/components/portal/WorkoutPlayer.tsx
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface Props {
  videoSrc: string // m3u8 HLS or mp4 fallback
  exercises: Array<{ name: string; duration: number; rest: number }>
  onComplete: () => void
}

export function WorkoutPlayer({ videoSrc, exercises, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<'exercise' | 'rest'>('exercise')
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.duration ?? 0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (videoSrc.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, maxBufferLength: 30 })
      hls.loadSource(videoSrc)
      hls.attachMedia(v)
      return () => hls.destroy()
    }
    v.src = videoSrc
  }, [videoSrc])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (phase === 'exercise') {
            setPhase('rest')
            return exercises[currentIdx].rest
          }
          const nextIdx = currentIdx + 1
          if (nextIdx >= exercises.length) {
            onComplete()
            return 0
          }
          setCurrentIdx(nextIdx)
          setPhase('exercise')
          return exercises[nextIdx].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, currentIdx, exercises, onComplete])

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        {currentIdx + 1} / {exercises.length}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {timeLeft <= 3 && phase === 'exercise' && (
          <span className="text-white text-9xl font-bold">{timeLeft}</span>
        )}
      </div>
    </div>
  )
}
```

## Streak sistemi ornek

```ts
// src/stores/streakStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StreakState {
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
  recordCompletion: () => { streakNow: number; milestone: string | null }
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      recordCompletion: () => {
        const today = new Date().toISOString().split('T')[0]
        const last = get().lastCompletedDate
        let streak = get().currentStreak

        if (!last) streak = 1
        else {
          const diff = Math.floor(
            (new Date(today).getTime() - new Date(last).getTime()) / 86_400_000,
          )
          if (diff === 0) return { streakNow: streak, milestone: null }
          if (diff === 1) streak += 1
          else streak = 1
        }

        const longest = Math.max(streak, get().longestStreak)
        let milestone: string | null = null
        if ([7, 30, 100, 365].includes(streak)) milestone = `streak_${streak}`

        set({ currentStreak: streak, longestStreak: longest, lastCompletedDate: today })
        return { streakNow: streak, milestone }
      },
    }),
    { name: 'arena-streak' },
  ),
)
```

## Kacinilmasi gereken tuzaklar

- **Streak reset bug** — timezone bozulunca yillik streak sifirlanabilir. ISO date + user timezone ile hesapla
- **Offline video 2GB+** — iOS Safari 50MB kota, quality 480p default yap
- **HLS 4G'de buffer** — `startLevel: -1` auto-ABR, ilk kalite 720p'den baslayamayacagin dusuk bagalanta
- **Rozet spam** — hafta icinde 20 rozet gosterme. Batch at night, morning'de tek toast

## Olcum

- **Weekly active users (WAU):** hedef %55-65 (fitness apps benchmark %35-50)
- **Session length:** 12-18 dakika target
- **Streak retention:** 7-day streak'e ulasanlar %40 longer retention gostermeli
- **Offline usage %:** voleybol/futbol saha kullanimi icin %25+ target

## Kaynaklar

- https://www.nike.com/ntc-app
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- https://github.com/video-dev/hls.js (MIT)
- https://vite-pwa-org.netlify.app (plugin docs)
- https://web.dev/offline-cookbook/
