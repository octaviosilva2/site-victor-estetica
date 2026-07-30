// ============================================
// SEO — fonte única de verdade
//
// Este módulo é usado nos dois lados:
//   - no cliente, pelo componente <Seo>, que sincroniza o <head> na
//     navegação entre rotas;
//   - no build, por scripts/prerender.mjs, que serializa as mesmas tags
//     direto no HTML estático de cada rota.
//
// Manter os dois lados a partir dos mesmos dados evita o clássico
// "a meta tag do SSR não bate com a do cliente".
// ============================================

import { procedures, type Procedure } from "@/lib/procedures";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Domínio de produção. Pode ser sobrescrito por VITE_SITE_URL (útil para
 * ambientes de staging). Sem barra no final.
 */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || "https://victorfolster.com.br"
).replace(/\/$/, "");

/** Cidade-alvo do SEO local. */
export const TARGET_CITY = "Jaraguá do Sul";
const TARGET_REGION = "SC";

/** Imagem usada em compartilhamentos (Open Graph / Twitter). */
const OG_IMAGE = `${SITE_URL}/FOTO_PROFISSIONAL_VICTOR.jpg`;

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;

export const procedurePath = (slug: string) => `/procedimentos/${slug}`;

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: "website" | "article";
  robots: string;
  jsonLd: Record<string, unknown>[];
}

/** Corta o texto no limite de caracteres sem partir palavra ao meio. */
const truncate = (text: string, max: number) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

// ---------------------------------------------
// Dados estruturados (JSON-LD)
// ---------------------------------------------

const BUSINESS_ID = `${SITE_URL}/#business`;
const PERSON_ID = `${SITE_URL}/#victor-folster`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: siteConfig.contact.address,
  addressLocality: TARGET_CITY,
  addressRegion: TARGET_REGION,
  postalCode: siteConfig.contact.cep,
  addressCountry: "BR",
};

/**
 * O negócio é "HealthAndBeautyBusiness", não "MedicalBusiness": o Victor é
 * farmacêutico esteta, não médico, e o schema precisa refletir isso.
 */
const businessSchema = (): Record<string, unknown> => ({
  "@type": "HealthAndBeautyBusiness",
  "@id": BUSINESS_ID,
  name: `${siteConfig.professional.name} — Estética Avançada`,
  alternateName: siteConfig.contact.clinicName,
  url: SITE_URL,
  image: OG_IMAGE,
  description: `Estética avançada com base clínica em ${TARGET_CITY} – ${TARGET_REGION}: reestruturação facial, estética regenerativa e saúde capilar, com avaliação individual.`,
  telephone: `+${siteConfig.contact.whatsapp}`,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: -26.4864,
    longitude: -49.0714,
  },
  areaServed: {
    "@type": "City",
    name: TARGET_CITY,
  },
  sameAs: [siteConfig.social.instagram],
  // Só entram no schema quando preenchidos em siteConfig — melhor omitir do
  // que declarar horário ou preço que não confere.
  ...(siteConfig.contact.priceRange ? { priceRange: siteConfig.contact.priceRange } : {}),
  ...(siteConfig.contact.openingHours.length > 0
    ? {
        openingHoursSpecification: siteConfig.contact.openingHours.map((slot) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: slot.days,
          opens: slot.opens,
          closes: slot.closes,
        })),
      }
    : {}),
  founder: { "@id": PERSON_ID },
  employee: { "@id": PERSON_ID },
  makesOffer: procedures.map((procedure) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: procedure.title,
      url: absoluteUrl(procedurePath(procedure.slug)),
    },
  })),
});

const personSchema = (): Record<string, unknown> => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.professional.name,
  givenName: "Victor",
  familyName: "Folster",
  jobTitle: siteConfig.professional.role,
  description: siteConfig.about.description,
  image: OG_IMAGE,
  url: SITE_URL,
  worksFor: { "@id": BUSINESS_ID },
  sameAs: [siteConfig.social.instagram],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidade Federal de Santa Catarina (UFSC)",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Registro profissional",
    name: `${siteConfig.professional.council} ${siteConfig.professional.councilNumber}`,
    recognizedBy: {
      "@type": "Organization",
      name: "Conselho Regional de Farmácia de Santa Catarina",
    },
  },
  knowsAbout: procedures.map((procedure) => procedure.title),
});

const websiteSchema = (): Record<string, unknown> => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: `${siteConfig.professional.name} — Estética Avançada em ${TARGET_CITY}`,
  inLanguage: "pt-BR",
  publisher: { "@id": BUSINESS_ID },
});

const serviceSchema = (procedure: Procedure): Record<string, unknown> => ({
  "@type": "Service",
  "@id": `${absoluteUrl(procedurePath(procedure.slug))}#service`,
  name: procedure.title,
  serviceType: procedure.title,
  description: procedure.detail,
  url: absoluteUrl(procedurePath(procedure.slug)),
  provider: { "@id": BUSINESS_ID },
  areaServed: { "@type": "City", name: TARGET_CITY },
  category: "Estética Avançada",
});

/** FAQPage a partir das perguntas que estão visíveis na página. */
const faqSchema = (procedure: Procedure): Record<string, unknown> => ({
  "@type": "FAQPage",
  "@id": `${absoluteUrl(procedurePath(procedure.slug))}#faq`,
  mainEntity: procedure.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

const breadcrumbSchema = (procedure: Procedure): Record<string, unknown> => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Procedimentos", item: `${SITE_URL}/#procedimentos` },
    {
      "@type": "ListItem",
      position: 3,
      name: procedure.title,
      item: absoluteUrl(procedurePath(procedure.slug)),
    },
  ],
});

// ---------------------------------------------
// Metadados por rota
// ---------------------------------------------

/**
 * Monta o title do procedimento cabendo no limite prático de exibição do
 * Google (~60 caracteres), encurtando a marca antes de perder a palavra-chave
 * e a cidade, que é o que traz o clique.
 */
const buildProcedureTitle = (name: string) => {
  const candidates = [
    `${name} em ${TARGET_CITY} | ${siteConfig.professional.name}`,
    `${name} em ${TARGET_CITY} | Victor Folster`,
    `${name} em ${TARGET_CITY} – ${TARGET_REGION}`,
  ];
  return candidates.find((candidate) => candidate.length <= 60) ?? candidates[candidates.length - 1];
};

const homeSeo = (): PageSeo => ({
  title: `${siteConfig.professional.name} | ${siteConfig.professional.role} em ${TARGET_CITY}`,
  description: truncate(
    `${siteConfig.professional.role} em ${TARGET_CITY} – ${TARGET_REGION}: reestruturação facial, toxina botulínica, preenchimentos e estética regenerativa. Avaliação individual.`,
    158,
  ),
  canonical: SITE_URL,
  ogImage: OG_IMAGE,
  ogType: "website",
  robots: "index, follow, max-image-preview:large",
  jsonLd: [websiteSchema(), businessSchema(), personSchema()],
});

const procedureSeo = (procedure: Procedure): PageSeo => ({
  title: buildProcedureTitle(procedure.title),
  // O sufixo é curto de propósito: somado ao `short` mais longo dos 12
  // procedimentos, ainda cabe nos 158 caracteres sem truncar no meio da frase.
  description: truncate(
    `${procedure.short} Duração, sessões e recuperação. ${TARGET_CITY} – ${TARGET_REGION}.`,
    158,
  ),
  canonical: absoluteUrl(procedurePath(procedure.slug)),
  ogImage: OG_IMAGE,
  ogType: "article",
  robots: "index, follow, max-image-preview:large",
  jsonLd: [serviceSchema(procedure), faqSchema(procedure), breadcrumbSchema(procedure)],
});

const notFoundSeo = (pathname: string): PageSeo => ({
  title: `Página não encontrada | ${siteConfig.professional.name}`,
  description: "A página que você procura não existe ou foi movida.",
  canonical: absoluteUrl(pathname),
  ogImage: OG_IMAGE,
  ogType: "website",
  // Página de erro nunca deve ser indexada.
  robots: "noindex, follow",
  jsonLd: [],
});

/** Metadados de SEO da rota informada. */
export function getPageSeo(pathname: string): PageSeo {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return homeSeo();

  const match = path.match(/^\/procedimentos\/([^/]+)$/);
  if (match) {
    const procedure = procedures.find((p) => p.slug === match[1]);
    if (procedure) return procedureSeo(procedure);
  }

  return notFoundSeo(path);
}

/** Todas as rotas indexáveis — usado no prerender e no sitemap. */
export const indexableRoutes: string[] = [
  "/",
  ...procedures.map((procedure) => procedurePath(procedure.slug)),
];

// ---------------------------------------------
// Serialização para HTML (usada no build estático)
// ---------------------------------------------

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Serializa os metadados em tags HTML para injetar no <head> das páginas
 * estáticas geradas no build.
 */
export function renderSeoToHtml(seo: PageSeo): string {
  const meta: string[] = [
    `<title>${escapeAttribute(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}">`,
    `<meta name="robots" content="${escapeAttribute(seo.robots)}">`,
    `<link rel="canonical" href="${escapeAttribute(seo.canonical)}">`,
    `<meta property="og:type" content="${seo.ogType}">`,
    `<meta property="og:site_name" content="${escapeAttribute(siteConfig.professional.name)}">`,
    `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:url" content="${escapeAttribute(seo.canonical)}">`,
    `<meta property="og:title" content="${escapeAttribute(seo.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}">`,
    `<meta property="og:image" content="${escapeAttribute(seo.ogImage)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}">`,
    `<meta name="twitter:image" content="${escapeAttribute(seo.ogImage)}">`,
  ];

  if (seo.jsonLd.length > 0) {
    const graph = {
      "@context": "https://schema.org",
      "@graph": seo.jsonLd,
    };
    // Escapa "<" para não fechar o <script> por acidente.
    const json = JSON.stringify(graph).replace(/</g, "\\u003c");
    // data-seo-managed: marca o bloco para o componente <Seo> conseguir
    // substituí-lo na navegação. Sem isso, o schema da página de entrada
    // ficaria acumulado junto com o da página seguinte.
    meta.push(`<script type="application/ld+json" data-seo-managed>${json}</script>`);
  }

  return meta.join("\n    ");
}
