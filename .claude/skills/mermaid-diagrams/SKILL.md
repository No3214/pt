---
name: mermaid-diagrams
description: 2026 Mermaid architecture/flow diagrams for ARENA. Triggers on diagram, şema, mermaid, flow, mimari.
---
# Mermaid Diagrams — 2026 ARENA

## Version
Mermaid 11.x (2026 — sequenceDiagram, c4Context, requirement, sankey destek).

## User Flow
```mermaid
flowchart TD
    A[Landing] --> B{İlgilenir mi?}
    B -->|Evet| C[Marketplace]
    C --> D[Program Seçimi]
    D --> E[İletişim/Satın Al]
    E --> F[Kayıt]
    B -->|Hayır| G[Çıkış]
    F --> H[Portal]
    H --> I{Hedef}
    I -->|Performans| J[Elit Sporcu Programı]
    I -->|Fitness| K[Kişisel Plan]
```

## System Architecture (C4 Container)
```mermaid
C4Context
    title ARENA Platform Architecture
    Person(user, "Sporcu")
    Person(coach, "Elite Coach")
    System_Boundary(pt, "ARENA Platform") {
        Container(spa, "React 19 SPA", "Vite/Vercel")
        Container(api, "Edge Functions", "Supabase Functions")
        ContainerDb(db, "Supabase", "PostgreSQL + RLS")
    }
    System_Ext(ai, "AI Council", "Claude / GPT / Gemini")
    Rel(user, spa, "HTTPS")
    Rel(coach, spa, "HTTPS")
    Rel(spa, api, "JSON/REST")
    Rel(api, ai, "Provider APIs")
    Rel(spa, db, "Supabase Realtime")
```

## State Machine
```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> AdminLogin: /admin
    AdminLogin --> Dashboard: PIN valid
    Dashboard --> Clients
    Dashboard --> Leads
    Dashboard --> AIBuilder
    Dashboard --> Assessment
    AdminLogin --> RateLimited: 5 fail
    RateLimited --> AdminLogin: 15min
    Landing --> Portal: /portal
    Portal --> StudentHome: auth
    StudentHome --> Workout
    StudentHome --> Wellness
    StudentHome --> Macros
```

## AI Council Sequence
```mermaid
sequenceDiagram
    participant U as User
    participant C as Council
    participant A as Claude
    participant G as GPT
    participant M as Gemini
    U->>C: Query (domain + prompt)
    par Parallel drafts
        C->>A: Draft request
        C->>G: Draft request
        C->>M: Draft request
    end
    A-->>C: Response A + confidence
    G-->>C: Response B + confidence
    M-->>C: Response C + confidence
    C->>C: Adversarial critique
    C->>C: Consensus synthesis
    C-->>U: Best answer + sources
```

## Usage
- Architecture: `C4Context` / `graph LR|TD`
- User flow: `flowchart TD`
- State: `stateDiagram-v2`
- Sequence: `sequenceDiagram`
- Gantt: `gantt` (timeline)
- ERD: `erDiagram` (DB schema)
- Mindmap: `mindmap`
- Sankey: `sankey-beta` (flow quantity)

## Theme
```mermaid
%%{init: {'theme':'base', 'themeVariables': {
  'primaryColor': '#C2684A',
  'primaryTextColor': '#FAF6F1',
  'primaryBorderColor': '#1C1917',
  'lineColor': '#D4B483'
}}}%%
```
