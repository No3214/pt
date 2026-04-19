# Prompt Patterns — Delegation + Sub-Agent Prompting

auto-elevate loop'unda alt-agent'lara yapılacak prompting için
örnekler ve kalıplar.

## Golden Rules

1. **Self-contained prompt** — alt-agent üst konuşmayı görmez
2. **Explicit task** — ne yapacağı, neyi yapmayacağı
3. **Format belirt** — çıktı formatı, uzunluk
4. **Success criteria** — "bitti" ne demek
5. **Don't dictate method** — amaç, yöntemi değil, sonucu söyle

## Agent Delegation Templates

### Template: Multi-file Refactor
```
Agent({
  subagent_type: "general-purpose",
  description: "Convert class components to hooks",
  prompt: `
  Context: React 19 codebase, src/components/legacy/ altında 8 class
  component var. Hepsini function + hooks'a dönüştür.

  Rules:
  - useState + useEffect + useMemo'ya map et
  - this.props → props destructure
  - lifecycle → useEffect
  - componentDidMount → useEffect with []
  - componentWillUnmount → useEffect cleanup
  - Her dosya tek commit'e hazır olsun

  Verify:
  - npx tsc --noEmit temiz
  - npx vitest run yeşil
  - git diff --stat ile özet ver

  Don't:
  - Non-legacy dosyaları değiştirme
  - Testleri düşürme
  - Yeni dep ekleme

  Output: bitince "DONE" de, aksi halde bloke sebebi.
  `
})
```

### Template: Deep Audit
```
Agent({
  subagent_type: "Explore",
  description: "Dead code + dup audit",
  prompt: `
  Repo root: [absolute path]

  Görev: (1) dead code tespit et (unused exports, unreachable),
  (2) duplicate component/utility bul.

  Araçlar: knip, ts-unused-exports, jscpd

  Output (markdown):
  ## Dead Code
  - path:line — symbol — sebep
  ## Duplicates
  - group:
    - path A:line
    - path B:line
    - similarity %
  ## Refactor önerisi (≤5 madde)

  ≤500 kelime. Emoji yok.
  `
})
```

### Template: Design Critique
```
Skill({
  skill: "design:design-critique",
  args: "landing hero section + CTA buttons + visual hierarchy"
})
```

### Template: Security Review
```
Agent({
  subagent_type: "code-reviewer",
  description: "Security pass on auth flow",
  prompt: `
  Dosyalar:
  - src/lib/auth.ts
  - src/app/api/auth/[...nextauth]/route.ts
  - src/middleware.ts

  OWASP Top 10 2021 ve auth-spesifik kontroller:
  - Session token rotation
  - CSRF protection
  - Password strength
  - Rate limiting
  - Timing attack
  - Session fixation
  - JWT claim validation
  - Secure cookie flags

  Output:
  - Severity (Critical/High/Med/Low)
  - Finding
  - Line reference
  - Fix önerisi

  Onaylı finding yoksa "NO FINDINGS" de.
  `
})
```

### Template: Content/Copy
```
Skill({
  skill: "marketing:draft-content",
  args: "ARENA landing hero — 40 kelime Türkçe, güç ve ritim vurgusu, 3 CTA alternatifi"
})
```

### Template: Data Query
```
Skill({
  skill: "data:write-query",
  args: "Dialect: Supabase Postgres. Son 30 gündeki DAU ve WAU, tarih bazında user_events tablosundan."
})
```

## Anti-patterns (bunları yapma)

### ❌ Anlaşılması açık işi delege etme
User: "Dosyadaki `foo` değişkenini `bar` yap"
→ Direct Edit ile yap. Agent spawn ETME.

### ❌ Ajana "ne yapayım?" sorduran prompt
Kötü: "bu kodu incele ve öneri ver"
İyi: "bu kodu incele, bulduğun security issue'ları sırala, fix önerisi ver"

### ❌ Method dayatma
Kötü: "for döngüsünü map'e çevir, sonra filter yap, sonra reduce"
İyi: "bu array'de aktif userların toplam revenue'sunu hesapla. Performant olsun."

### ❌ Uzunluk belirtmeme
Sonuç: 2000 kelime cevap geliyor, context yiyor.

### ❌ Success kriteri yok
Sonuç: Agent kendi kafasına göre "tamam" diyor.

## Parallel Delegation Pattern

Bağımsız işler → tek mesajda paralel:

```
// Aynı turn'de:
Agent(code-reviewer) → src/lib/* security scan
Agent(Explore) → dead code audit
Skill(design:accessibility-review) → landing a11y check
Skill(data:explore-data) → user_events table profil
```

4 agent/skill paralel → 4x hızlı.

## Iteration-specific Prompts

Her 9-adım iter için hazır prompt'lar:

### AUDIT prompt
```
Git + npm + lint + test durumunu oku. Findings JSON üret.
Format: [{ area, metric, current, target, gap }]. Maksimum 10 finding.
```

### PRIORITIZE prompt
```
Şu findings için ROI hesapla: [findings JSON].
priority-matrix.md'deki kategori sırasını uygula.
Output: sıralı liste + "chose: [task-id]" satırı.
```

### IMPLEMENT prompt
```
Task: [chosen task]
DoD: [definition of done]
Rules: typecheck green, lint green, test green.
Commit mesajı hazırla (conventional).
"DONE" de ya da bloke sebebini raporla.
```

### COMMIT prompt
```
Staged diff'i oku. Conventional commit yaz.
Max 72 char subject. Body açıklayıcı ama concise.
```

### VERIFY prompt
```
Live URL: [url]
Playwright ile 6 route × 2 viewport kontrol et.
Console error, network 4xx/5xx, blank body, a11y violations topla.
Output: JSON rapor.
```

## Context-efficient Prompting

- **Referans dosyaya yönlendir** — uzun açıklama yerine
  `reference: .claude/skills/auto-elevate/references/quality-gates.md`
- **Short action words** — "Fix TS errors in src/lib/*" yeterli
- **Numbered output requests** — "3 madde: 1) ne 2) nasıl 3) neden"

## User-facing vs Internal

User'a gösterilen her mesaj:
- Max 2 satır iter özeti
- Major karar noktalarında 3-5 satır
- Final STANDARDS-COMPLETE raporu: detaylı

Internal tool call'lar + agent spawn'lar:
- Detaylı, structured
- Verbose OK çünkü user göremez

## Turkish ↔ English Convention

- User iletişimi: Türkçe (yunuscanoruk@gmail.com)
- Teknik terim: İngilizce (build, deploy, typecheck, gate)
- Kod içi: İngilizce (değişken, fonksiyon, commit mesajı)
- Commit mesajı: İngilizce conventional format
- Comment: TR veya EN — projenin convention'ına uy
