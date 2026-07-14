// ============================================
// CONFIGURAÇÃO DO SITE - FÁCIL PERSONALIZAÇÃO
// ============================================

export const siteConfig = {
  // Informações do Profissional
  professional: {
    name: "Dr. Victor Folster",
    specialty: "Estética Avançada com Base Clínica",
    credentials: "CRF/SC 18.551 | RQE 19028-49",
    yearsExperience: 8,
    patientsServed: 3500,
    satisfactionRate: 98,
  },

  // Textos da seção Sobre
  about: {
    title: "Sobre o Profissional",
    description: `Especialista em Farmácia Estética e Clínica, com sólida experiência na integração entre conhecimento científico e prática estética avançada, dedicado a potencializar a beleza natural de cada paciente por meio de protocolos personalizados, seguros e com resultados harmoniosos e realistas.`,
    highlights: [
      "Especialização em Estética Avançada e Farmacoterapia Estética",
      "Residência em Urgência e Emergência – UFSC",
      "Avaliação estética com visão clínica integrada",
      "Planejamento individualizado e acompanhamento completo",
      "Atualização científica constante",
    ],
  },

  // Lista de Procedimentos
  procedures: [
    "Harmonização Facial",
    "Toxina Botulínica",
    "Preenchimento Labial",
    "Rinomodelação",
    "Bioestimulador de Colágeno",
    "Protocolo Reset",
    "Microagulhamento",
    "Lipo de Papada Enzimática",
    "Lipo Enzimática Corporal",
    "Peeling Químico",
  ],

  // Descrições detalhadas dos procedimentos
  procedureDetails: {
    "Harmonização Facial":
      "Planejamento individualizado que equilibra proporções e valoriza seus traços naturais com segurança e precisão técnica.\nO objetivo é realçar, não transformar — respeitando sua identidade facial.",
    "Toxina Botulínica":
      "Modulação muscular estratégica para suavizar linhas de expressão e prevenir marcas profundas.\nResultados naturais, mantendo a expressividade e a leveza do rosto.",
    "Preenchimento Labial":
      "Técnica precisa para restaurar volume, contorno e hidratação dos lábios com harmonia.\nFoco em proporção, naturalidade e integração ao conjunto facial.",
    "Rinomodelação":
      "Correção não cirúrgica de assimetrias e desníveis com ácido hialurônico.\nEstruturação sutil que equilibra o perfil sem perder autenticidade.",
    "Bioestimulador de Colágeno":
      "Estimula a produção natural de colágeno, promovendo firmeza e qualidade de pele progressivamente.\nTratamento regenerativo que respeita o tempo biológico do seu organismo.",
    "Protocolo Reset":
      "Abordagem estratégica para reequilibrar pele e tecido após inflamações, excessos ou procedimentos prévios.\nFoco em recuperar saúde cutânea antes de avançar para novos estímulos.",
    "Microagulhamento":
      "Indução controlada de colágeno para melhora de textura, poros, manchas e cicatrizes.\nEstimula regeneração profunda preservando a integridade da pele.",
    "Lipo de Papada Enzimática":
      "Aplicação de ativos lipolíticos que auxiliam na redução de gordura submentoniana.\nTratamento progressivo com avaliação clínica e acompanhamento criterioso.",
    "Lipo Enzimática Corporal":
      "Protocolo injetável para gordura localizada, atuando na quebra e metabolização dos adipócitos.\nPlanejamento individualizado para resultados graduais e naturais.",
    "Peeling Químico":
      "Renovação celular controlada que melhora manchas, textura e luminosidade.\nIndicado conforme o biotipo cutâneo, com segurança e previsibilidade.",
  } as Record<string, string>,

  // Diferenciais
  differentials: [
    {
      icon: "Heart",
      title: "Atendimento Humanizado",
      description: "Cada paciente é único. Tratamento personalizado com acolhimento e empatia.",
    },
    {
      icon: "Sparkles",
      title: "Técnicas Modernas",
      description: "Utilizamos as mais avançadas técnicas e equipamentos do mercado.",
    },
    {
      icon: "Target",
      title: "Resultados Naturais",
      description: "Valorizamos sua beleza natural com resultados harmoniosos e sutis.",
    },
    {
      icon: "Shield",
      title: "Ambiente Seguro",
      description: "Clínica equipada com todos os protocolos de biossegurança.",
    },
  ],

  // Depoimentos
  testimonials: [] as Array<{ name: string; rating: number; text: string }>,

  // Contato
  contact: {
    phone: "(48) 98814-9023",
    whatsapp: "5548988149023",
    email: "contato@clinica.com.br",
    address: "R. Henrique Spengler, 90 – Vila Nova",
    city: "Jaraguá do Sul – SC",
    cep: "89259-280",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.5!2d-49.0714!3d-26.4864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua+Henrique+Spengler%2C+90+-+Vila+Nova%2C+Jaragu%C3%A1+do+Sul+-+SC!5e0!3m2!1spt-BR!2sbr",
    clinicName: "Instituto Gaya - Jaraguá do Sul",
  },

  // Links
  links: {
    whatsappUrl: "https://wa.me/5548988149023?text=Olá,%20gostaria%20de%20agendar%20uma%20avaliação%20com%20o%20Dr.%20Victor%20Folster.",
    mapUrl: "https://www.google.com/maps?q=R.+Henrique+Spengler,+90+-+Vila+Nova,+Jaragu%C3%A1+do+Sul+-+SC,+89259-280",
  },

  // Redes Sociais
  social: {
    instagram: "https://instagram.com/dr.victorfolster",
    facebook: "",
  },

  // Textos do CTA
  cta: {
    heroButton: "Agendar Avaliação",
    finalTitle: "Sua melhor versão começa com um planejamento estratégico.",
    finalSubtitle: "Agende sua avaliação personalizada e descubra o protocolo ideal para você.",
    finalButton: "Agendar Avaliação",
  },
};
