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
      habit_subtitle: "Rastrea tu progreso.",
      habit_completed_toast: "¡{} completado! 🚀",
      habit_all_done_toast: "Todos los objetivos completados — ¡racha diaria +1! 🔥",
      habit_labels: ["3L Agua", "8H Sueño", "Meta de Proteína", "10K Pasos"],
      food_title: "Registro Nutricional",
      food_search: "Buscar alimento (ej. arroz, pollo)...",
      food_add: "Agregar",
      food_total: "Total de Calorías",
      macro_title: "Seguimiento de Macros",
      macro_carbs: "Carbohidratos",
      macro_protein: "Proteína",
      macro_fat: "Grasa",
      macro_ai_title: "Asistente Elite AI",
      macro_ai_subtitle: "Entrenador de Nutrición AI",
      macro_ai_placeholder: "Ej: Comí 2 rebanadas de pan integral, 3 huevos y una tortilla con mucho queso.",
      macro_ai_btn_analyze: "Analizar Comida",
      macro_ai_btn_analyzing: "Analizando...",
      macro_ai_error: "Ocurrió un error durante el análisis de AI.",
      macro_ai_success: "¡Comida agregada al registro! 🥗",
      macro_ai_feedback_label: "Retroalimentación del Coach:",
      macro_ai_prompt: `Eres un entrenador de nutrición deportiva profesional. Analiza el mensaje del usuario: "{input}". 
      Por favor, estima los valores de Proteína (p), Carbohidratos (c), Grasa (f) y Calorías totales (cal) en esta comida.
      También proporciona un comentario de entrenador profesional de 1 oración basado en el objetivo del usuario "{clientGoal}" y nivel "{clientLevel}".
      
      EL FORMATO DE RESPUESTA DEBE SER SOLO ESTE JSON (no añadas otro texto):
      {{
        "name": "Nombre de la comida",
        "p": número,
        "c": número,
        "f": número,
        "cal": número,
        "coachComment": "Tu comentario"
      }}`,
      workout_not_found: "No Hay Entrenamiento Activo",
      workout_not_found_desc: "Tu entrenador aún no ha asignado un programa.",
      workout_active: "Programa Activo",
      workout_movements: "Movimientos",
      workout_sets: "Series",
      workout_finished: "Completado",
      workout_btn_finish: "Terminar Entrenamiento",
      note_label: "Nota",
      workout_weight: "Peso",
      workout_target: "Objetivo",
      workout_toast_success: "¡Entrenamiento guardado con éxito! 🔥",
      gallery_title: "Progreso y Forma",
      gallery_desc: "Rastrea tu progreso y envía videos de forma al Entrenador Ela para análisis técnico.",
      gallery_tab_photos: "Antes / Después",
      gallery_tab_videos: "Verificación de Forma",
      gallery_upload: "Subir Nuevo",
      gallery_video_link: "Pega aquí tu enlace de video de Youtube/Drive/Vimeo...",
      gallery_btn_send: "Enviar",
      gallery_btn_delete: "Eliminar",
      gallery_empty: "Aún no has subido fotos de progreso. ¡Agrega una nueva foto para ver tu progreso!",
      gallery_coach_feedback: "Retroalimentación del Entrenador:",
      gallery_waiting: "Esperando Revisión",
      gallery_toast_photo_success: "¡Foto subida con éxito a la Bóveda! 📸",
      gallery_toast_video_error: "Por favor, introduce un enlace válido de Youtube/Vimeo.",
      gallery_toast_video_success: "¡Video enviado para aprobación del coach! 🎥",
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
      wellness_toast_success: "¡Datos de Bienestar Diarios Guardados! 🧠",
      wellness_error: "No se pudo recuperar el comentario de AI, pero se guardaron tus datos.",
      wellness_prompt: `
        Eres un Entrenador de Rendimiento Atlético Elite. Un atleta ingresó los siguientes datos de bienestar para hoy:
        RPE (Dificultad): {rpe}/10
        Sueño: {sleep} horas
        Energía: {energy}/10
        Estrés: {stress}/10

        Basado en estos datos, proporciona un consejo de 2-3 oraciones, profesional, motivador y científico para el entrenamiento o proceso de recuperación del atleta mañana. Tu consejo debe ser conciso, profesional y alineado con la visión de "Atleta Elite".
      `,
      wellness_sliders: [
        { key: "rpe", label: "RPE (Dificultad del Entrenamiento)", icon: "🔥" },
        { key: "sleep", label: "Duración del Sueño (Horas)", icon: "😴" },
        { key: "energy", label: "Nivel de Energía", icon: "⚡" },
        { key: "stress", label: "Nivel de Estrés", icon: "🧠" }
      ],
      roadmap_title: "Tu Hoja de Ruta",
      roadmap_desc: "Pasos hacia el éxito",
      roadmap_current: "Fase Actual",
      roadmap_rank: "{} Rango",
      roadmap_milestones: ["Novato", "Liga Regional", "2ª Liga", "Liga de Sultanes", "Pro Elite"],
      roadmap_coach_msg_title: "Un Mensaje de la Coach Ela",
      roadmap_coach_msg_text: "La disciplina es la clave para la liga de las reinas. Cada entrenamiento que haces hoy te acerca un paso más a la cima."
    },
    admin: {
      dashboard_title: "Panel de Control",
      business_summary: "Resumen del Negocio",
      analytics_title: "Analítica de Rendimiento",
      progress_report_title: "Reporte de Progreso",
      total_measurements: "Mediciones Totales",
      habit_score: "Puntaje de Hábitos",
      data_driven_title: "Rendimiento Basado en Datos",
      data_driven_desc: "Estos gráficos están diseñados para analizar los datos biométricos y la consistencia del atleta. Cada medición nos ayuda a optimizar nuestra estrategia.",
      btn_new_measurement: "Registrar Nueva Medición",
      chart_weight_trend: "Tendencia de Peso",
      chart_weight_subtitle: "Análisis Diario de 12 Semanas",
      chart_consistency: "Tarjeta de Disciplina",
      chart_consistency_subtitle: "Consistencia de Entrenamiento",
      chart_body_comp: "Composición Corporal",
      chart_body_comp_subtitle: "Puntaje V-Taper y % de Grasa",
      chart_target_label: "OBJETIVO",
      heatmap_consistency_label: "Consistencia últimos 30 días",
      heatmap_days_label: "Días de Entrenamiento",
      heatmap_quote: "La disciplina es la suma de pequeñas elecciones diarias.",
      empty_client: "Cliente no encontrado.",
      btn_back: "Volver",
      
      // KPI Cards
      kpi_active_clients: "Clientes Activos",
      kpi_total_registrations: "{} Registros Totales",
      kpi_monthly_revenue: "Ingresos Mensuales",
      kpi_monthly_recurring: "Recurrente Mensual",
      kpi_compliance_score: "Puntaje de Cumplimiento",
      kpi_weekly_average: "Promedio Semanal",
      kpi_new_applications: "Nueva Solicitud",
      kpi_total_leads: "{} Leads Totales",
      
      // Leads section
      leads_crm: "CRM · Leads Potenciales",
      leads_title: "Solicitudes Entrantes",
      leads_new_badge: "{} Nueva Solicitud",
      leads_total_badge: "{} Total",
      leads_empty_title: "No hay solicitudes aún",
      leads_empty_desc: "Las solicitudes del formulario de contacto aparecerán aquí.",
      leads_th_name: "Nombre",
      leads_th_phone: "Teléfono",
      leads_th_goal: "Objetivo",
      leads_th_date: "Fecha",
      leads_th_status: "Estado",
      leads_th_action: "Acción",
      leads_status_new: "Nuevo",
      leads_status_contacted: "Contactado",
      leads_btn_form: "Enviar Formulario",
      leads_notes_title: "Notas de Solicitud",
      leads_goal_volleyball: "Rendimiento Voleibol",
      leads_goal_fitness: "Fitness / Fuerza General",
      leads_goal_weight: "Pérdida de Peso / Tonificación",
      leads_goal_other: "Otro",
      
      // Toasts
      toast_leads_fetch_error: "Error al obtener datos.",
      toast_leads_update_error: "No se pudo actualizar el estado.",
      toast_leads_updated: "Estado de comunicación con {} actualizado ✅",
      toast_leads_form_sent: "¡Enlace del formulario enviado!"
    },
    legal: {
      kvkk_title: "GDPR y Política de Privacidad",
      terms_title: "Términos de Uso",
      btn_close: "Entendido, Cerrar",
      last_update: "Última actualización: 7 de abril de 2026",
      
      kvkk_intro: "En {}, damos gran importancia a la seguridad de sus datos personales bajo el Reglamento General de Protección de Datos (GDPR). Esta política explica cómo se recopilan, procesan, almacenan y protegen sus datos.",
      kvkk_sections: [
        { title: "1. Responsable del Tratamiento", content: "Como responsable del tratamiento, {}, es responsable de todos los datos personales recopilados a través del sitio web. Contacto: {}" },
        { title: "2. Datos Personales Recopilados", content: "Nombre, información de contacto, datos de salud y mediciones físicas, registros de entrenamiento y nutrición, fotos de progreso y datos de cookies." },
        { title: "3. Finalidad del Tratamiento", content: "Creación de programas personalizados, seguimiento de rendimiento, gestión de citas y mejora de la calidad del servicio." },
        { title: "4. Transferencia de Datos", content: "Sus datos no se comparten con terceros, excepto por obligaciones legales. Se almacenan en servidores seguros." },
        { title: "5. Derechos", content: "Usted tiene derecho a acceder, rectificar, eliminar o solicitar la destrucción de sus datos personales." }
      ],
      terms_intro: "Al usar este sitio web, usted acepta los siguientes términos de uso. Por favor, léalos cuidadosamente.",
      terms_sections: [
        { title: "1. Descripción del Servicio", content: "{} ofrece programas de entrenamiento personalizados y consultoría nutricional." },
        { title: "2. Membresía", content: "La información de la cuenta es personal y no puede compartirse con terceros." },
        { title: "3. Advertencia de Salud", content: "Los programas no constituyen consejo médico. Consulte a su médico antes de comenzar." },
        { title: "4. Propiedad Intelectual", content: "Todo el contenido pertenece a {} y está protegido por derechos de autor." }
      ]
    },
    forms: {
      onboarding: {
        success_title: "¡Genial! Información Recibida.",
        success_desc: "Tu entrenador se pondrá en contacto contigo a través de WhatsApp lo antes posible. ¡Prepárate!",
        step1_title: "Vamos a Conocerte.",
        step1_desc: "Comencemos ingresando tu información básica.",
        step2_title: "Condición Física.",
        step2_desc: "Optimizaremos tus metas en consecuencia.",
        step3_title: "Detalles Finales.",
        step3_desc: "Si los hay, debes especificar tu lesión o estado de salud.",
        name_label: "Nombre Completo",
        name_placeholder: "¿Cuál es tu nombre?",
        phone_label: "Teléfono",
        email_label: "Correo Electrónico",
        email_placeholder: "opcional",
        age_label: "Edad",
        height_label: "Altura",
        weight_label: "Peso",
        goal_label: "¿Cuál es tu Meta?",
        goal_placeholder: "Ej: Pérdida de grasa, ganancia muscular...",
        health_label: "Problemas de Salud / Lesiones",
        health_placeholder: "Hernia de disco, dolor de rodilla, etc.",
        allergy_label: "Alergias",
        allergy_placeholder: "Maní, gluten, etc.",
        note_label: "Nota para el Coach",
        note_placeholder: "Cualquier cosa que quieras añadir...",
        kvkk_label: "He leído y comprendido el Consentimiento Explícito y Texto de Información de KVKK sobre el tratamiento de todos mis \"Datos Personales Sensibles\", incluyendo mis declaraciones de salud, y doy mi consentimiento explícito por mi propia voluntad.",
        terms_label: "He leído y comprendido los Términos de Uso y acepto que los programas de entrenamiento y dieta no son consejos médicos, y cualquier riesgo físico/de salud que pueda surgir es totalmente mío.",
        btn_next: "Siguiente Paso",
        btn_prev: "Atrás",
        btn_complete: "Completar",
        toast_success: "¡Tu solicitud ha sido recibida con éxito!"
      },
      measurement: {
        invalid_title: "Enlace Inválido",
        invalid_desc: "Por favor, solicita un nuevo enlace a tu entrenador.",
        success_title: "¡Registro Exitoso!",
        success_desc: "¡Tu progreso se ve genial! Tus datos ya se reflejan en los gráficos.",
        welcome_title: "Bienvenido",
        quote: "La medición que tomas hoy es la base de tu éxito mañana.",
        step1_title: "Composición Corporal",
        step2_title: "Mediciones de Circunferencia (cm)",
        step3_title: "Notas y Fecha",
        weight_label: "Peso (kg)",
        fat_label: "% de Grasa Corporal",
        shoulder_label: "Hombro",
        chest_label: "Pecho",
        waist_label: "Cintura",
        hip_label: "Cadera",
        leg_label: "Pierna",
        arm_label: "Brazo",
        date_label: "Fecha de Medición",
        note_placeholder: "¿Hay alguna nota que quieras añadir para tu entrenador?",
        disclaimer: "Me comprometo con la exactitud de todos los datos de medición que ingreso. Declaró que aceptó que las pautas de entrenamiento y nutrición no reemplazan el tratamiento médico o el consejo de un médico; y si tengo un problema de salud física o mental, estoy obligado a informar esto y buscar apoyo médico profesional si es necesario.",
        btn_next: "Ir a Mediciones de Circunferencia",
        btn_prev: "Atrás",
        btn_last: "Paso Final",
        btn_send: "Enviar",
        toast_weight_required: "Por favor ingrese su peso.",
        toast_success: "¡Sus mediciones han sido guardadas con éxito!"
      }
    }
};
