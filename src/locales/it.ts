export const it = {
  common: {
    loading: "Caricamento...",
    ready: "Pronto",
    limitedSpots: "Posti Limitati",
    scrollHint: "Scopri",
    stats: [
      { value: 20, suffix: "+", label: "Clienti Attivi" },
      { value: 8, suffix: "+", label: "Anni Volley" },
      { value: 96, suffix: "", label: "Libreria Esercizi" },
      { value: 100, suffix: "%", label: "Soddisfazione" }
    ]
  },
  nav: {
    home: "Home",
    about: "Sistema",
    programs: "Programmi",
    faq: "Domande Frequenti",
    contact: "Contatti",
    portal: "Portale / Accedi"
  },
  hero: {
    badge: "TRASFORMA LA TUA VISIONE IN REALTÀ",
    title1: "Sii forte.",
    title2: "Credi in te stesso.",
    desc: "La scelta degli atleti e dei leader d'élite: Raggiungi la tua miglior versione con il perfetto mix di scienza, determinazione e tecnologia.",
    btnStart: "Inizia Ora",
    btnPrograms: "Visualizza Programmi",
    kpi: {
      active: "Clienti Soddisfatti",
      rating: "Valutazione",
      hours: "Seminari e Allenamenti",
      success: "Tasso di Successo"
    }
  },
  about: {
    badge: "SISTEMA",
    title1: "Non ispirante,",
    title2: "ma emancipante.",
    desc: "Con la disciplina acquisita in campo pallavolo, lavoro solo con clienti determinati e disciplinati. Ogni programma è basato sulla scienza, ogni passo è misurato.",
    trust: "20+ clienti attivi fidano del sistema",
    cards: [
      { num: "01", title: "Disciplina Atletica", desc: "Metodologia di allenamento provata attraverso esperienza professionale nel volley." },
      { num: "02", title: "Rafforzamento Personale", desc: "Il mio obiettivo è che tu conosca il tuo corpo e costruisca una base solida allineata con i tuoi obiettivi." },
      { num: "03", title: "Tracciamento Premium Selettivo", desc: "Lavoro individuale focalizzato con posti limitati per mantenere la qualità." }
    ]
  },
  howItWorks: {
    badge: "Come Funziona",
    title: "Trasformati in tre step.",
    steps: [
      { num: "01", title: "Candidati e Connettiti", desc: "Compila il modulo. In una chiamata introduttiva gratuita di 15 minuti, discutiamo i tuoi obiettivi e il tuo livello attuale." },
      { num: "02", title: "Programma Personalizzato", desc: "Basato sulla tua analisi corporea, obiettivi e storia di allenamento, viene creato un piano personalizzato per te." },
      { num: "03", title: "Trasformati", desc: "Check-in settimanali, analisi video e ottimizzazione continua — camminiamo verso i tuoi obiettivi insieme." }
    ]
  },
  marquee: [
    "8+ Anni di Volley Professionistico",
    "Allenamento Basato sulla Scienza",
    "Design Programma Personalizzato",
    "Piani Nutrizionali Basati su TDEE",
    "Analisi Video e Feedback",
    "Protocollo Salto e Esplosività",
    "Garanzia di Soddisfazione 100%",
    "Coaching Online e in Presenza"
  ],
  testimonials: {
    badge: "Risultati",
    title: "La loro storia, la tua motivazione.",
    users: {
      u1: "Il mio salto verticale è aumentato di 12 cm in 3 mesi. Il sistema di Coach Ela è definitivamente in una categoria a parte.",
      u2: "Sto avendo una stagione infortunio-free e molto forte. L'allenamento di forza è incredibilmente efficace.",
      u3: "La mia confidenza e agilità in campo sono migliorate. Un programma completamente adattato alla mia prestazione in gara."
    },
    items: [
      { 
        text: "Il mio salto verticale è aumentato di 12 cm in 3 mesi. Il sistema di Coach Ela è definitivamente in una categoria a parte.", 
        name: "Ayşe K.", role: "Pallavolista", metric: "+12cm salto", image: "/ela_real_30.png"
      },
      { 
        text: "Sto avendo una stagione infortunio-free e molto forte. L'allenamento di forza è incredibilmente efficace.", 
        name: "Deniz Y.", role: "Atleta Professionista", metric: "Zero Infortuni", image: "/ela_real_32.png"
      },
      { 
        text: "La mia confidenza e agilità in campo sono migliorate. Un programma completamente adattato alla mia prestazione in gara.", 
        name: "Selin B.", role: "Fitness & Volley", metric: "+8cm Mobilità", image: "/ela_real_19.png"
      }
    ]
  },
  programs: {
    badge: "INVESTIMENTO",
    title: "Il più grande investimento in te stesso.",
    btnPurchase: "Acquista",
    monthly: "/mese",
    popular: "Più Popolare",
    compare: "Confronta Tutte le Funzionalità",
    closeCompare: "Chiudi Confronto",
    featuresLabel: "Funzionalità",
    comparisonRows: [
      "Allenamento Personalizzato",
      "Check-in Settimanale",
      "Supporto WhatsApp",
      "Salto e Atletismo",
      "Analisi Video",
      "Tracciamento Nutrizionale",
      "Accesso VIP 24/7"
    ],
    features: {
      included: "Incluso",
      p1_name: "Fitness Generale",
      p1_desc: "Abitudine fitness sostenibile.",
      p2_name: "Volley d'Élite",
      p2_desc: "Domina il campo.",
      p3_name: "Uno-a-Uno",
      p3_desc: "Coaching VIP e rapporti."
    },
    items: [
      {
        name: "Coaching Online",
        price: "75",
        period: "/mese",
        desc: "Piano di allenamento personalizzato e monitoraggio nutrizionale di base",
        features: ["Piano di allenamento personalizzato", "Aggiornamento settimanale del piano", "Supporto WhatsApp", "Video di controllo forma", "Guida nutrizionale di base"],
        color: "secondary",
        popular: false
      },
      {
        name: "Volley d'Élite",
        price: "90",
        period: "/mese",
        desc: "Salto verticale, atletismo e allenamento specifico per il campo",
        features: ["Coaching Online incluso", "Protocollo salto e esplosività", "Allenamento specifico per posizione", "Analisi video e feedback", "Programma prevenzione infortuni", "Videochiamata settimanale 1:1"],
        color: "primary",
        popular: true,
        featured: true
      },
      {
        name: "Crescita Premium",
        price: "150",
        period: "/mese",
        desc: "Coaching olistico con piano nutrizionale completo basato su TDEE",
        features: ["Volley d'Élite incluso", "Piano nutrizionale basato su TDEE", "Monitoraggio giornaliero macro", "Accesso al portale clienti", "Guida agli integratori", "Supporto prioritario 24/7", "Analisi corporea mensile"],
        color: "accent",
        popular: false
      }
    ]
  },
  faq: {
    title1: "Le tue domande,",
    title2: "risposte.",
    items: [
      { q: "Come inizio il programma?", a: "Dopo aver compilato il modulo di richiesta, ti contatto tramite WhatsApp. Discutiamo i tuoi obiettivi in una chiamata introduttiva gratuita di 15 minuti e determiniamo il programma adatto." },
      { q: "Come funziona l'allenamento online?", a: "Il tuo programma personalizzato viene inviato tramite l'app con esercizi spiegati in video. Controllo la tua forma con check-in settimanali e aggiorno il programma quando necessario." },
      { q: "È incluso un piano nutrizionale?", a: "Il monitoraggio nutrizionale di base è incluso nel Coaching Online. Il pacchetto Crescita Premium include un piano nutrizionale completo calcolato in base al tuo TDEE, monitoraggio dei macro e consulenza nutrizionale 1-a-1." },
      { q: "Non gioco a pallavolo, posso iscrivermi?", a: "Certamente! Anche se il pacchetto Volley d'Élite è specifico per il campo, il Coaching Online e la Crescita Premium sono adatti a tutti i livelli. Puntiamo a obiettivi di forza, postura e fitness generale." },
      { q: "Quando vedrò i risultati?", a: "Con un tracciamento disciplinato, i cambiamenti visibili iniziano nelle prime 4 settimane. Trasformazioni serie avvengono in un periodo di 3 mesi. La costanza porta sempre risultati." }
    ]
  },
  gallery: {
    badge: "Galleria",
    title1: "Galleria di trasformazione.",
    desc: "Risultati reali, persone vere.",
    followIg: "Seguici su Instagram",
    items: [
      { src: "/ela_real_21.png", caption: "Tecnica di Schiacciata" },
      { src: "/ela_real_22.png", caption: "Muro e Difesa" },
      { src: "/ela_real_23.png", caption: "Servizio" },
      { src: "/ela_real_24.png", caption: "Allenamento di Forza" },
      { src: "/ela_real_25.png", caption: "Potenza in Campo" },
      { src: "/ela_real_26.png", caption: "Spirito di Squadra" },
      { src: "/ela_real_19.png", caption: "Riscaldamento Professionale" },
      { src: "/ela_real_30.png", caption: "Performance Elite" },
      { src: "/ela_real_32.png", caption: "Prep Mentale" }
    ]
  },
  contact: {
    badge: "CONTATTO",
    ready: "Pronto per il cambiamento?",
    limitDesc: "A causa di posti limitati, valuto le domande con cura. Dopo aver compilato il modulo, ti contatterò entro 24 ore.",
    location: "Istanbul / Online",
    formName: "Nome Completo",
    formNamePlaceholder: "Il tuo nome",
    formPhone: "Telefono",
    formPhonePlaceholder: "+39 3XX XXX XX XX",
    formGoal: "Obiettivo Principale",
    formGoalOptions: {
      voleybol: "Performance Pallavolo",
      fitness: "Fitness Generale / Forza",
      kiloKaybi: "Perdita di Peso / Tonificazione",
      diger: "Altro"
    },
    formNotes: "Note Aggiuntive",
    formNotesPlaceholder: "I tuoi obiettivi e la tua storia sportiva...",
    formBtn: "Invia tramite WhatsApp",
    sending: "Invio in corso...",
    success: "Domanda Inviata!",
    error: "Invio fallito. Per favore riprova.",
    whatsappMsg: "Ciao! Ti contatto dal portale dell'atleta."
  },
  footer: {
    nav: "Navigazione",
    rights: "Tutti i diritti riservati.",
    terms: "Termini di Utilizzo",
    privacy: "Informativa sulla Privacy"
  },
  portal: {
    title: "Dashboard del Campione.",
    desc: "La disciplina inizia dove finisce la motivazione. Le scelte di oggi determinano la vittoria di domani.",
    quote: "L'allenamento più difficile è quello che inizi. Hai già fatto questo passo.",
    habit_title: "Azioni di Oggi",
    food_title: "Registro Nutrizionale",
    food_search: "Cercare cibo (es. riso, pollo)...",
    food_add: "Aggiungi",
    food_total: "Calorie Totali",
    macro_title: "Tracciamento Macro",
    macro_carbs: "Carboidrati",
    macro_protein: "Proteine",
    macro_fat: "Grassi",
    workout_not_found: "Nessun Allenamento Attivo Trovato",
    workout_not_found_desc: "Il tuo coach non ha ancora assegnato un programma.",
    workout_active: "Programma Attivo",
    workout_movements: "Movimenti",
    workout_sets: "Serie",
    workout_finished: "Completato",
    workout_btn_finish: "Termina Allenamento",
    workout_weight: "Peso",
    workout_target: "Target",
    gallery_title: "Progresso e Forma",
    gallery_desc: "Traccia il tuo progresso e invia video di forma a Coach Ela per analisi tecnica.",
    gallery_tab_photos: "Prima / Dopo",
    gallery_tab_videos: "Controllo Forma",
    gallery_upload: "Carica Nuovo",
    gallery_video_link: "Incolla qui il link del video da Youtube/Drive/Vimeo...",
    gallery_btn_send: "Invia",
    gallery_empty: "Ancora nessuna foto di progresso caricata. Aggiungi una nuova foto per vedere il tuo progresso!",
    gallery_coach_feedback: "Feedback del Coach:",
    gallery_waiting: "In Attesa di Revisione",
    export_title: "Condividi i Tuoi Successi",
    export_desc: "Lascia che la tua disciplina ispiri. Trasforma il tuo riassunto settimanale in un visuale elegante in formato storia Instagram con un clic e condividilo con i tuoi follower.",
    export_btn: "Scarica Immagine 📸",
    export_btn_loading: "Generazione in corso...",
    export_card_report: "Rapporto Settimanale",
    export_card_streak: "Mantieni la Striscia!",
    export_card_cal: "Calorie Registrate",
    export_card_habit: "Abitudini Completate",
    export_card_habit_target: "Target",
    wellness_title: "Tracciamento del Benessere",
    wellness_desc: "Registra le metriche di performance giornaliere",
    wellness_btn: "Analizza",
    wellness_coach_wis: "Consiglio del Coach",
    roadmap_title: "La Tua Roadmap",
    roadmap_desc: "Passi verso il successo",
    roadmap_current: "Fase Attuale"
  }
};
