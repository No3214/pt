---
name: ai-council
description: LLM Council system for sports AI. Triggers on AI, council, konsey, LLM, Gemini, OpenRouter, DeepSeek.
autoTrigger: true
---
# AI Council — Ela Ebeoğlu PT
## Modes: fast(2s) | council(4s,+synthesis) | council-critique(8s,+critique+synthesis) | smart(auto)
## Domains auto-detected: nutrition, training, assessment, wellness, general
## Anti-hallucination on every call. Medical referral for out-of-scope.
## Files: src/lib/ai-council.ts (core), functions/api/ai.ts (proxy)
## Usage: councilSmart(prompt) for default, councilFull for training programs