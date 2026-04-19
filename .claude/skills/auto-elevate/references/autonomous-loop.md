# Autonomous Loop — Deep Dive

Ana SKILL.md'deki 9-adım döngünün state makinesi ve hata durumları.

## State Machine

```
        ┌────────────┐
        │   IDLE     │ (skill tetiklenmemiş)
        └─────┬──────┘
              │ activation
              ▼
        ┌────────────┐
        │   INIT     │ TodoWrite tracker yarat, git durumu oku
        └─────┬──────┘
              ▼
        ┌────────────┐
        │  AUDIT     │ npm outdated, lint, bundle, lighthouse, ...
        └─────┬──────┘
              ▼
        ┌────────────┐
        │ BENCHMARK  │ modern-stack-2026.md karşılaştır
        └─────┬──────┘
              ▼
        ┌────────────┐
        │ PRIORITIZE │ priority-matrix.md + ROI formülü
        └─────┬──────┘
              ▼
        ┌────────────┐
        │    PLAN    │ TodoWrite ≤5 madde + DoD
        └─────┬──────┘
              ▼
        ┌────────────┐
        │ IMPLEMENT  │ Edit/Agent/Skill delege
        └─────┬──────┘
              ▼
        ┌────────────┐
        │   GATE     │ typecheck→lint→build→test→a11y→perf
        └─────┬──────┘
         fail │ pass
       ┌─────┤
       ▼     ▼
     ┌────┐ ┌────────┐
     │FIX │ │ COMMIT │ atomic conv commit
     └─┬──┘ └────┬───┘
       └──┐      ▼
          │ ┌──────────┐
          │ │ DEPLOY   │ push + wait + verify
          │ └────┬─────┘
          │ fail │ pass
          │ ┌────┤
          │ ▼    ▼
          │ ... └────────┐
          ▼              ▼
    3 fails?      ┌─────────┐
    yes → ask     │ REPORT  │ 1-line summary
    no → back to  └────┬────┘
    FIX                ▼
              ┌────────────┐
              │ TERMINATE? │
              └─────┬──────┘
            no │      │ yes
               └──────┘
                back to AUDIT       to STANDARDS-COMPLETE
```

## State Transitions

### INIT → AUDIT
Tek seferlik. Başlangıç state capture'ı:
- `git log --oneline -20 > .auto-elevate/init-commits.txt`
- `npm ls --depth=0 > .auto-elevate/init-deps.txt`
- `npx lighthouse https://live-url --output json` (varsa)

### AUDIT → BENCHMARK
Audit findings → structured JSON:
```json
{
  "iteration": 12,
  "findings": [
    { "area": "perf", "metric": "LCP", "current": 3.4, "target": 1.8, "gap": 1.6 },
    { "area": "a11y", "metric": "violations", "current": 2, "target": 0, "gap": 2 },
    { "area": "deps", "metric": "outdated-minor", "current": 4, "target": 0 }
  ]
}
```

### BENCHMARK → PRIORITIZE
Her finding'e ROI puanı ata (priority-matrix.md).

### PRIORITIZE → PLAN
En yüksek ROI finding için plan yaz. TodoWrite ile ≤5 madde.

### PLAN → IMPLEMENT
Delegation matrisi:

| İş tipi | Kullanılacak tool |
|---|---|
| 1-2 file edit | Edit / Write |
| Multi-file refactor | Agent(general-purpose) |
| Security scan | Agent(code-reviewer) veya skill:security-review |
| Design karar | Skill(design:design-critique) |
| Component inşa | Agent(general-purpose) + web-artifacts-builder |
| Data query | Skill(data:write-query) |
| Content copy | Skill(marketing:draft-content) |
| Deploy pipeline | Bash (proje scriptleri) |

Paralel işler → tek mesajda birden fazla tool call.

### IMPLEMENT → GATE
Her implementasyondan sonra gate'e git. Skip etme.

### GATE: fail → FIX
Fix denemesi:
1. Error mesajını oku
2. İlgili dosyayı Read et
3. Edit ile düzelt
4. Gate'i tekrar çalıştır
5. 3 ardışık fail'de ASK (user'a rapor)

### GATE: pass → COMMIT
Conventional commit. `git add -A` dikkatli — `.env`, secret dosyalar
staged olmasın.

### COMMIT → DEPLOY
Deploy stratejisi proje spesifik:
- Windows repo + AUTOPILOT.bat varsa → `AUTOPILOT.bat` çağır
- Vercel/Netlify git-linked → `git push` yeterli
- Manuel deploy → `npm run deploy` veya spesifik script

### DEPLOY: verify fail → back to PRIORITIZE
Verify raporu yeni finding'ler üretir. Döngü kendini besler.

### REPORT → TERMINATE?
Termination check:
- Lighthouse 4 skor ≥95?
- CWV green?
- A11y 0 critical?
- Bundle under budget?
- Deps fresh?
- i18n %100?

Tümü OK → STANDARDS-COMPLETE.
Biri eksik → AUDIT'e dön.

## Error Handling

### Gate 3 fail
```
Error → Auto-fix attempt → Still fail → User report

Report format:
"iter 14 bloke: [gate-name] 3x fail.
 Hata: [tail -10 log]
 Olası neden: [hypothesis]
 Öneri: [action]
 Devam için onay gerekli."
```

### Context approaching limit
```
Context %85 → compact-protocol.md uygula:
1. Mevcut state'i .auto-elevate/state.json'a yaz
2. /compact veya summary tetikle
3. Sonraki turn'de state.json'dan resume
```

### User interruption
```
User mesajı algılandı → current iteration'ı GATE'de tamamla → dur
"Sen ne istersen ona dönüyorum" mesajı ver.
```

### Deploy flaky
```
Verify 1x retry (5dk bekle + tekrar)
Still fail → finding'i prioritize'a ekle, yine döngüye gir
```

## Concurrency Model

- **Serial içinde serial:** Adımlar kendi içinde sıralı
- **Parallel tools:** Tek step'te multiple tool call aynı anda
- **No parallel iterations:** Bir iter tamamlanmadan diğeri başlamaz

## Idempotency

- AUDIT read-only, tekrar çalışsa OK
- IMPLEMENT atomic — commit yapıldıysa aynı implement tekrarlanmaz
- COMMIT: `git diff --cached --quiet` kontrol et, boşsa skip
- DEPLOY: zaten push edildi mi kontrol et, edildiyse skip

## Persistent State

`.auto-elevate/` dir (git ignore et):
- `state.json` — current iteration + last findings
- `history.jsonl` — her iter bir satır
- `metrics.csv` — Lighthouse skor evrimi

`.auto-elevate/state.json` örnek:
```json
{
  "iteration": 12,
  "status": "in_progress",
  "current_step": "GATE",
  "last_audit": "2026-04-18T21:40:00Z",
  "lighthouse": { "perf": 82, "a11y": 91, "bp": 96, "seo": 100 },
  "bundle_kb": 312,
  "open_findings": 4
}
```

## Telemetry (optional)

Her iter sonunda CSV satırı:
```csv
iter,timestamp,duration_s,commit,perf,a11y,bp,seo,bundle_kb,findings_closed
12,2026-04-18T21:45:00Z,312,0a0bd5d,85,93,96,100,298,1
```

User rapor isterse grafik çıkarılabilir.
