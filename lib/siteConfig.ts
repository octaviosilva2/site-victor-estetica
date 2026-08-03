// Fonte única de verdade para links, contato e dados do negócio.
// Qualquer troca de telefone, endereço ou perfil social se faz SÓ aqui.

export const siteConfig = {
  // --- Identidade ---
  name: "Dr. Victor Folster",
  shortName: "Victor Folster",
  role: "Farmacêutico Esteta",
  tagline: "Estética Avançada · Jaraguá do Sul",
  credentials: "CRF/SC 18.551 · RQE 19028-49",

  // --- Domínio (usado em canonical, sitemap, Open Graph e JSON-LD) ---
  url: "https://www.victorfolster.com.br",

  // --- Contato ---
  phone: {
    // Formato internacional sem símbolos, exigido pelo wa.me
    raw: "5548988149023",
    // Formato E.164, exigido pelo JSON-LD
    e164: "+5548988149023",
    display: "(48) 98814-9023",
  },

  // --- Endereço ---
  address: {
    place: "Instituto Gaya",
    street: "Rua Henrique Spengler, 90",
    district: "Vila Nova",
    city: "Jaraguá do Sul",
    state: "SC",
    stateFull: "Santa Catarina",
    zip: "89259-280",
    country: "BR",
    latitude: -26.4961024,
    longitude: -49.0852676,
  },

  // --- Links externos ---
  links: {
    instagram: "https://instagram.com/dr.victorfolster",
    instagramHandle: "@dr.victorfolster",
    // Perfil no Google Meu Negócio — alimenta o botão de mapa e o JSON-LD
    googleBusiness:
      "https://www.google.com/maps/place/Dr.+Victor+Folster+I+Farmac%C3%AAutico+Esteta+l+Harmoniza%C3%A7%C3%A3o+Facial/@-26.4960976,-49.0878425,17z/data=!3m1!4b1!4m6!3m5!1s0xa4fc7b97b12092f1:0x47446b87ff345053!8m2!3d-26.4961024!4d-49.0852676!16s%2Fg%2F11x_hbp_y1",
    // Canal de transmissão do WhatsApp com oportunidades e pacientes modelo
    whatsappChannel: "https://whatsapp.com/channel/0029VbDm8JH6LwHoaqLoVK3K",
  },

  // --- Flags ---
  flags: {
    // Modal de captura de lead: ligar quando a automação de disparo estiver definida.
    // Ao ligar, conectar o submit em components/WelcomeModal.tsx (hoje só fecha).
    welcomeModal: false,
  },
} as const;

/**
 * Monta o link do WhatsApp já com a mensagem digitada para o paciente.
 * Sem argumento, usa a mensagem padrão de agendamento.
 */
export function whatsappUrl(message?: string): string {
  const text =
    message ??
    "Olá, Dr. Victor! Vim pelo site e gostaria de agendar uma avaliação.";
  return `https://wa.me/${siteConfig.phone.raw}?text=${encodeURIComponent(text)}`;
}

/** Link de WhatsApp para um procedimento específico — o paciente já chega contextualizado. */
export function whatsappProcedureUrl(procedureTitle: string): string {
  return whatsappUrl(
    `Olá, Dr. Victor! Vim pelo site e gostaria de saber mais sobre ${procedureTitle}.`,
  );
}

/** Endereço em uma linha, para JSON-LD e textos corridos. */
export const fullAddress = `${siteConfig.address.street} – ${siteConfig.address.district}, ${siteConfig.address.city} – ${siteConfig.address.state}, ${siteConfig.address.zip}`;
