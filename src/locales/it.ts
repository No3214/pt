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
      habit_subtitle: "Traccia i tuoi progressi.",
      habit_completed_toast: "{} completato! 🚀",
      habit_all_done_toast: "Tutti gli obiettivi raggiunti — serie giornaliera +1! 🔥",
      habit_labels: ["3L Acqua", "8H Sonno", "Meta Proteica", "10K Passi"],
      food_title: "Registro Nutrizionale",
      food_search: "Cerca cibo (es. riso, pollo)...",
      food_add: "Aggiungi",
      food_total: "Calorie Totali",
      macro_title: "Tracciamento Macro",
      macro_carbs: "Carboidrati",
      macro_protein: "Proteine",
      macro_fat: "Grassi",
      macro_ai_title: "Elite AI Assistant",
      macro_ai_subtitle: "Coach Nutrizionale AI",
      macro_ai_placeholder: "Es: Ho mangiato 2 fette di pane integrale, 3 uova e una frittata con molto formaggio.",
      macro_ai_btn_analyze: "Analizza Pasto",
      macro_ai_btn_analyzing: "Analisi in corso...",
      macro_ai_error: "Si è verificato un errore durante l'analisi AI.",
      macro_ai_success: "Pasto aggiunto al registro! 🥗",
      macro_ai_feedback_label: "Feedback del Coach:",
      macro_ai_prompt: `Sei un coach nutrizionale per atleti professionisti. Analizza il messaggio dell'utente: "{input}". 
      Per favore, stima i valori di Proteine (p), Carboidrati (c), Grassi (f) e Calorie totali (cal) in questo pasto.
      Fornisci anche un commento professionale da coach in 1 frase basato sull'obiettivo dell'utente "{clientGoal}" e sul livello "{clientLevel}".
      
      IL FORMATO DELLA RISPOSTA DEVE ESSERE SOLO QUESTO JSON (non aggiungere altro testo):
      {{
        "name": "Nome del cibo",
        "p": numero,
        "c": numero,
        "f": numero,
        "cal": numero,
        "coachComment": "Il tuo commento"
      }}`,
      workout_not_found: "Nessun Allenamento Attivo Trovato",
      workout_not_found_desc: "Il tuo coach non ha ancora assegnato un programma.",
      workout_active: "Programma Attivo",
      workout_movements: "Movimenti",
      workout_sets: "Serie",
      workout_finished: "Completato",
      workout_btn_finish: "Termina Allenamento",
      note_label: "Nota",
      workout_weight: "Peso",
      workout_target: "Obiettivo",
      workout_toast_success: "Allenamento salvato con successo! 🔥",
      gallery_title: "Progresso e Forma",
      gallery_desc: "Traccia il tuo progresso e invia video di forma a Coach Ela per analisi tecnica.",
      gallery_tab_photos: "Prima / Dopo",
      gallery_tab_videos: "Verifica Forma",
      gallery_upload: "Carica Nuovo",
      gallery_video_link: "Incolla qui il link del video da Youtube/Drive/Vimeo...",
      gallery_btn_send: "Invia",
      gallery_btn_delete: "Elimina",
      gallery_empty: "Ancora nessuna foto di progresso caricata. Aggiungi una nuova foto per vedere il tuo progresso!",
      gallery_coach_feedback: "Feedback del Coach:",
      gallery_waiting: "In Attesa di Revisione",
      gallery_toast_photo_success: "Foto caricata con successo nella Bóveda! 📸",
      gallery_toast_video_error: "Per favore, inserisci un link Youtube/Vimeo valido.",
      gallery_toast_video_success: "Video inviato per l'approvazione del coach! 🎥",
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
      wellness_toast_success: "Dati sul benessere giornalieri salvati! 🧠",
      wellness_error: "Impossibile recuperare il commento AI, ma i tuoi dati sono stati salvati.",
      wellness_prompt: `
        Sei un Elite Athletic Performance Coach. Un atleta ha inserito i seguenti dati sul benessere per oggi:
        RPE (Difficoltà): {rpe}/10
        Sonno: {sleep} ore
        Energia: {energy}/10
        Stress: {stress}/10

        Sulla base di questi dati, fornisci un consiglio di 2-3 frasi, professionale, motivante e scientifico per l'allenamento o il processo di recupero dell'atleta domani. Il tuo consiglio dovrebbe essere conciso, professionale e in linea con la visione "Elite Athlete".
      `,
      wellness_sliders: [
        { key: "rpe", label: "RPE (Difficoltà dell'Allenamento)", icon: "🔥" },
        { key: "sleep", label: "Durata del Sonno (Ore)", icon: "😴" },
        { key: "energy", label: "Livello di Energia", icon: "⚡" },
        { key: "stress", label: "Livello di Stress", icon: "🧠" }
      ],
      roadmap_title: "La Tua Roadmap",
      roadmap_desc: "Passi verso il successo",
      roadmap_current: "Fase Attuale",
      roadmap_rank: "Grado {}",
      roadmap_milestones: ["Esordiente", "Lega Regionale", "2ª Lega", "Lega delle Sultane", "Pro Elite"],
      roadmap_coach_msg_title: "Un Messaggio da Coach Ela",
      roadmap_coach_msg_text: "La disciplina è la chiave per la lega delle regine. Ogni allenamento che fai oggi ti porta un passo più vicino alla cima."
    },
    admin: {
      dashboard_title: "Pannello di Controllo",
      business_summary: "Riepilogo Business",
      analytics_title: "Analisi delle Prestazioni",
      progress_report_title: "Rapporto di Progresso",
      total_measurements: "Misurazioni Totali",
      habit_score: "Punteggio Abitudini",
      data_driven_title: "Prestazioni Basate sui Dati",
      data_driven_desc: "Questi grafici sono progettati per analizzare i dati biometrici e la costanza dell'atleta. Ogni misurazione ci aiuta a ottimizzare la nostra strategia.",
      btn_new_measurement: "Registra Nuova Misurazione",
      chart_weight_trend: "Tendenza del Peso",
      chart_weight_subtitle: "Analisi Giornaliera di 12 Settimane",
      chart_consistency: "Scheda di Disciplina",
      chart_consistency_subtitle: "Costanza dell'Allenamento",
      chart_body_comp: "Composizione Corporea",
      chart_body_comp_subtitle: "Punteggio V-Taper e % di Grasso",
      chart_target_label: "OBIETTIVO",
      heatmap_consistency_label: "Costanza ultimi 30 giorni",
      heatmap_days_label: "Giorni di Allenamento",
      heatmap_quote: "La disciplina è la somma di piccole scelte quotidiane.",
      empty_client: "Cliente non trovato.",
      btn_back: "Torna Indietro",
      
      kpi_active_clients: "Clienti Attivi",
      kpi_total_registrations: "{} Registrazioni Totali",
      kpi_monthly_revenue: "Entrate Mensili",
      kpi_monthly_recurring: "Ricorrente Mensile",
      kpi_compliance_score: "Punteggio di Conformità",
      kpi_weekly_average: "Media Settimanale",
      kpi_new_applications: "Nuova Richiesta",
      kpi_total_leads: "{} Lead Totali",
      
      leads_crm: "CRM · Lead Potenziali",
      leads_title: "Richieste in Entrata",
      leads_new_badge: "{} Nuova Richiesta",
      leads_total_badge: "{} Totale",
      leads_empty_title: "Ancora nessuna richiesta",
      leads_empty_desc: "Le richieste dal modulo di contatto appariranno qui.",
      leads_th_name: "Nome",
      leads_th_phone: "Telefono",
      leads_th_goal: "Obiettivo",
      leads_th_date: "Data",
      leads_th_status: "Stato",
      leads_th_action: "Azione",
      leads_status_new: "Nuovo",
      leads_status_contacted: "Contattato",
      leads_btn_form: "Invia Modulo",
      leads_notes_title: "Note sulla Richiesta",
      leads_goal_volleyball: "Prestazioni Pallavolo",
      leads_goal_fitness: "Fitness / Forza Generale",
      leads_goal_weight: "Perdita di Peso / Tonificazione",
      leads_goal_other: "Altro",
      
      toast_leads_fetch_error: "Impossibile recuperare i dati.",
      toast_leads_update_error: "Impossibile aggiornare lo stato.",
      toast_leads_updated: "Stato della comunicazione con {} aggiornato ✅",
      toast_leads_form_sent: "Link del modulo condiviso!"
    },
    legal: {
      kvkk_title: "GDPR & Informativa Privacy",
      terms_title: "Termini di Utilizzo",
      btn_close: "Capito, Chiudi",
      last_update: "Ultimo aggiornamento: 7 aprile 2026",
      
      kvkk_intro: "Presso {}, attribuiamo grande importanza alla sicurezza dei tuoi dati personali ai sensi del Regolamento Generale sulla Protezione dei Dati (GDPR).",
      kvkk_sections: [
        { title: "1. Titolare del Trattamento", content: "In qualità di titolare del trattamento, {}, è responsabile di tutti i dati raccolti tramite il sito web. Contatto: {}" },
        { title: "2. Dati Raccolti", content: "Nome, e-mail, telefono, dati sulla salute, misurazioni fisiche, foto di progresso e cookie." },
        { title: "3. Finalità", content: "Creazione di piani personalizzati, analisi delle prestazioni e gestione appuntamenti." },
        { title: "4. Diritti", content: "Hai il diritto di accedere, rettificare o cancellare i tuoi dati personali." }
      ],
      terms_intro: "Utilizzando questo sito web, accetti i seguenti termini di utilizzo. Si prega di leggerli attentamente.",
      terms_sections: [
        { title: "1. Descrizione del Servizio", content: "{} fornisce allenamento personalizzato e consulenza nutrizionale." },
        { title: "2. Iscrizione", content: "Le informazioni dell'account sono personali e non possono essere condivise." },
        { title: "3. Avvertenza Salute", content: "I programmi non costituiscono consulenza medica. Consulta un medico prima di iniziare." },
        { title: "4. Proprietà", content: "Tutti i contenuti appartengono a {} e sono protetti da copyright." }
      ]
    },
    forms: {
      onboarding: {
        success_title: "Ottimo! Informazioni Ricevute.",
        success_desc: "Il tuo coach ti contatterà via WhatsApp il prima possibile. Preparati!",
        step1_title: "Iniziamo a Conoscerti.",
        step1_desc: "Iniziamo inserendo le tue informazioni di base.",
        step2_title: "Condizioni Fisiche.",
        step2_desc: "Ottimizzeremo i tuoi obiettivi di conseguenza.",
        step3_title: "Dettagli Finali.",
        step3_desc: "Se presenti, specifica eventuali infortuni o condizioni di salute.",
        name_label: "Nome Completo",
        name_placeholder: "Come ti chiami?",
        phone_label: "Telefono",
        email_label: "E-Mail",
        email_placeholder: "opzionale",
        age_label: "Età",
        height_label: "Altezza",
        weight_label: "Peso",
        goal_label: "Qual è il Tuo Obiettivo?",
        goal_placeholder: "Es: Perdita di grasso, guadagno muscolare...",
        health_label: "Problemi di Salute / Infortuni",
        health_placeholder: "Ernia al disco, dolore al ginocchio, ecc.",
        allergy_label: "Allergie",
        allergy_placeholder: "Arachidi, glutine, ecc.",
        note_label: "Nota per il Coach",
        note_placeholder: "Tutto ciò che vuoi aggiungere...",
        kvkk_label: "Ho letto e compreso il Consenso Esplicito e l'Informativa KVKK riguardante il trattamento di tutti i miei \"Dati Personali Sensibili\", comprese le mie dichiarazioni sulla salute, e fornisco il mio consenso esplicito con la mia libera volontà.",
        terms_label: "Ho letto e compreso i Termini di Utilizzo e accetto che i programmi di allenamento e dieta non sono consigli medici, e qualsiasi rischio fisico/sanitario che potrebbe derivarne è interamente mio.",
        btn_next: "Passaggio Successivo",
        btn_prev: "Indietro",
        btn_complete: "Completa",
        toast_success: "La tua candidatura è stata ricevuta con successo!"
      },
      measurement: {
        invalid_title: "Link non Valido",
        invalid_desc: "Richiedi un nuovo link al tuo coach.",
        success_title: "Registrazione Riuscita!",
        success_desc: "I tuoi progressi sono fantastici! I tuoi dati sono già riflessi nei grafici.",
        welcome_title: "Benvenuto",
        quote: "La misurazione che prendi oggi è la base del tuo successo di domani.",
        step1_title: "Composizione Corporea",
        step2_title: "Misure di Circonferenza (cm)",
        step3_title: "Note e Data",
        weight_label: "Peso (kg)",
        fat_label: "% Massa Grassa",
        shoulder_label: "Spalla",
        chest_label: "Petto",
        waist_label: "Vita",
        hip_label: "Fianchi",
        leg_label: "Gamba",
        arm_label: "Braccio",
        date_label: "Data della Misurazione",
        note_placeholder: "C'è una nota che vuoi aggiungere per il tuo coach?",
        disclaimer: "Mi impegno per l'accuratezza di tutti i dati di misurazione che inserisco. Dichiaro di accettare che le linee guida sull'allenamento e sulla nutrizione non sostituiscono il trattamento medico o il parere del medico; e se ho un problema di salute fisica o mentale, sono obbligato a segnalarlo e a cercare supporto medico professionale se necessario.",
        btn_next: "Vai alle Misure di Circonferenza",
        btn_prev: "Indietro",
        btn_last: "Passaggio Finale",
        btn_send: "Invia",
        toast_weight_required: "Per favore inserisci il tuo peso.",
        toast_success: "Le tue misurazioni sono state salvate con successo!"
      }
    }
};
