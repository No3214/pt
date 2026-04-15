# LLM Council System — Ela Ebeoğlu PT

## Overview

Multi-provider AI orchestration system that runs parallel AI queries, performs adversarial cross-review, and synthesizes consensus responses for sports science domain.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Query                               │
│              "Bench press programı yaz"                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Domain Detection                             │
│     Keywords → training | nutrition | assessment | wellness  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Mode Selection (Smart)                           │
│   short query → fast | medium → standard | complex → full    │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌────────┐  ┌────────┐  ┌────────┐
│ Gemini │  │OpenRtr │  │DeepSeek│    Phase 1: Parallel Drafts
│  💎    │  │  🌐   │  │  🧠   │    (All providers simultaneously)
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └─────┬─────┴─────┬─────┘
          │           │
          ▼           ▼
    ┌───────────────────────┐
    │  Adversarial Critique │      Phase 2: Cross-Review
    │  Provider A → Review B│      (Each reviews another's output)
    │  Provider B → Review A│      Score: 1-10
    │  Hallucination check  │      Flag: fabricated claims
    └──────────┬────────────┘
               │
               ▼
    ┌───────────────────────┐
    │  Consensus Synthesis  │      Phase 3: Merge Best Elements
    │  Best-scored provider │      Remove hallucinations
    │  Merge all strengths  │      Confidence: 0-1
    └──────────┬────────────┘
               │
               ▼
    ┌───────────────────────┐
    │    CouncilOutput      │
    │  {                    │
    │    mode, domain,      │
    │    drafts[],          │
    │    critiques[],       │
    │    consensus,         │
    │    confidence,        │
    │    totalMs            │
    │  }                    │
    └───────────────────────┘
```

## Modes

| Mode | API Calls | Latency | Quality | When to Use |
|------|-----------|---------|---------|-------------|
| `councilFast` | N (parallel) | ~2s | Good | Quick questions, chat |
| `councilStandard` | N + 1 (synth) | ~4s | Better | General queries |
| `councilFull` | N + N + 1 (critique+synth) | ~8s | Best | Training programs, health assessments |
| `councilSmart` | Auto | Auto | Optimal | Default — auto-selects based on complexity |

## Domain-Specific Prompts

Each domain has a tailored system prompt:

- **nutrition**: Macro calculations, calorie targets, Turkish cuisine alternatives, allergen awareness
- **training**: Sets/reps/rest, periodization, injury risk flags, athlete level (Rookie/Pro/Elite)
- **assessment**: Body composition trends, percentage changes, comparative analysis
- **wellness**: RPE/sleep/stress, overtraining detection, active recovery recommendations

## Anti-Hallucination System

Every AI response passes through a strict system prompt that:
1. Forbids fabricated/hallucinated information
2. Forbids drug or medical treatment prescriptions
3. Forbids unscientific supplement recommendations
4. Requires medical referral for out-of-scope questions

The adversarial critique phase adds a second layer: each provider reviews another's output specifically for hallucinations.

## Files

```
src/lib/ai-council.ts          # Core council system (all modes)
src/lib/ai.ts                  # Legacy provider calls (backward compat)
functions/api/ai.ts            # Cloudflare Pages Function (API proxy)
.claude/skills/ai-council/     # Skill documentation
```

## Integration

```typescript
import { councilSmart, councilFull } from '@/lib/ai-council'

// Smart mode (auto-selects)
const result = await councilSmart("Bench press programı yaz")

// Full council for important decisions
const result = await councilFull("3 aylık periodizasyon programı")

// Access results
console.log(result.consensus)    // Best synthesized answer
console.log(result.confidence)   // 0-1 confidence score
console.log(result.drafts)       // Individual provider responses
console.log(result.critiques)    // Cross-review results
```

## .claude Skills System

Skills are NOT slash commands. They are auto-triggered SKILL.md files:

```
.claude/
├── CLAUDE.md                          # Project context (always loaded)
└── skills/
    ├── design-audit/SKILL.md          # Visual design review
    ├── code-audit/SKILL.md            # Code quality check
    ├── ai-council/SKILL.md            # AI feature development
    ├── component-builder/SKILL.md     # Component creation patterns
    ├── deploy-check/SKILL.md          # Pre-deployment validation
    ├── i18n-manager/SKILL.md          # Translation management
    └── performance-audit/SKILL.md     # Performance optimization
```

Each skill auto-activates based on context keywords in the conversation, providing domain-specific guidance without requiring manual `/slash-command` invocation.
