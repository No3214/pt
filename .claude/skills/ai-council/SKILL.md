---
name: ai-council
description: 2026 LLM Council for PT. Claude 4.7 + GPT-5 + Gemini 3 + DeepSeek R2. Triggers on AI, council, konsey, LLM, Gemini, OpenRouter, DeepSeek.
autoTrigger: true
---
# AI Council — 2026 Multi-Provider Sports AI

## Providers (Güncel)
- **Claude 4.7 Opus** — architecture, critique, deep reasoning
- **Claude 4.5 Sonnet** — component, balanced drafts
- **Claude 4.5 Haiku** — fast edit, lint, summary
- **GPT-5** — alternative perspective, tool use
- **Gemini 3 Pro** — long context (2M tokens), multimodal
- **DeepSeek R2** — reasoning, math, cost-efficient
- **Llama 4 Maverick** — open-source fallback

## Modes
- **fast (≤2s)** — tek Haiku 4.5 draft
- **council (≤4s)** — 2 provider parallel + synthesis
- **council-critique (≤8s)** — 3 provider + adversarial critique + consensus
- **smart (auto)** — domain + complexity → model seçimi
- **thinking-extended** — Opus 4.7 extended thinking block (20k token budget)

## Domain Detection
- **nutrition** → GPT-5 (geniş food DB) + Claude 4.7 critique
- **training** → Claude 4.7 (nuanced programming)
- **assessment** → DeepSeek R2 (numeric analysis) + Claude critique
- **wellness** → Claude 4.5 (empathy tone)
- **general** → smart router

## Anti-Hallucination Pipeline
1. "Bilmiyorum" > uydurma enforced
2. Source citation (URL, study, guidebook)
3. Confidence score her response'a (1-5)
4. Cross-check: ≥2 provider agree → ship; disagree → extended thinking critique
5. Medical boundary: tedavi/teşhis sorusu → out-of-scope + doktor öner

## Prompt Caching (2026)
- System prompt + tool schema + domain context cache (5min/1h TTL)
- %90 maliyet tasarruf repeated query
- `anthropic-beta: prompt-caching-2024-07-31`

## Files
- `src/lib/ai-council.ts` — core orchestrator
- `functions/api/ai.ts` — Cloudflare edge proxy (API key secret)
- `src/lib/ai-cache.ts` — KV cache wrapper

## Usage
```ts
import { councilSmart, councilFull } from '@/lib/ai-council'

// Default: smart routing
const res = await councilSmart({ prompt, domain: 'nutrition' })

// Deep analysis
const res = await councilFull({ prompt, critique: true, budget: 20000 })
```

## Cost Budget
- fast: $0.0003/call
- council: $0.003/call
- council-critique: $0.015/call
- Monthly target: ≤$50 (≈5k call)

## Observability
- Langfuse trace her call
- Latency p50/p95/p99 track
- Error rate per provider
- A/B eval: council vs single-provider accuracy
