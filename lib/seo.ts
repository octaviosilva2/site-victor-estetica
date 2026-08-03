// Dados estruturados (JSON-LD) e helpers de metadata.
// É o que faz o Google entender que existe um negócio local em Jaraguá do Sul,
// quem é o profissional, e o que cada página de procedimento oferece.

import { siteConfig } from "@/lib/siteConfig";
import { absoluteUrl, routes, type ProcedureWithSlug, type CategoryWithSlug } from "@/lib/content";

const BUSINESS_ID = `${siteConfig.url}/#negocio`;
const PERSON_ID = `${siteConfig.url}/#victor-folster`;

/** O negócio local. Alimenta o painel de conhecimento e a busca por "estética Jaraguá do Sul". */
export function businessJsonLd() {
  const { address, phone, links } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": BUSINESS_ID,
    name: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      "Estética avançada com planejamento individual em Jaraguá do Sul: arquitetura facial, estética regenerativa e envelhecimento saudável.",
    url: siteConfig.url,
    telephone: phone.e164,
    image: absoluteUrl("/images/dr-victor-folster-hero.png"),
    logo: absoluteUrl("/images/logo-victor-folster.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      name: address.place,
      streetAddress: `${address.street} – ${address.district}`,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    hasMap: links.googleBusiness,
    sameAs: [links.instagram, links.googleBusiness],
    areaServed: {
      "@type": "City",
      name: address.city,
      containedInPlace: { "@type": "State", name: address.stateFull },
    },
    employee: { "@id": PERSON_ID },
  };
}

/** O profissional. Ajuda o Google a ligar o nome "Victor Folster" ao negócio e às credenciais. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description:
      "Farmacêutico esteta formado pela UFSC, com residência em Urgência e Emergência, formação em Farmacologia Estética e pós-graduação em Estética Avançada e Harmonização Facial e Corporal.",
    url: siteConfig.url,
    image: absoluteUrl("/images/dr-victor-folster-sobre.png"),
    telephone: siteConfig.phone.e164,
    sameAs: [siteConfig.links.instagram],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidade Federal de Santa Catarina",
    },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "CRF/SC 18.551" },
      { "@type": "EducationalOccupationalCredential", name: "RQE 19028-49" },
    ],
    worksFor: { "@id": BUSINESS_ID },
  };
}

/** Um procedimento específico, com passo a passo e cuidados pós. */
export function procedureJsonLd(procedure: ProcedureWithSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: procedure.title,
    description: procedure.detail,
    url: absoluteUrl(routes.procedure(procedure.slug)),
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Face",
    howPerformed: procedure.passos.map(([titulo, desc]) => `${titulo}: ${desc}`).join(" "),
    followup: procedure.posCare.join(" "),
    indication: {
      "@type": "MedicalIndication",
      description: procedure.indicado,
    },
    provider: { "@id": BUSINESS_ID },
  };
}

/** As perguntas frequentes de um procedimento. */
export function faqJsonLd(faq: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** Trilha de navegação — aparece no resultado de busca no lugar da URL crua. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Uma área de atuação e os procedimentos que ela reúne. */
export function categoryJsonLd(category: CategoryWithSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: category.name,
    description: category.objetivo,
    url: absoluteUrl(routes.category(category.slug)),
    about: {
      "@type": "MedicalSpecialty",
      name: category.name,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: category.procedures.map((title, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
      })),
    },
  };
}
