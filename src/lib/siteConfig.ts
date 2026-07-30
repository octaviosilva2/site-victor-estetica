// ============================================
// CONFIGURAÇÃO DO SITE - FÁCIL PERSONALIZAÇÃO
//
// A lista de procedimentos (com descrição, benefícios, passo a passo
// e FAQ) fica em src/lib/procedures.ts.
// ============================================

export const siteConfig = {
  // Informações do Profissional
  professional: {
    name: "Dr. Victor Folster",
    // Farmacêutico esteta — NÃO usar "Estética Médica" em nenhum lugar do site.
    specialty: "Estética Avançada com Base Clínica",
    role: "Farmacêutico Esteta",
    specialtyLine: "Farmacêutico Esteta · Estética Regenerativa · Reestruturação Facial",
    focusAreas: "Reestruturação Facial, Estética Regenerativa e Saúde Capilar",
    city: "Jaraguá do Sul",
    credentials: "CRF/SC 18.551 | RQE 19028-49",
    council: "CRF/SC",
    councilNumber: "18.551",
    yearsExperience: 3,
  },

  // Textos da seção Sobre
  about: {
    title: "Sobre o Dr. Victor Folster",
    description: `Farmacêutico (CRF/SC 18.551 | RQE 19028-49), formado pela UFSC, com residência em Urgência e Emergência, formação em Farmacologia Estética e pós-graduação em Estética Avançada e Harmonização Facial e Corporal. Atua em estética há quase três anos, sempre a partir de planejamento individual — não de protocolo padrão. Aqui não há promessa de resultado milagroso: o critério é ciência, segurança e naturalidade.`,
    highlights: [
      "Graduação em Farmácia pela UFSC",
      "Residência em Urgência e Emergência",
      "Formação em Farmacologia Estética",
      "Pós-graduação em Estética Avançada e Harmonização Facial e Corporal",
    ],
  },

  // Checklist do hero
  heroChecklist: [
    "Avaliação individual, sem protocolo padrão",
    "Resultados naturais, sem promessa de milagre",
    "Produtos e protocolos regulamentados",
  ],

  // Método — fluxo de trabalho
  method: {
    steps: ["Avaliação", "Planejamento", "Procedimento"],
    quote: "Naturalidade não é acaso. É planejamento.",
  },

  // Diferenciais (os ícones são nomes de ícones do lucide-react)
  differentials: [
    {
      icon: "ClipboardCheck",
      title: "Avaliação antes de tudo",
      description: "Nenhum procedimento é indicado sem uma avaliação individual completa do seu caso.",
    },
    {
      icon: "Droplet",
      title: "Resultado sem exagero",
      description: "O objetivo é harmonia, não transformação — resultado que respeita sua identidade.",
    },
    {
      icon: "ShieldCheck",
      title: "Segurança farmacêutica",
      description:
        "Protocolos e produtos regulamentados, com responsabilidade técnica de um farmacêutico esteta.",
    },
    {
      icon: "BookOpen",
      title: "Base científica",
      description: "Técnicas atualizadas com respaldo em literatura científica, não em tendência.",
    },
    {
      icon: "CalendarDays",
      title: "Agenda reservada",
      description: "Atendimento sem volume — cada horário é dedicado inteiramente a um único paciente.",
    },
    {
      icon: "MessageCircle",
      title: "Acompanhamento real",
      description: "Orientação e suporte após o procedimento, do planejamento até a recuperação.",
    },
  ],

  // Contato
  contact: {
    whatsapp: "5548988149023",
    whatsappDisplay: "(48) 98814-9023",
    // PENDENTE: o Dr. Victor ainda não passou o e-mail.
    // Assim que preencher aqui, a linha aparece sozinha no bloco de contato.
    email: "",
    address: "Rua Henrique Spengler, 90 – Vila Nova",
    city: "Jaraguá do Sul – SC",
    cep: "89259-280",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.5!2d-49.0714!3d-26.4864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua+Henrique+Spengler%2C+90+-+Vila+Nova%2C+Jaragu%C3%A1+do+Sul+-+SC!5e0!3m2!1spt-BR!2sbr",
    clinicName: "Instituto Gaya - Jaraguá do Sul",
  },

  // Links
  links: {
    whatsappUrl:
      "https://wa.me/5548988149023?text=Olá,%20gostaria%20de%20agendar%20uma%20avaliação%20com%20o%20Dr.%20Victor%20Folster.",
    mapUrl:
      "https://www.google.com/maps?q=R.+Henrique+Spengler,+90+-+Vila+Nova,+Jaragu%C3%A1+do+Sul+-+SC,+89259-280",
  },

  // Redes Sociais
  social: {
    instagram: "https://instagram.com/dr.victorfolster",
    instagramHandle: "@dr.victorfolster",
    facebook: "",
  },

  // Navegação
  nav: [
    { label: "Procedimentos", href: "#procedimentos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Resultados", href: "#resultados" },
    { label: "Contato", href: "#contato" },
  ],

  // Textos do CTA
  cta: {
    heroButton: "Agendar Avaliação",
    secondaryButton: "Conhecer Procedimentos",
    finalTitle: "Sua melhor versão começa com um planejamento estratégico.",
    finalSubtitle: "Agende sua avaliação personalizada e descubra o protocolo ideal para você.",
    finalButton: "Agendar Avaliação",
  },

  // Rodapé
  footer: {
    brandLine: "Estética com base clínica, planejamento e responsabilidade profissional.",
  },
};

/** Abre o WhatsApp com uma mensagem opcional sobre um procedimento específico. */
export const whatsappLink = (message?: string) =>
  message
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
    : siteConfig.links.whatsappUrl;
