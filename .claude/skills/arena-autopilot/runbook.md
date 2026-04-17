# ARENA Autopilot — Runbook

Spesifik senaryolar icin adim adim script'ler. Kullanici bunlari yazsa bile buraya bakip ayni sekilde cevaplarsin.

---

## 1. "Yeni component ekle: X"

```
1. src/components/<scope>/X.tsx olustur
   - import { motion } from 'framer-motion'
   - import { useTranslation } from '../../locales'
   - const { t } = useTranslation()
   - const { darkMode: dm } = useStore()
   - card class: "p-8 rounded-[2.5rem] border bg-bg-alt/40 border-white/5"
   - BlurText + StaggeredFadeUp reveal pattern

2. i18n 13 dosya icin key olustur:
   src/locales/*.ts -> X.title, X.subtitle, X.cta

3. Parent'a import + render ekle

4. typecheck + lint + build + commit + push
```

## 2. "Yeni sayfa ekle: /foo"

```
1. src/pages/<scope>/Foo.tsx
2. App.tsx'te lazy + Route ekle
3. SEO.tsx title/description/alternate for /foo
4. src/data/nav.ts'e menu entry (13 dil)
5. sitemap.xml + robots.txt regenerate
6. Pipeline calistir
```

## 3. "Yeni dil ekle: X"

```
1. src/locales/X.ts kopyala en.ts'den, 13->14 yap
2. tum icerigi cevir
3. src/locales/index.ts'e export ekle
4. src/stores/useStore.ts language union'a ekle
5. LanguageSwitcher'a bayrak + isim ekle
6. SEO.tsx hreflang alternate'e ekle
7. Pipeline calistir
```

## 4. "Renk temasini degistir"

```
1. src/config/tenant.ts -> colors objesi
2. tailwind.config.js -> theme.extend.colors
3. src/index.css -> :root --primary vb.
4. Dark mode variant: .dark --primary yeniden tanimla
5. Pipeline + screenshot diff
```

## 5. "Supabase tablo ekle"

```
1. supabase/migrations/YYYYMMDD_create_<name>.sql
2. RLS policy ekle
3. src/lib/supabase.ts -> typed client
4. src/stores/<name>.ts Zustand store
5. TypeScript types regenerate (npx supabase gen types)
6. Pipeline
```

## 6. "Lighthouse skoru dus"

```
1. npm run build
2. npx serve dist -p 4173
3. npx lighthouse http://localhost:4173 --output=json --quiet
4. Metrics oku, < 90 olani analiz et
5. LCP: preload hero image + font
6. CLS: img width/height zorunlu
7. TBT: code-split + defer non-critical
8. Pipeline
```

## 7. "SEO denetle"

```
1. SEO.tsx -> LocalBusiness + FAQPage JSON-LD var mi
2. Tum sayfalarda title < 60 char, description < 160
3. hreflang alternate 13 dil
4. canonical URL
5. og:image 1200x630 mevcut
6. sitemap.xml up-to-date
7. robots.txt allow + sitemap link
```

## 8. "Mobile test"

```
1. playwright mobile viewport (375x667)
2. src/pages/*.tsx tek tek goruntule
3. overflow-x YASAK -> fix
4. touch target min 44x44
5. font-size base 16px+
6. navbar sticky + safe-area-inset
```

## 9. "AI Council degisiklik"

```
1. src/lib/ai-council.ts primary/sekonder LLM router
2. CLAUDE_MODEL_PRIMARY=claude-opus-4-7
3. Fallback: claude-sonnet-4-6, haiku-4-5
4. src/pages/admin/*.tsx AI asistan call'larinda router kullan
5. .env ornek .env.example'a ekle
```

## 10. "Production hotfix"

```
1. git checkout -b hotfix/<mesaj>
2. Fix uygula + pipeline
3. git checkout main
4. git merge --no-ff hotfix/<mesaj>
5. git push origin main
6. CF Pages deploy monitor
7. Hotfix branch sil: git branch -D hotfix/<mesaj>
```

---

## Otomasyon Script: FIX_AND_PUSH.bat uretim mantigi

Windows tarafinda .bat dosyasi icin sablon:

```bat
@echo off
cd /d "%~dp0\pt"
echo [1/5] Lock temizle...
del /f /q .git\index.lock 2>nul
echo [2/5] Status:
git status --short
echo [3/5] Stage...
git add -A
echo [4/5] Commit...
git commit -m "<tip>(<scope>): <mesaj>"
echo [5/5] Push...
git push origin main
echo BASARILI
pause
```

## Otomasyon Script: build + verify

```bash
#!/usr/bin/env bash
set -e
cd /sessions/pensive-friendly-brahmagupta/mnt/PT/pt
npx tsc --noEmit
npx eslint src --max-warnings 5
npm run build
echo "Build OK. Size:"
du -sh dist/
echo "Sourcemap count:"
find dist/ -name "*.map" | wc -l
echo "Bundle hash:"
ls dist/assets/*.js | head -3
```
