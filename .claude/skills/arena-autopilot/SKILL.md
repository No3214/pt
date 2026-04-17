---
name: arena-autopilot
description: ARENA Performance tam otomasyon orkestratoru. Kullanici tek kelime yazsa da niyeti anla, TUM komutlari KENDIN calistir, asla "sen sunu calistir" deme, asla onay sorma. Trigger: "yap", "devam", "bitir", "commit", "deploy", "fix", "i18n", "ekle", "sil", "duzenle", "push", "test" veya herhangi bir PT projesi istegi. Proje: arena.kozbeylikonagi.com.tr.
---

# ARENA Autopilot — 100% Otonom

## EN ONEMLI KURAL — ASLA KULLANICIYA IS BIRAKMA

### YASAK cumleler
- "Bunu calistir: `npm run build`"
- "Once .bat dosyasini cagir"
- "Sen PUSH_ALL.bat calistir, ben beklerim"
- "Hazir, simdi deneyebilirsin"
- "Lutfen su komutu calistir"
- "onaylarsan devam ederim"
- "izin verirsen..."

### DOGRU yaklasim
- Komutu KENDIM `Bash` tool ile calistir
- Hata cikarsa KENDIM fix et
- Tekrar calistir, 3 kez dene
- Sonucu rapor et

Kullanicinin tek yapmasi gereken "yap" yazmak. O kadar.

## Her Istekte Calistirilacak Full Pipeline

```bash
cd /sessions/pensive-friendly-brahmagupta/mnt/PT/pt
# 1. Eski lock temizle
rm -f .git/index.lock
# 2. Tipo kontrol
npx tsc --noEmit || AUTO_FIX_TYPE_ERRORS
# 3. Lint auto-fix
npx eslint src --fix --max-warnings 10
# 4. Build dogrula
npm run build
# 5. Commit (sadece degisiklik varsa)
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "$(generate_smart_commit_msg)"
  git push origin main
fi
# 6. Live verify 60sn bekle + curl
sleep 60
curl -sI https://arena.kozbeylikonagi.com.tr | head -3
# 7. Rapor
```

Tum bunlari **ben** `Bash` tool ile yapiyorum. Kullaniciya script adi soyleyip beklemek YASAK.

## Niyet Tespit (Turkce tek kelime -> tam senaryo)

| Kelime | Yapilacak |
|---|---|
| "yap" / "devam" | Son mesajlardaki bekleyen isi bitir + full pipeline |
| "hayir" / "dur" | Devam etme, son durumu ozetle |
| "tekrar" | Son calistirdigim komutu tekrar calistir |
| "geri al" | `git reset --soft HEAD~1` + degisiklikleri geri getir |
| "neden" | Son karari Turkce 2 cumle aciklar |
| "ne oldu" | Git log son 5 commit + prod durum |

## Hata Senaryolarinda Ne Yaparim

### TypeScript hatasi
```bash
npx tsc --noEmit 2>&1 | tee /tmp/tsc.log
# Hatalari oku, dosya-satir tespit et
# Edit tool ile fix
# Yeniden calistir
```

### ESLint hatasi
```bash
npx eslint src --fix
# Kalan warning'leri oku, elle fix
# `any` -> `unknown` + guard
# react-hooks/exhaustive-deps -> useCallback ile sarmala
# react-refresh/only-export-components -> non-component'leri ayri dosyaya
```

### Build hatasi
```bash
npm run build 2>&1 | tail -50
# Vite error -> vite.config.ts incele
# Import hatasi -> path duzelt
# Memory hatasi -> NODE_OPTIONS=--max-old-space-size=4096
```

### Git commit hatasi (nothing to commit)
- Bu hata DEGIL, "is zaten yapilmis" demek
- Git log son commit'i goster, live URL'i ver, bitirdim de

### Git push hatasi (rejected)
```bash
git fetch origin main
git rebase origin/main       # conflict yoksa
# conflict varsa: git rebase --abort + merge stratejisi
git push origin main
```

### Windows encoding bozulmasi (NUL bytes)
```bash
file src/path/file.tsx     # "data" ise corrupt
git show HEAD:src/path/file.tsx > /tmp/fix.tsx
cat /tmp/fix.tsx > src/path/file.tsx    # overwrite in place
```

### NPM cache bozuldu
```bash
rm -rf node_modules/.vite
npm ci
```

### CF Pages deploy gecikmesi
60sn sonra hala yeni hash yok ise:
```bash
# Cloudflare API ile deployment tetikle (token varsa .env'de)
# Yoksa rapor: "Deploy bekliyor, 2 dakika icinde canli olur"
```

## Commit Mesaji Auto-Generate

Git diff'i oku, dosya yollarini cikar, type/scope belirle:

| Dosya patterni | Type | Scope |
|---|---|---|
| `src/locales/*` | fix veya feat | i18n |
| `src/components/landing/*` | feat veya style | landing |
| `src/components/portal/*` | feat | portal |
| `src/components/admin/*` | feat | admin |
| `src/pages/*` | feat | routes |
| `src/stores/*` | refactor | store |
| `src/lib/*` | refactor veya feat | lib |
| `*.md` | docs | <filename> |
| `package.json` | chore | deps |
| `vite.config.ts` / `tailwind.config.js` | chore | config |
| `supabase/migrations/*` | feat | db |
| `.github/workflows/*` | ci | actions |

Mesaj kalib: `<type>(<scope>): <imperative mesaj 50 char>`

## i18n 13 Dil Otomasyonu

Yeni metin eklerken bu scripti **KENDIM** calistir:

```bash
cd src/locales
# TR metni var, diger 12'ye ekle
for lang in en es fr de it pt ru zh ja ar ko hi; do
  # Edit tool ile $lang.ts'ye key ekle
  # Spor/fitness tonu, kisa, direkt
done
```

Dil sirasi: TR -> EN -> ES -> FR -> DE -> IT -> PT -> RU -> ZH -> JA -> AR -> KO -> HI

## Deploy Verify (sormadan yaparim)

```bash
sleep 60
LIVE_HASH=$(curl -s https://arena.kozbeylikonagi.com.tr | grep -oE 'assets/index-[a-f0-9]+\.js' | head -1)
LOCAL_HASH=$(ls dist/assets/index-*.js 2>/dev/null | head -1 | grep -oE 'index-[a-f0-9]+')
if [ "$LIVE_HASH" != *"$LOCAL_HASH"* ]; then
  echo "Deploy henuz propagate olmadi, 2 dakika daha bekle"
  sleep 120
fi
```

## Iletisim Tonu

- Emoji: YASAK
- Disclaimer: YASAK
- Soru: YASAK (ondan ne yapmasini istedigini anlamak icin bile sorma, context'ten cikar)
- Uzun aciklama: YASAK
- "Bitti. Live: <hash> 43sn." tarzi rapor

## Sadece Soyle Su 4 Manuel Is

Teknik olarak kullanicinin hesabinda yapilmasi ZORUNLU olan:
1. Cloudflare Dashboard -> Pages -> Custom Domain ekle
2. DNS provider -> CNAME `arena` -> `<proje>.pages.dev`
3. Supabase RLS policy onay (hassas tablolar)
4. GitHub secrets rotation (3 ayda bir)

Bu 4'u bile ilk kez yapildiginda tarif veririm, sonra tekrar etmezsin zaten.

## Ornek: Kullanici "yap" yazdi

1. Son 3 mesaji oku -> "lint cleanup + commit bekliyor"
2. TodoList'e bak -> "in_progress" item var mi?
3. `git status --short` -> modified dosyalar
4. Plan cikar: typecheck + build + commit + push + verify
5. **Hepsini KENDIM calistir**
6. Rapor: "Tamam. Commit abc1234, 0 hata, live 47sn"

Yaninda "simdi sen `PUSH_ALL.bat` calistir" DEME. Ben calistirdim zaten.
