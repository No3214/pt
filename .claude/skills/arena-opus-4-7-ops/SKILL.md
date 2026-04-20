---
name: arena-opus-4-7-ops
description: Claude Opus 4.7 ile uzun-surecli, derin, autonomous is icin operasyon rehberi (auto mode, effort level, verification, focus mode, recaps, /fewer-permission-prompts). ARENA auto-elevate iterasyonlari icin tercih edilen konfigurasyon + Boris Cherny (@bcherny) tips tam metni. Kullanim: "opus 4.7 nasil kullanilir", "auto mode", "effort xhigh", "claude verification", "/go skill", "/simplify skill".
---

# ARENA + Claude Opus 4.7 Operasyon Rehberi

Boris Cherny'nin (Anthropic) paylastigi resmi Opus 4.7 tips'leri + ARENA auto-elevate is akisina adapte edilmis kullanim plani.

## TL;DR — ARENA icin onerilen konfigurasyon

```
mode:     auto (Shift+Tab)
effort:   xhigh (/effort xhigh)
focus:    off (auto-elevate intermediate work'i gorebilmek onemli)
recaps:   on (long-running isi takip etmek icin)
```

Parallel sessions: 3-4 es zamanli (bundle optimize + component build + teardown yaz + skill create).

## 1. Auto mode — permission prompt'lardan kurtulus

Opus 4.7 complex + long-running is icin cok guclu:
- deep research
- large refactor
- complex feature build
- performance benchmark'a ulasana kadar iterasyon

**Once:** her komut icin `--dangerously-skip-permissions` veya elle onay
**Simdi:** auto mode — model-based classifier safe komutlari otomatik approve ediyor

### ARENA'da kullanim
- Auto-elevate loop (iter 19, 20, 21...) Opus 4.7 auto mode'da akis kesmeden ilerler
- Parallel olarak 2. Claude session acip: marketing icerik + blog uret; 3. session: competitor teardown yaz
- Max/Teams/Enterprise plan gerekir

### Aktivasyon
- CLI: `Shift+Tab`
- Desktop / VSCode: dropdown -> Auto

## 2. `/fewer-permission-prompts` skill

Session history tarar, tekrar tekrar onay isteyen safe bash/MCP komutlarini tespit eder. Allowlist'e eklemeni onerir.

### ARENA icin degerli komutlar (allowlist'e eklenmeli)
```
npm run typecheck
npm run lint
npm run build
git status
git diff
git log
git add .claude/
git commit
ls src/
cat package.json
```

Bu sekilde auto-elevate iter'leri cok daha akici ilerler.

## 3. Recaps — kisa ozet "ne yapildi + ne sira"

```
Cogitated for 6m 27s

recap: Iter 20 tamamlandi — arena-gen-ai-stack skill commit'lendi (7fe4f42).
Siradaki: AssessmentPage route'unu src/pages/AssessmentPage.tsx olarak implement et.
```

### ARENA'da kullanim
- Her iter sonrasinda recap yazdir
- Uzun sessiz kaldigin sonra donusunde "recap" komutunu cagir
- `/config` ile disable edilebilir

## 4. Focus mode

Intermediate islem ciktilarini gizler, sadece final sonucu gosterir. Opus 4.7 guvenilirligi artti — artik her adimi izlemek sart degil.

### ARENA icin neden kapatmanin mantigi var
- Auto-elevate iterasyonlarinda intermediate ciktilari (typecheck output, build warnings, vb.) gormek lazim
- Bug'lari early catch etmek icin step visibility kritik
- PR/commit hazirlik asamasinda focus mode'a gec

```
/focus           # toggle
```

## 5. Effort level — thinking'in adaptif ayari

Opus 4.7 thinking budget yerine **effort level** kullaniyor:

| Level | Use case |
|---|---|
| low | Hizli lint fix, copy edit |
| medium | Component rename, simple bug |
| high | Yeni component, refactor |
| xhigh | **Boris'in default** — ARENA auto-elevate default |
| max | **Sadece mevcut session** — en zor mimari karar |

Max persist etmez — sadece o session. Digerleri gelecek session'a tasinir.

```
/effort xhigh    # ARENA auto-elevate icin default
/effort max      # buyuk refactor session'i icin
```

### ARENA cozumleri icin oneri
- iter x.1 (bundle optimize): `high`
- iter x.2 (component build): `high`
- iter x.3 (mimari karar / migration): `xhigh`
- iter x.4 (multi-system refactor, white-label launch): `max`

## 6. Verification — **en kritik tavsiye**

Claude'un isini dogrulayabilmesini sagla. **2x-3x kalite artisi** Boris'in raporu.

### ARENA verification altyapisi

**Backend:**
```
npm run dev             # vite dev server
supabase start          # lokal supabase
```
Edge functions icin ilgili curl / fetch komutu hazir tut.

**Frontend:**
Claude Chromium extension (browser control) kurulu -> Claude form gonderir, screenshot alir, console log'a bakar.

**Desktop:**
Computer use MCP zaten Cowork'te var.

**Visual regression:**
Playwright snapshot test (iter 26'da eklenebilir)

### `/go` skill — ARENA'ya port

Boris'in kullandigi `/go` pattern:
```
1. End-to-end test kendisi kosar (bash / browser / computer use)
2. /simplify skill'i calistirir
3. PR acar
```

ARENA icin **lokal equivalent** (`.claude/skills/arena-verify`): zaten iter 2'de yuklu. Her iter bitiminde:
```
npm run typecheck && npm run lint && npm run build
```

### Prompt pattern (Boris'inki)
```
Claude do blah blah /go
```

ARENA karsiligi:
```
iter 21: AssessmentPage route'unu implement et, /arena-verify
```

## 7. Parallel sessions

Opus 4.7 auto mode + parallel sessions = ciddi leverage.

### ARENA icin 3-session acilimi
1. **Session A** — kod (iter 21: AssessmentPage implement)
2. **Session B** — icerik (opendirectory GTM skill'ler ile blog post draft)
3. **Session C** — research (yeni competitor teardown — cal.com booking)

Her session bagimsiz calisir. Uc'u de Opus 4.7 xhigh + auto mode'da.

## 8. Session handoff (compact + resume)

Uzun session'dan cikinca:
- Memory file'lar (`.auto-memory/`) icin `consolidate-memory` skill
- Bir sonraki session'a TASKS.md + recent commits ile baglan

## ARENA auto-elevate skeleton (tekrarlanabilir)

```
1. /effort xhigh
2. Shift+Tab (auto mode on)
3. "Iter XX: <hedef>" mesaji gonder
4. Claude autonomous calisir
5. npm run typecheck / lint / build
6. git commit with conventional message
7. Recap yazdir
8. Siradaki iter'e gec veya session kapat
```

## Kaynaklar

- Boris Cherny: https://x.com/bcherny
- Anthropic Claude Code docs: https://docs.claude.com/claude-code
- Effort + thinking: https://docs.claude.com/en/docs/build-with-claude/extended-thinking
- Verification best practice: https://www.anthropic.com/engineering/claude-code-best-practices

## Ek: Boris Cherny tips — orijinal Ingilizce

> Boris Cherny (@bcherny) shared a few tips to get more out of Opus 4.7:
>
> 1) Auto mode = no more permission prompts
>
> Opus 4.7 is especially strong at complex, long-running tasks such as deep research, refactoring code, building complex features, and iterating until it reaches a performance benchmark.
>
> Previously, you either had to babysit the model during these long tasks or use --dangerously-skip-permissions.
>
> Auto mode was released as a safer alternative. In this mode, permission prompts are routed to a model-based classifier that decides whether a command is safe to run. If it is safe, it is auto-approved.
>
> This removes the need to constantly supervise the model while it runs. It also makes it easier to run multiple Claude sessions in parallel. Once one Claude is working, you can move on to the next one.
>
> Auto mode is now available for Opus 4.7 for Max, Teams, and Enterprise users. You can enter auto mode with Shift+Tab in the CLI, or choose it from the dropdown in Desktop or VSCode.
>
> 2) The new /fewer-permission-prompts skill
>
> A new /fewer-permission-prompts skill has also been released. It scans session history to identify common bash and MCP commands that are safe but repeatedly triggered permission prompts.
>
> It then recommends commands you can add to your permissions allowlist.
>
> This is useful for tightening your setup and reducing unnecessary permission prompts, especially if you do not use auto mode.
>
> 3) Recaps
>
> Recaps were shipped earlier this week in preparation for Opus 4.7.
>
> Recaps are short summaries of what an agent did and what it should do next.
>
> They are very useful when returning to a long-running session after a few minutes or a few hours.
>
> Example:
> Cogitated for 6m 27s
>
> recap: Fixing the post-submit transcript shift bug. The styling-flash part is shipped as PR #29869 (auto-merge on, posted to stamps). Next: I need a screen recording of the remaining horizontal rewrap on `cc -c -c` to target that separate cause.
>
> Recaps can be disabled in /config.
>
> 4) Focus mode
>
> There is also a new focus mode in the CLI that hides intermediate work so you can focus only on the final result.
>
> The idea is that the model has improved enough that, in many cases, you can trust it to run the right commands and make the right edits without needing to watch every step.
>
> Use /focus to toggle it on or off.
>
> 5) Configure your effort level
>
> Opus 4.7 uses adaptive thinking instead of thinking budgets.
>
> To make the model think more or less, Anthropic recommends tuning effort.
>
> Lower effort gives faster responses and lower token usage.
> Higher effort gives stronger intelligence and better capability.
>
> Boris says he personally uses xhigh effort for most tasks and max effort for the hardest tasks.
>
> Max applies only to the current session.
> Other effort levels persist across future sessions.
>
> Use /effort to set your effort level.
>
> Effort scale:
> low -> medium -> high -> xhigh -> max
>
> 6) Give Claude a way to verify its work
>
> A major recommendation is to always give Claude a way to verify its work.
>
> This can significantly improve results, often by 2x to 3x, and it matters even more with Opus 4.7.
>
> Verification depends on the task:
> - For backend work, make sure Claude knows how to start your server or service and test it end to end.
> - For frontend work, use the Claude Chromium extension so Claude can control the browser.
> - For desktop apps, use computer use.
>
> Boris says many of his prompts now look like:
> "Claude do blah blah /go"
>
> The /go skill has Claude:
> 1. Test itself end to end using bash, browser, or computer use
> 2. Run the /simplify skill
> 3. Put up a PR
>
> For long-running work, verification is critical because when you come back later, you can trust that the code actually works.
