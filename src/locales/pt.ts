export const pt = {
  common: {
    loading: "Carregando...",
    ready: "Pronto",
    limitedSpots: "Vagas Limitadas",
    scrollHint: "Descubra",
    stats: [
      { value: 20, suffix: "+", label: "Clientes Ativos" },
      { value: 8, suffix: "+", label: "Anos de Vôlei" },
      { value: 96, suffix: "", label: "Biblioteca de Exercícios" },
      { value: 100, suffix: "%", label: "Satisfação" }
    ]
  },
  nav: {
    home: "Início",
    about: "Sistema",
    programs: "Programas",
    faq: "Perguntas",
    contact: "Contato",
    portal: "Portal / Login"
  },
  hero: {
    badge: "TRANSFORME SUA VISÃO EM REALIDADE",
    title1: "Seja forte.",
    title2: "Acredite em si mesmo.",
    desc: "A escolha de atletas e líderes de elite: Alcance sua melhor versão com a combinação perfeita de ciência, vontade e tecnologia.",
    btnStart: "Comece Agora",
    btnPrograms: "Ver Programas",
    kpi: {
      active: "Clientes Satisfeitos",
      rating: "Avaliação",
      hours: "Seminários e Treinamentos",
      success: "Taxa de Sucesso"
    }
  },
  about: {
    badge: "SISTEMA",
    title1: "Não inspirador,",
    title2: "mas potencializador.",
    desc: "Com a disciplina que ganhei na quadra de voleibol, trabalho apenas com clientes determinados e disciplinados. Cada programa é baseado em ciência, cada passo é medido.",
    trust: "20+ clientes ativos confiam no sistema",
    cards: [
      { num: "01", title: "Disciplina Atlética", desc: "Metodologia de treinamento comprovada através de experiência profissional em voleibol." },
      { num: "02", title: "Fortalecimento Pessoal", desc: "Meu objetivo é que você conheça seu próprio corpo e construa uma base sólida alinhada com seus objetivos." },
      { num: "03", title: "Acompanhamento Premium Seletivo", desc: "Trabalho individual focado com vagas limitadas para manter a qualidade." }
    ]
  },
  howItWorks: {
    badge: "Como Funciona",
    title: "Transforme-se em três passos.",
    steps: [
      { num: "01", title: "Candidate-se e Conheça", desc: "Preencha o formulário. Em uma chamada introdutória gratuita de 15 minutos, discutimos seus objetivos e nível atual." },
      { num: "02", title: "Programa Personalizado", desc: "Baseado na sua análise corporal, objetivos e histórico de treinamento, um plano personalizado é criado para você." },
      { num: "03", title: "Transforme", desc: "Acompanhamentos semanais, análise de vídeo e otimização contínua — caminhamos para seus objetivos juntos." }
    ]
  },
  marquee: [
    "8+ Anos de Voleibol Profissional",
    "Treinamento Baseado em Ciência",
    "Design de Programa Personalizado",
    "Planos de Nutrição Baseados em TDEE",
    "Análise de Vídeo e Feedback",
    "Protocolo de Salto e Explosividade",
    "Garantia de Satisfação 100%",
    "Coaching Online e Presencial"
  ],
  testimonials: {
    badge: "Resultados",
    title: "Sua história, sua motivação.",
    users: {
      u1: "Meu salto vertical aumentou 12cm em 3 meses. O sistema ARENA está definitivamente em outra liga.",
      u2: "Estou tendo uma temporada sem lesões e muito forte. O treinamento de força é incrivelmente eficaz.",
      u3: "Minha confiança e agilidade em quadra melhoraram. Um programa completamente adaptado ao meu desempenho em jogo."
    },
    items: [
      { 
        text: "Meu salto vertical aumentou 12cm em 3 meses. O sistema ARENA está definitivamente em outra liga.", 
        name: "Ayşe K.", role: "Jogadora de Vôlei", metric: "+12cm salto", image: "/ela_real_30.png"
      },
      { 
        text: "Estou tendo uma temporada sem lesões e muito forte. O treinamento de força é incrivelmente eficaz.", 
        name: "Deniz Y.", role: "Atleta Profissional", metric: "Zero Lesões", image: "/ela_real_32.png"
      },
      { 
        text: "Minha confiança e agilidade em quadra melhoraram. Um programa completamente adaptado ao meu desempenho em jogo.", 
        name: "Selin B.", role: "Fitness & Vôlei", metric: "+8cm Mobilidade", image: "/ela_real_19.png"
      }
    ]
  },
  programs: {
    badge: "INVESTIMENTO",
    title: "O maior investimento em você mesmo.",
    btnPurchase: "Comprar",
    monthly: "/mês",
    popular: "Mais Popular",
    compare: "Comparar Todos os Recursos",
    closeCompare: "Fechar Comparação",
    featuresLabel: "Recursos",
    comparisonRows: [
      "Treinamento Personalizado",
      "Acompanhamento Semanal",
      "Suporte WhatsApp",
      "Salto e Atletismo",
      "Análise de Vídeo",
      "Rastreamento Nutricional",
      "Acesso VIP 24/7"
    ],
    features: {
      included: "Incluído",
      p1_name: "Fitness Geral",
      p1_desc: "Hábito de fitness sustentável.",
      p2_name: "Voleibol de Elite",
      p2_desc: "Domine a quadra.",
      p3_name: "Um-a-Um",
      p3_desc: "Coaching VIP e relatórios."
    },
    items: [
      {
        name: "Coaching Online",
        price: "75",
        period: "/mês",
        desc: "Plano de treino personalizado e acompanhamento nutricional básico",
        features: ["Plano de treino personalizado", "Atualização semanal do plano", "Suporte WhatsApp", "Vídeos de verificação de forma", "Guia nutricional básico"],
        color: "secondary",
        popular: false
      },
      {
        name: "Voleibol de Elite",
        price: "90",
        period: "/mês",
        desc: "Salto vertical, atletismo e treino específico para quadra",
        features: ["Coaching Online incluído", "Protocolo de salto e explosividade", "Treino específico por posição", "Análise de vídeo e feedback", "Programa de prevenção de lesões", "Chamada de vídeo semanal 1:1"],
        color: "primary",
        popular: true,
        featured: true
      },
      {
        name: "Crescimento Premium",
        price: "150",
        period: "/mês",
        desc: "Coaching holístico com plano nutricional completo baseado em TDEE",
        features: ["Voleibol de Elite incluído", "Plano nutricional baseado em TDEE", "Acompanhamento diário de macros", "Acesso ao portal do cliente", "Orientação de suplementos", "Suporte prioritário 24/7", "Análise corporal mensal"],
        color: "accent",
        popular: false
      }
    ]
  },
  faq: {
    badge: "Perguntas Frequentes",
    title1: "Suas perguntas,",
    title2: "respondidas.",
    items: [
      { q: "Como começo o programa?", a: "Depois de preencher o formulário de inscrição, entrarei em contacto consigo via WhatsApp. Discutimos os seus objetivos numa chamada introdutória gratuita de 15 minutos e determinamos o programa adequado." },
      { q: "Como funciona o treino online?", a: "O seu programa personalizado é enviado através da aplicação com exercícios explicados em vídeo. Verifico a sua forma com check-ins semanais e atualizo o programa quando necessário." },
      { q: "O plano nutricional está incluído?", a: "O acompanhamento nutricional básico está incluído no Coaching Online. O pacote Crescimento Premium inclui um plano nutricional completo calculado de acordo com o seu TDEE, acompanhamento de macros e consultoria nutricional 1-a-1." },
      { q: "Não jogo vôlei, posso inscrever-me?", a: "Claro! Embora o pacote Voleibol de Elite seja específico para a quadra, o Coaching Online e o Crescimento Premium são adequados para todos os níveis. Focamo-nos em objetivos de força, postura e fitness geral." },
      { q: "Quando verei resultados?", a: "Com um acompanhamento disciplinado, as mudanças visíveis começam nas primeiras 4 semanas. Transformações sérias ocorrem num período de 3 meses. A consistência traz sempre resultados." }
    ]
  },
  gallery: {
    badge: "Galeria",
    title1: "Galeria de transformação.",
    desc: "Resultados reais, pessoas reais.",
    followIg: "Siga no Instagram",
    items: [
      { src: "/ela_real_21.png", caption: "Técnica de Cortada" },
      { src: "/ela_real_22.png", caption: "Bloqueio e Defesa" },
      { src: "/ela_real_23.png", caption: "Saque" },
      { src: "/ela_real_24.png", caption: "Treino de Força" },
      { src: "/ela_real_25.png", caption: "Poder em Quadra" },
      { src: "/ela_real_26.png", caption: "Espírito de Equipe" },
      { src: "/ela_real_19.png", caption: "Aquecimento Profissional" },
      { src: "/ela_real_30.png", caption: "Performance Elite" },
      { src: "/ela_real_32.png", caption: "Prep Mental" }
    ]
  },
  contact: {
    badge: "CONTATO",
    ready: "Pronto para a mudança?",
    limitDesc: "Devido a vagas limitadas, avalio os pedidos cuidadosamente. Depois de preencher o formulário, entrarei em contato consigo em 24 horas.",
    location: "Istambul / Online",
    formName: "Nome Completo",
    formNamePlaceholder: "O seu nome",
    formPhone: "Telemóvel",
    formPhonePlaceholder: "+90 5XX XXX XX XX",
    formGoal: "Objetivo Principal",
    formGoalOptions: {
      voleybol: "Performance Voleibol",
      fitness: "Fitness Geral / Força",
      kiloKaybi: "Perda de Peso / Tonificação",
      diger: "Outro"
    },
    formNotes: "Notas Adicionais",
    formNotesPlaceholder: "Os seus objetivos e histórico desportivo...",
    formBtn: "Enviar via WhatsApp",
    sending: "A enviar...",
    success: "Pedido Enviado!",
    error: "Falha ao enviar. Por favor tente novamente.",
    whatsappMsg: "Olá! Entro em contacto através do portal do atleta."
  },
  footer: {
    nav: "Navegação",
    rights: "Todos os direitos reservados.",
    terms: "Termos de Uso",
    privacy: "Política de Privacidade"
  },
  portal: {
      title: "Dashboard do Campeão.",
      desc: "Disciplina começa onde a motivação termina. As escolhas de hoje determinam a vitória de amanhã.",
      quote: "O treino mais difícil é aquele que você começa. Você já deu esse passo.",
      habit_title: "Ações de Hoje",
      habit_subtitle: "Acompanhe seu progresso.",
      habit_completed_toast: "{} concluído! 🚀",
      habit_all_done_toast: "Todas as metas atingidas — sequência diária +1! 🔥",
      habit_labels: ["3L Água", "8H Sono", "Meta de Proteína", "10K Passos"],
      food_title: "Registro Nutricional",
      food_search: "Procurar alimento (ex. arroz, frango)...",
      food_add: "Adicionar",
      food_total: "Total de Calorias",
      macro_title: "Rastreamento de Macros",
      macro_carbs: "Carboidratos",
      macro_protein: "Proteína",
      macro_fat: "Gordura",
      macro_ai_title: "Elite AI Assistant",
      macro_ai_subtitle: "Coach de Nutrição IA",
      macro_ai_placeholder: "Ex: Comi 2 fatias de pão integral, 3 ovos e uma omelete com muito queijo.",
      macro_ai_btn_analyze: "Analisar Refeição",
      macro_ai_btn_analyzing: "Analisando...",
      macro_ai_error: "Ocorreu um erro durante a análise da IA.",
      macro_ai_success: "Refeição adicionada ao registro! 🥗",
      macro_ai_feedback_label: "Feedback do Coach:",
      macro_ai_prompt: `Você é um coach de nutrição esportiva profissional. Analise a mensagem do usuário: "{input}". 
      Por favor, estime os valores de Proteína (p), Carboidrato (c), Gordura (f) e Calorias totais (cal) nesta refeição.
      Forneça também um comentário profissional de coach em 1 frase baseado no objetivo do usuário "{clientGoal}" e nível "{clientLevel}".
      
      O FORMATO DA RESPOSTA DEVE SER APENAS ESTE JSON (não adicione outro texto):
      {{
        "name": "Nome da comida",
        "p": número,
        "c": número,
        "f": número,
        "cal": número,
        "coachComment": "Seu comentário"
      }}`,
      workout_not_found: "Nenhum Treino Ativo Encontrado",
      workout_not_found_desc: "Seu treinador ainda não atribuiu um programa.",
      workout_active: "Programa Ativo",
      workout_movements: "Movimentos",
      workout_sets: "Séries",
      workout_finished: "Concluído",
      workout_btn_finish: "Finalizar Treino",
      note_label: "Nota",
      workout_weight: "Peso",
      workout_target: "Alvo",
      workout_toast_success: "Treino salvo com sucesso! 🔥",
      gallery_title: "Progresso e Forma",
      gallery_desc: "Acompanhe seu progresso e envie vídeos de forma para Seu Coach fazer análise técnica.",
      gallery_tab_photos: "Antes / Depois",
      gallery_tab_videos: "Verificação de Forma",
      gallery_upload: "Enviar Novo",
      gallery_video_link: "Cole aqui seu link de vídeo do Youtube/Drive/Vimeo...",
      gallery_btn_send: "Enviar",
      gallery_btn_delete: "Excluir",
      gallery_empty: "Nenhuma foto de progresso enviada ainda. Adicione uma nova foto para ver seu progresso!",
      gallery_coach_feedback: "Feedback do Treinador:",
      gallery_waiting: "Aguardando Revisão",
      gallery_toast_photo_success: "Foto enviada com sucesso para o Cofre! 📸",
      gallery_toast_video_error: "Por favor, insira um link válido do Youtube/Vimeo.",
      gallery_toast_video_success: "Vídeo enviado para aprovação do coach! 🎥",
      export_title: "Compartilhe Seus Ganhos",
      export_desc: "Deixe sua disciplina inspirar. Converta seu resumo semanal em um visual elegante no formato história Instagram com um clique e compartilhe com seus seguidores.",
      export_btn: "Baixar Immagine 📸",
      export_btn_loading: "Gerando...",
      export_card_report: "Relatório Semanal",
      export_card_streak: "Mantenha a Sequência!",
      export_card_cal: "Calorias Rastreadas",
      export_card_habit: "Hábitos Concluídos",
      export_card_habit_target: "Alvo",
      wellness_title: "Rastreamento de Bem-Estar",
      wellness_desc: "Registre métricas de desempenho diárias",
      wellness_btn: "Analisar",
      wellness_coach_wis: "Conselho do Treinador",
      wellness_toast_success: "Dados de bem-estar diários salvos! 🧠",
      wellness_error: "Não foi possível recuperar o comentário da IA, mas seus dados foram salvos.",
      wellness_prompt: `
        Você é um Elite Athletic Performance Coach. Um atleta inseriu os seguintes dados de bem-estar para hoje:
        RPE (Dificuldade): {rpe}/10
        Sono: {sleep} horas
        Energia: {energy}/10
        Estresse: {stress}/10

        Com base nesses dados, forneça um conselho de 2 a 3 frases, profissional, motivador e científico para o treino ou processo de recuperação do atleta amanhã. Seu conselho deve ser conciso, profissional e alinhado com a visão de "Atleta de Elite".
      `,
      wellness_sliders: [
        { key: "rpe", label: "RPE (Dificuldade do Treino)", icon: "🔥" },
        { key: "sleep", label: "Duração do Sono (Horas)", icon: "😴" },
        { key: "energy", label: "Nível de Energia", icon: "⚡" },
        { key: "stress", label: "Nível de Estresse", icon: "🧠" }
      ],
      roadmap_title: "Seu Mapa de Rota",
      roadmap_desc: "Passos para o sucesso",
      roadmap_current: "Fase Atual",
      roadmap_rank: "Cargo {}",
      roadmap_milestones: ["Estreante", "Liga Regional", "2ª Liga", "Liga das Sultanas", "Pro Elite"],
      roadmap_coach_msg_title: "Uma Mensagem da Seu Coach",
      roadmap_coach_msg_text: "Disciplina é a chave para a liga das rainhas. Cada treino que você faz hoje te aproxima um passo do topo."
    },
    admin: {
      dashboard_title: "Painel de Controlo",
      business_summary: "Resumo do Negócio",
      analytics_title: "Análise de Desempenho",
      progress_report_title: "Relatório de Progresso",
      total_measurements: "Medições Totais",
      habit_score: "Pontuação de Hábitos",
      data_driven_title: "Desempenho Baseado em Dados",
      data_driven_desc: "Estes gráficos foram concebidos para analisar os dados biométricos e a consistência do atleta. Cada medição ajuda-nos a otimizar a nossa estratégia.",
      btn_new_measurement: "Registar Nova Medição",
      chart_weight_trend: "Tendência de Peso",
      chart_weight_subtitle: "Análise Diária de 12 Semanas",
      chart_consistency: "Cartão de Disciplina",
      chart_consistency_subtitle: "Consistência do Treino",
      chart_body_comp: "Composição Corporal",
      chart_body_comp_subtitle: "Pontuação V-Taper e % de Gordura",
      chart_target_label: "OBJETIVO",
      heatmap_consistency_label: "Consistência nos últimos 30 dias",
      heatmap_days_label: "Dias de Treino",
      heatmap_quote: "A disciplina é a soma de pequenas escolhas diárias.",
      empty_client: "Cliente não encontrado.",
      btn_back: "Voltar",
      
      // KPI Cards
      kpi_active_clients: "Clientes Activos",
      kpi_total_registrations: "{} Registos Totais",
      kpi_monthly_revenue: "Receitas Mensais",
      kpi_monthly_recurring: "Recorrente Mensual",
      kpi_compliance_score: "Pontuação de Conformidade",
      kpi_weekly_average: "Média Semanal",
      kpi_new_applications: "Nova Solicitação",
      kpi_total_leads: "{} Leads Totais",
      
      // Leads section
      leads_crm: "CRM · Leads Potenciais",
      leads_title: "Solicitações Recebidas",
      leads_new_badge: "{} Nova Solicitação",
      leads_total_badge: "{} Total",
      leads_empty_title: "Ainda sem solicitações",
      leads_empty_desc: "As solicitações do formulário de contacto aparecerão aqui.",
      leads_th_name: "Nome",
      leads_th_phone: "Telemóvel",
      leads_th_goal: "Objetivo",
      leads_th_date: "Date",
      leads_th_status: "Estado",
      leads_th_action: "Ação",
      leads_status_new: "Novo",
      leads_status_contacted: "Contactado",
      leads_btn_form: "Enviar Formulário",
      leads_notes_title: "Notas da Solicitação",
      leads_goal_volleyball: "Desempenho no Voleibol",
      leads_goal_fitness: "Fitness / Força Geral",
      leads_goal_weight: "Perda de Peso / Tonificação",
      leads_goal_other: "Outro",
      
      // Toasts
      toast_leads_fetch_error: "Falha ao obter dados.",
      toast_leads_update_error: "Não foi possível atualizar o estado.",
      toast_leads_updated: "Estado da comunicação com {} actualizado ✅",
      toast_leads_form_sent: "Link do formulário enviado!",

      // Wellness Feed
      wellness_title: "Feed de Bem-estar do Atleta",
      wellness_subtitle: "Acompanhamento de Fadiga e Recuperação",
      wellness_empty: "Nenhuma entrada de bem-estar ainda.",
      wellness_sleep: "Sono",
      wellness_energy: "Energia",
      wellness_stress: "Estresse",
      wellness_send_feedback: "Enviar Comentário 💬",
      wellness_toast_success: "Mensagem de bem-estar preparada ✅",
      wellness_toast_error: "Número de telefone não encontrado.",
      wellness_msg_base: "Olá {name}! 👋 Analisei seus dados diários de bem-estar. ",
      wellness_msg_danger: "Seus níveis de fadiga e estresse parecem bastante altos. Recomendo pular o treino hoje e fazer uma recuperação completa. 🛑",
      wellness_msg_warning: "Você parece um pouco cansado hoje. Vamos reduzir a intensidade do treino em 50% ou focar em mobilidade. ⚠️",
      wellness_msg_safe: "Tudo parece ótimo! Continue com o desempenho. 🔥",

      // Student Manager
      students_title: "Gestão do Portal do Aluno 🎓",
      students_subtitle: "Criar e gerir acesso ao portal para alunos",
      students_count: "{} Alunos",
      students_no_email: "Sem e-mail",
      students_sessions: "{} Sessões",
      students_btn_close: "Fechar",
      students_btn_invite: "Convidar",
      students_mode_email: "📧 Conta de E-mail",
      students_mode_pin: "🔑 Convite por PIN",
      students_email_placeholder: "E-mail do aluno",
      students_password_placeholder: "Senha temporária (gerada automaticamente se vazio)",
      students_btn_creating: "Criando...",
      students_btn_create: "Criar Conta de Aluno",
      students_btn_generate_pin: "Gerar PIN & Link",
      students_toast_success: "Conta criada!\nE-mail: {email}\nSenha Temporária: {password}",
      students_email_label: "E-mail",
      students_password_label: "Senha Temporária",
      students_toast_error: "Erro: {message}",
      students_toast_copy_success: "✅ Link copiado!",
      students_btn_copy_link: "📋 Copiar Link",

      // Revenue & Payments
      revenue_title: "Análise de Receita",
      revenue_subtitle: "Desempenho MRR dos últimos 6 meses",
      revenue_monthly: "Receita Mensal",
      payments_title: "Acompanhamento de Receita e Pagamentos 💰",
      payments_subtitle: "Receita total e status de pagamento",
      payments_total: "Receita Total",
      payments_pending: "Pendente",
      payments_overdue: "Atrasado",
      payments_filter_all: "Todos",
      payments_filter_paid: "✅ Pago",
      payments_filter_pending: "⏳ Pendente",
      payments_filter_overdue: "⚠️ Atrasado",
      payments_status_paid: "Pago",
      payments_status_pending: "Pendente",
      payments_status_overdue: "Atrasado",
      payments_method_transfer: "Transferência",
      payments_method_cash: "Dinheiro"
    },
    legal: {
      kvkk_title: "RGPD & Política de Privacidade",
      terms_title: "Termos de Utilização",
      btn_close: "Entendido, Fechar",
      last_update: "Última atualização: 7 de abril de 2026",
      
      kvkk_intro: "Na {}, damos grande importância à segurança dos seus dados pessoais ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD).",
      kvkk_sections: [
        { title: "1. Responsável pelo Tratamento", content: "Como responsável pelo tratamento, {}, é responsável por todos os dados recolhidos através do website. Contacto: {}" },
        { title: "2. Dados Recolhidos", content: "Nome, e-mail, telemóvel, dados de saúde, medições físicas, fotos de progresso e cookies." },
        { title: "3. Finalidade", content: "Criação de planos personalizados, acompanhamento do desempenho e gestão de marcações." },
        { title: "4. Direitos", content: "Tem o direito de aceder, retificar ou eliminar os seus dados pessoais." }
      ],
      terms_intro: "Ao utilizar este website, aceita os seguintes termos de utilização. Por favor, leia-os com atenção.",
      terms_sections: [
        { title: "1. Descrição do Serviço", content: "{} oferece treino personalizado e consultoria nutricional." },
        { title: "2. Adesão", content: "As informações da conta são pessoais e não podem ser partilhadas." },
        { title: "3. Aviso de Saúde", content: "Os programas não constituem aconselhamento médico. Consulte um médico antes de começar." },
        { title: "4. Propriedade", content: "Todo o conteúdo pertence a {} e está protegido por direitos de autor." }
      ]
    },
    forms: {
      onboarding: {
        success_title: "Ótimo! Informações Recebidas.",
        success_desc: "Seu treinador entrará em contato via WhatsApp o mais rápido possível. Prepare-se!",
        step1_title: "Vamos te Conhecer.",
        step1_desc: "Vamos começar inserindo suas informações básicas.",
        step2_title: "Condição Física.",
        step2_desc: "Otimizaremos seus objetivos de acordo.",
        step3_title: "Detalhes Finais.",
        step3_desc: "Se houver, especifique sua lesão ou estado de saúde.",
        name_label: "Nome Completo",
        name_placeholder: "Qual é o seu nome?",
        phone_label: "Telefone",
        email_label: "E-mail",
        email_placeholder: "opcional",
        age_label: "Idade",
        height_label: "Altura",
        weight_label: "Peso",
        goal_label: "Qual é o seu Objetivo?",
        goal_placeholder: "Ex: Queima de gordura, ganho muscular...",
        health_label: "Problemas de Saúde / Lesões",
        health_placeholder: "Hérnia de disco, dor no joelho, etc.",
        allergy_label: "Alergias",
        allergy_placeholder: "Amendoim, glúten, etc.",
        note_label: "Nota para o Coach",
        note_placeholder: "Qualquer coisa que queira adicionar...",
        kvkk_label: "Li e compreendi o Consentimento Explícito e o Texto Informativo da KVKK sobre o processamento de todos os meus \"Dados Pessoais Sensíveis\", incluindo minhas declarações de saúde, e dou o meu consentimento explícito por minha livre vontade.",
        terms_label: "Li e entendi os Termos de Uso e aceito que os programas de treino e dieta não são aconselhamento médico, e qualquer risco físico/saúde que possa surgir é inteiramente meu.",
        btn_next: "Próximo Passo",
        btn_prev: "Voltar",
        btn_complete: "Concluir",
        toast_success: "Sua inscrição foi recebida com sucesso!"
      },
      measurement: {
        invalid_title: "Link Inválido",
        invalid_desc: "Solicite um novo link ao seu treinador.",
        success_title: "Registro com Sucesso!",
        success_desc: "Seu progresso está ótimo! Seus dados já estão refletidos nos gráficos.",
        welcome_title: "Bem-vindo",
        quote: "A medição que você faz hoje é a base do seu sucesso de amanhã.",
        step1_title: "Composição Corporal",
        step2_title: "Medições de Circunferência (cm)",
        step3_title: "Notas e Data",
        weight_label: "Peso (kg)",
        fat_label: "% de Gordura Corporal",
        shoulder_label: "Ombro",
        chest_label: "Peito",
        waist_label: "Cintura",
        hip_label: "Quadril",
        leg_label: "Perna",
        arm_label: "Braço",
        date_label: "Data da Medição",
        note_placeholder: "Alguma nota que queira adicionar para o seu treinador?",
        disclaimer: "Comprometo-me com a exatidão de todos os dados de medição que insiro. Declaro que aceito que as diretrizes de treino e nutrição não substituem o tratamento médico ou o conselho do médico; e se eu tiver um problema de saúde física ou mental, sou obrigado a relatar isso e procurar apoio médico profissional, se necessário.",
        btn_next: "Ir para Medições de Circunferência",
        btn_prev: "Voltar",
        btn_last: "Passo Final",
        btn_send: "Enviar",
        toast_weight_required: "Por favor, insira o seu peso.",
        toast_success: "Suas medições foram salvas com sucesso!"
      }
  },
  notFound: {
    title: "Página não encontrada",
    desc: "A página que você procura não existe ou foi movida.",
    backHome: "Voltar ao Início",
    redirect: "Você será redirecionado em {count} segundos"
  }
};
