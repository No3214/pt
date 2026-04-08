# Mermaid Diagrams Skill

Create architecture and flow diagrams for PT documentation.

## Common Diagram Types

### User Flow
```mermaid
flowchart TD
    A[Landing Page] --> B{Interested?}
    B -->|Yes| C[View Programs]
    C --> D[WhatsApp Contact]
    D --> E[Free Consultation]
    E --> F[Start Program]
    B -->|No| G[Exit]
```

### System Architecture
```mermaid
graph LR
    U[User] --> CF[Cloudflare CDN]
    CF --> SPA[React SPA]
    CF --> API[Edge Functions]
    API --> GM[Gemini]
    API --> OR[OpenRouter]
    API --> DS[DeepSeek]
    SPA --> ZS[Zustand Store]
    SPA --> SB[Supabase]
```

### State Flow
```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> AdminLogin: /admin
    AdminLogin --> Dashboard: PIN valid
    Dashboard --> Clients
    Dashboard --> AIChat
    Dashboard --> Calendar
    Landing --> Portal: /portal
```

### AI Council Flow
```mermaid
sequenceDiagram
    User->>Council: Query
    par Parallel Drafts
        Council->>Gemini: Draft
        Council->>OpenRouter: Draft
        Council->>DeepSeek: Draft
    end
    Gemini-->>Council: Response A
    OpenRouter-->>Council: Response B
    DeepSeek-->>Council: Response C
    Council->>Council: Adversarial Critique
    Council->>Council: Consensus Synthesis
    Council-->>User: Best Answer
```

## Usage
- Architecture docs: graph LR/TD
- User flows: flowchart TD
- State machines: stateDiagram-v2
- API flows: sequenceDiagram
- Timelines: gantt
