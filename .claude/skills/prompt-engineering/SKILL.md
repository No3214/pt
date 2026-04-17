---
name: prompt-engineering
description: 2026 Claude Opus 4.7 prompt engineering + AI Council patterns for PT. Triggers on prompt, council, LLM, AI, sistem mesajı.
autoTrigger: true
---
# Prompt Engineering — 2026 (Claude Opus 4.7)

## AI Council Modes
- **Fast**: 1 provider (Haiku 4.5) — copy edit, typo, küçük fix
- **Standard**: 2 provider (Sonnet 4.6 + Haiku 4.5) — component, bug fix
- **Full**: 3+ provider + critique + consensus (Opus 4.7 + Sonnet 4.6 + Gemini 2.5 Pro + critique pass)
- **Smart (auto)**: task complexity → model seçimi otomatik

## Model Seçim Matrisi
| Task | Model | Rationale |
|---|---|---|
| Architecture decision | Opus 4.7 | Derin reasoning, uzun context |
| Complex component | Opus 4.7 | Multi-file coherence |
| UI component üretimi | Sonnet 4.6 | Balanced speed/quality |
| Lint/format fix | Haiku 4.5 | Ucuz, hızlı |
| Copy editing | Haiku 4.5 | Dil işlemi |
| Code review | Opus 4.7 | Security + correctness |
| Debug session | Opus 4.7 | Root cause analysis |
| Docs/README | Sonnet 4.6 | Structured writing |

## Prompt Pattern'ler

### 1. XML Tag Structure (Claude-native)
```
<task>Explicit goal</task>
<context>Background, constraints</context>
<examples>
  <example>Input → output</example>
</examples>
<instructions>Step-by-step</instructions>
<output_format>JSON/Markdown/code</output_format>
```

### 2. Extended Thinking (Opus 4.7)
- Kompleks problem için `<thinking>` block aç
- "Önce plan yap, sonra uygula" talimatı
- Chain-of-thought explicit: "Step 1..., Step 2..."

### 3. Anti-Hallucination
- "Bilmiyorum" > uydurma YASAK
- "Kaynak belirt" (dosya yolu, satır, commit hash)
- "Kesin sayı ver" (yaklaşık YASAK)
- "Assumption listele" implicit varsayım patlat
- "Verify before assert" — iddia öncesi kontrol et

### 4. Tool Use Pattern
- Parallel tool call tek mesajda (bağımsız işler)
- Plan + execute — önce TodoWrite, sonra sırayla
- Verify after tool use — çıktıyı oku, varsayma

### 5. Few-Shot Örnekler
- 2-3 örnek yeterli (5+ diminishing return)
- Edge case örneği koy (null, empty, error)
- Format şablonu göster

## Domain Prompts (Türkçe)

### Training Plan Üretimi
```
<rol>Ela Ebeoğlu tarzı personal trainer. Akdeniz yaklaşımı.</rol>
<hedef>{goal}</hedef>
<sporcu>{age}, {weight}kg, {experience_level}</sporcu>
<constraints>Ekipman: {equipment}. Haftada {days} gün.</constraints>
<output>JSON schema: { week, days[{date, exercises[{name, sets, reps, rest, notes}]}] }</output>
```

### Beslenme Planı
```
<hedef>{cut/bulk/maintenance} {calories}kcal</hedef>
<makro>P{g} C{g} F{g}</makro>
<tercih>Akdeniz mutfağı. Zeytinyağı bol.</tercih>
<yasak>{allergies, dislikes}</yasak>
<output>Günlük 4 öğün, TSV: öğün, yemek, porsiyon, kcal, p, c, f</output>
```

### Assessment Analiz
```
<veriler>{body_metrics, performance, wellness_scores}</veriler>
<karşılaştır>son 30 gün trend</karşılaştır>
<çıktı>1) 3 güçlü nokta 2) 2 zayıf alan 3) önerilen 3 aksiyon</çıktı>
```

## Claude 4 / 4.5 / 4.7 Özel
- **Steering via XML** — `<instructions>` daha güçlü
- **Prompt caching** — system prompt + tool schema cache, %90 maliyet tasarruf
- **Extended thinking** `budget_tokens: 5000-20000` kompleks reasoning
- **Vision** — screenshot → pixel-perfect UI description
- **Tool use parallel** — multiple tool_use content block
- **Beta headers** — `anthropic-beta: extended-cache-ttl-2025-04-11`

## Context Engineering
- **Conservative context** — sadece ilgili dosyalar
- **CLAUDE.md** working memory — proje kuralları
- **Compact periyodik** — uzun session'da /clear + yeniden yükle
- **Files over paste** — Read tool > inline paste (token tasarruf)

## Multi-Turn Strategy
- İlk mesaj: goal + constraint + format
- Sonraki: iterasyon + özel düzenleme
- "Devam et" — tek kelime onay, gereksiz overhead yok
- Revise pattern: "Şunu değiştir, gerisi aynı"

## Anti-Pattern (YASAK)
- "You are a helpful assistant" boş rol
- Çok fazla kısıtlama (20+ rule → ignore)
- Format inconsistent (bazen JSON bazen prose)
- Chain-of-thought zorla her soruda (basit soru için overhead)
- Temperature 1.0 kritik kod için (0.2-0.3 kullan)
- Emoji prompt'ta (AI çıktıya emoji koyar — Yunuscan kuralı YASAK)

## PT Özel Kurallar
- Türkçe cevap (teknik terim EN OK)
- "Devam et" = sormadan devam
- Kod tam ver (parçalamadan)
- Dosya path'i her zaman ver
- Emoji YASAK
- Disclaimer YASAK ("Ben AI'yım...")
- Hata → otomatik fix

## Eval
- Prompt A/B test: council critique skoru
- Consistency: aynı prompt 3 run, variance <%15
- Accuracy: ground truth ile karşılaştırma
- Latency: Haiku < 2s, Sonnet < 5s, Opus < 15s
