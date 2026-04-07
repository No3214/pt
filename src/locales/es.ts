export const es = {
  common: {
    loading: "Cargando...",
    ready: "Listo",
    limitedSpots: "Lugares Limitados",
    scrollHint: "Descubre",
    stats: [
      { value: 20, suffix: "+", label: "Clientes Activos" },
      { value: 8, suffix: "+", label: "Años Voleibol" },
      { value: 96, suffix: "", label: "Biblioteca de Ejercicios" },
      { value: 100, suffix: "%", label: "Satisfacción" }
    ]
  },
  nav: {
    home: "Inicio",
    about: "Sistema",
    programs: "Programas",
    faq: "Preguntas",
    contact: "Contacto",
    portal: "Portal / Iniciar Sesión"
  },
  hero: {
    badge: "CONVIERTE TU VISIÓN EN REALIDAD",
    title1: "Sé fuerte.",
    title2: "Cree en ti mismo.",
    desc: "La opción de atletas y líderes de élite: Alcanza tu mejor versión con la combinación perfecta de ciencia, voluntad y tecnología.",
    btnStart: "Comenzar",
    btnPrograms: "Ver Programas",
    kpi: {
      active: "Clientes Satisfechos",
      rating: "Calificación",
      hours: "Seminarios y Entrenamientos",
      success: "Tasa de Éxito"
    }
  },
  about: {
    badge: "SISTEMA",
    title1: "No inspirador,",
    title2: "sino potenciador.",
    desc: "Con la disciplina que gané en la cancha de voleibol, solo trabajo con clientes determinados y disciplinados. Cada programa se basa en la ciencia, cada paso se mide.",
    trust: "20+ clientes activos confían en el sistema",
    cards: [
      { num: "01", title: "Disciplina Atlética", desc: "Metodología de entrenamiento probada a través de experiencia profesional en voleibol." },
      { num: "02", title: "Fortalecimiento Personal", desc: "Mi objetivo es que conozcas tu propio cuerpo y construyas una base sólida alineada con tus objetivos." },
      { num: "03", title: "Seguimiento Premium Selectivo", desc: "Trabajo enfocado uno-a-uno con lugares limitados para mantener la calidad." }
    ]
  },
  howItWorks: {
    badge: "Cómo Funciona",
    title: "Transforma en tres pasos.",
    steps: [
      { num: "01", title: "Solicita y Conéctate", desc: "Completa el formulario. En una llamada introductoria gratuita de 15 minutos, discutimos tus objetivos y nivel actual." },
      { num: "02", title: "Programa Personalizado", desc: "Basado en tu análisis corporal, objetivos e historial de entrenamiento, se diseña un plan personalizado para ti." },
      { num: "03", title: "Transforma", desc: "Chequeos semanales, análisis de videos y optimización continua — caminamos hacia tus objetivos juntos." }
    ]
  },
  marquee: [
    "8+ Años Voleibol Profesional",
    "Entrenamiento Basado en Ciencia",
    "Diseño de Programas Personalizados",
    "Planes de Nutrición Basados en TDEE",
    "Análisis y Retroalimentación de Videos",
    "Protocolo de Salto y Explosividad",
    "Garantía de Satisfacción 100%",
    "Coaching Online y Presencial"
  ],
  testimonials: {
    badge: "Resultados",
    title: "Su historia, tu motivación.",
    users: {
      u1: "Mi salto vertical aumentó 12cm en 3 meses. El sistema del entrenador Ela definitivamente está en otra liga.",
      u2: "Estoy teniendo una temporada sin lesiones y muy fuerte. El entrenamiento de fuerza es increíblemente efectivo.",
      u3: "Mi confianza y agilidad en la cancha mejoraron. Un programa completamente adaptado a mi desempeño en los partidos."
    },
    items: [
      { 
        text: "Mi salto vertical aumentó 12cm en 3 meses. El sistema del entrenador Ela definitivamente está en otra liga.", 
        name: "Ayşe K.", role: "Voleibolista", metric: "+12cm salto", image: "/ela_real_30.png"
      },
      { 
        text: "Estoy teniendo una temporada sin lesiones y muy fuerte. El entrenamiento de fuerza es increíblemente efectivo.", 
        name: "Deniz Y.", role: "Atleta Profesional", metric: "Cero Lesiones", image: "/ela_real_32.png"
      },
      { 
        text: "Mi confianza y agilidad en la cancha mejoraron. Un programa completamente adaptado a mi desempeño en los partidos.", 
        name: "Selin B.", role: "Fitness & Voleibol", metric: "+8cm Movilidad", image: "/ela_real_19.png"
      }
    ]
  },
  programs: {
    badge: "INVERSIÓN",
    title: "La inversión más grande en ti mismo.",
    btnPurchase: "Comprar",
    monthly: "/mes",
    popular: "Más Popular",
    compare: "Comparar Todas las Características",
    closeCompare: "Cerrar Comparación",
    featuresLabel: "Características",
    comparisonRows: [
      "Entrenamiento Personalizado",
      "Chequeo Semanal",
      "Soporte por WhatsApp",
      "Salto y Atletismo",
      "Análisis de Videos",
      "Seguimiento Nutricional",
      "Acceso VIP 24/7"
    ],
    features: {
      included: "Incluido",
      p1_name: "Fitness General",
      p1_desc: "Hábito de fitness sostenible.",
      p2_name: "Voleibol de Élite",
      p2_desc: "Domina la cancha.",
      p3_name: "Uno-a-Uno",
      p3_desc: "Coaching VIP y reportes."
    },
    items: [
      {
        name: "Coaching Online",
        price: "75",
        period: "/mes",
        desc: "Plan de entrenamiento personalizado y seguimiento nutricional básico",
        features: ["Plan de entrenamiento personalizado", "Actualización semanal del plan", "Soporte por WhatsApp", "Videos de revisión de forma", "Guía nutricional básica"],
        color: "secondary",
        popular: false
      },
      {
        name: "Voleibol de Élite",
        price: "90",
        period: "/mes",
        desc: "Salto vertical, atletismo y entrenamiento específico de cancha",
        features: ["Coaching Online incluido", "Protocolo de salto y explosividad", "Entrenamiento específico por posición", "Análisis y retroalimentación de video", "Programa de prevención de lesiones", "Videollamada semanal 1:1"],
        color: "primary",
        popular: true,
        featured: true
      },
      {
        name: "Crecimiento Premium",
        price: "150",
        period: "/mes",
        desc: "Coaching holístico con plan nutricional completo basado en TDEE",
        features: ["Voleybol Performance incluido", "Plan nutricional basado en TDEE", "Seguimiento diario de macros", "Acceso al portal del cliente", "Guía de suplementación", "Soporte prioritario 24/7", "Análisis corporal mensual"],
        color: "accent",
        popular: false
      }
    ]
  },
  faq: {
    title1: "Tus preguntas,",
    title2: "respondidas.",
    items: [
      { q: "¿Cómo empiezo el programa?", a: "Después de completar el formulario de solicitud, me pongo en contacto contigo a través de WhatsApp. Discutimos tus objetivos en una llamada introductoria gratuita de 15 minutos y determinamos el programa adecuado." },
      { q: "¿Cómo funciona el entrenamiento online?", a: "Tu programa personalizado se envía a través de la aplicación con ejercicios explicados en video. Reviso tu forma con chequeos semanales y actualizo el programa cuando es necesario." },
      { q: "¿Está incluido un plan de nutrición?", a: "El seguimiento nutricional básico está incluido en el Coaching Online. El paquete de Crecimiento Premium incluye un plan nutricional completo calculado según tu TDEE, seguimiento de macros y consultoría nutricional uno-a-uno." },
      { q: "No juego al voleibol, ¿puedo unirme?", a: "¡Por supuesto! Aunque el paquete de Voleibol de Élite es específico para la cancha, el Coaching Online y el Crecimiento Premium son adecuados para todos los niveles. Nos centramos en objetivos de fuerza, postura y fitness general." },
      { q: "¿Cuándo veré resultados?", a: "Con un seguimiento disciplinado, los cambios visibles comienzan en las primeras 4 semanas. Las transformaciones serias ocurren en un período de 3 meses. La consistencia siempre da resultados." }
    ]
  },
  gallery: {
    badge: "Galería",
    title1: "Galería de transformación.",
    desc: "Resultados reales, personas reales.",
    followIg: "Sígueme en Instagram",
    items: [
      { src: "/ela_real_21.png", caption: "Técnica de Remate" },
      { src: "/ela_real_22.png", caption: "Bloqueo y Defensa" },
      { src: "/ela_real_23.png", caption: "Saque" },
      { src: "/ela_real_24.png", caption: "Entrenamiento de Fuerza" },
      { src: "/ela_real_25.png", caption: "Poder en la Cancha" },
      { src: "/ela_real_26.png", caption: "Espíritu de Equipo" },
      { src: "/ela_real_19.png", caption: "Calentamiento Profesional" },
      { src: "/ela_real_30.png", caption: "Rendimiento Elite" },
      { src: "/ela_real_32.png", caption: "Prep Mental" }
    ]
  },
  contact: {
    badge: "CONTACTO",
    ready: "¿Listo para el cambio?",
    limitDesc: "Debido a cupos limitados, evalúo las solicitudes cuidadosamente. Después de completar el formulario, me pondré en contacto contigo en 24 horas.",
    location: "Estambul / Online",
    formName: "Nombre Completo",
    formNamePlaceholder: "Tu nombre",
    formPhone: "Teléfono",
    formPhonePlaceholder: "+90 5XX XXX XX XX",
    formGoal: "Objetivo Principal",
    formGoalOptions: {
      voleybol: "Rendimiento en Voleibol",
      fitness: "Fitness General / Fuerza",
      kiloKaybi: "Pérdida de Peso / Tonificación",
      diger: "Otro"
    },
    formNotes: "Notas Adicionales",
    formNotesPlaceholder: "Tus objetivos y antecedentes deportivos...",
    formBtn: "Enviar por WhatsApp",
    sending: "Enviando...",
    success: "¡Solicitud Enviada!",
    error: "Error al enviar. Por favor, inténtalo de nuevo.",
    whatsappMsg: "¡Hola! Me pongo en contacto desde el portal del atleta."
  },
  footer: {
    nav: "Navegación",
    rights: "Todos los derechos reservados.",
    terms: "Términos de Uso",
    privacy: "Política de Privacidad"
  },
  portal: {
    title: "Panel del Campeón.",
    desc: "La disciplina comienza donde termina la motivación. Las decisiones de hoy determinan la victoria de mañana.",
    quote: "El entrenamiento más difícil es el que empiezas. Ya has dado ese paso.",
    habit_title: "Acciones de Hoy",
    food_title: "Registro Nutricional",
    food_search: "Buscar alimento (ej. arroz, pollo)...",
    food_add: "Agregar",
    food_total: "Total de Calorías",
    macro_title: "Seguimiento de Macros",
    macro_carbs: "Carbohidratos",
    macro_protein: "Proteína",
    macro_fat: "Grasa",
    workout_not_found: "No Hay Entrenamiento Activo",
    workout_not_found_desc: "Tu entrenador aún no ha asignado un programa.",
    workout_active: "Programa Activo",
    workout_movements: "Movimientos",
    workout_sets: "Series",
    workout_finished: "Completado",
    workout_btn_finish: "Terminar Entrenamiento",
    workout_weight: "Peso",
    workout_target: "Objetivo",
    gallery_title: "Progreso y Forma",
    gallery_desc: "Rastrea tu progreso y envía videos de forma al Entrenador Ela para análisis técnico.",
    gallery_tab_photos: "Antes / Después",
    gallery_tab_videos: "Revisión de Forma",
    gallery_upload: "Subir Nuevo",
    gallery_video_link: "Pega aquí tu enlace de video de Youtube/Drive/Vimeo...",
    gallery_btn_send: "Enviar",
    gallery_empty: "Aún no has subido fotos de progreso. ¡Agrega una nueva foto para ver tu progreso!",
    gallery_coach_feedback: "Retroalimentación del Entrenador:",
    gallery_waiting: "Esperando Revisión",
    export_title: "Comparte tus Ganancias",
    export_desc: "Deja que tu disciplina inspire. Convierte tu resumen semanal en un visual elegante de tamaño de historia de Instagram con un clic y comparte con tus seguidores.",
    export_btn: "Descargar Imagen 📸",
    export_btn_loading: "Generando...",
    export_card_report: "Reporte Semanal",
    export_card_streak: "¡Mantén la Racha!",
    export_card_cal: "Calorías Registradas",
    export_card_habit: "Hábitos Completados",
    export_card_habit_target: "Objetivo",
    wellness_title: "Seguimiento de Bienestar",
    wellness_desc: "Registra métricas de desempeño diarias",
    wellness_btn: "Analizar",
    wellness_coach_wis: "Consejo del Entrenador",
    roadmap_title: "Tu Hoja de Ruta",
    roadmap_desc: "Pasos hacia el éxito",
    roadmap_current: "Fase Actual"
  }
};
