---
name: mermaid-diagrams
description: 2026 Mermaid architecture/flow diagrams for PT. Triggers on diagram, şema, mermaid, flow, mimari.
---
# Mermaid Diagrams — 2026 PT

## Version
Mermaid 11.x (2026 — sequenceDiagram, c4Context, requirement, sankey destek).

## User Flow
```mermaid
flowchart TD
    A[Landing] --> B{İlgilenir mi?}
    B -->|Evet| C[Programlar]
    C --> D[İletişim]
    D --> E[Ücretsiz Görüşme]
    E --> F[Program Başlat]
    B -->|Hayır| G[Çıkış]
    F --> H[Portal]
    H --> I{Hedef}
    I -->|Performans| J[Elit Sporcu Programı]
    I -->|Fitness| K[Kişisel Plan]
```

## System Architecture (C4 Container)
```mermaid
C4Context
    title PT Platform Architecture
    Person(user, "Sporcu")
    Person(coach, "Ela (Coach)")
    System_Boundary(pt, "PT Platform") {
        Container(spa, "React 19 SPA", "Cloudflare Pages")
        Container(api, "Edge Functions", "Cloudflare Workers")
        ContainerDb(db, "Supabase", "PostgreSQL + RLS")
    }
    System_Ext(ai, "AI Council", "Claude 4.7 / GPT-5 / Gemini 3")
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
    Dashboard --> Bookings
    Dashboard --> AIChat
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
    participant A as Claude 4.7
    participant G as GPT-5
    participant M as Gemini 3
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

## Booking Lifecycle
```mermaid
stateDiagram-v2
    [*] --> Pending: submit form
    Pending --> Approved: coach confirm
    Pending --> Rejected: coach decline
    Approved --> Paid: payment
    Paid --> Scheduled: date assign
    Scheduled --> Completed: session done
    Scheduled --> NoShow: missed
    NoShow --> Rescheduled: new date
    Completed --> [*]
    Rejected --> [*]
```

## Deploy Pipeline
```mermaid
flowchart LR
    A[Git push main] --> B[GitHub Actions]
    B --> C{Typecheck}
    C -->|Pass| D{Lint}
    C -->|Fail| X[Block]
    D -->|Pass| E{Build}
    E --> F{Lighthouse CI}
    F -->|≥95| G[Cloudflare Deploy]
    F -->|<95| X
    G --> H[arena.kozbeylikonagi.com.tr]
    G --> I[Smoke Test]
    I -->|Fail| J[Auto Rollback]
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
  'primaryColor': '#C8A97E',
  'primaryTextColor': '#1a1a1a',
  'primaryBorderColor': '#8B7355',
  'lineColor': '#D4A574'
}}}%%
```
