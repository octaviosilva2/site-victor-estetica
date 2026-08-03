// Camada de acesso ao conteúdo: gera slugs estáveis e faz a ponte
// entre os dados aprovados (siteData.ts) e as rotas do site.

import { procedures, categories, type Procedure, type Category } from "@/lib/siteData";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Converte um título em slug de URL.
 * "Reestruturação Facial" -> "reestruturacao-facial"
 * "Laser de CO2"          -> "laser-de-co2"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD") // separa cada letra do seu acento
    .replace(/[̀-ͯ]/g, "") // remove os acentos já separados
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // tudo que não é letra/número vira hífen
    .replace(/^-+|-+$/g, ""); // apara hífens das pontas
}

// --- Procedimentos ---------------------------------------------------------

export type ProcedureWithSlug = Procedure & { slug: string };

export const proceduresWithSlug: ProcedureWithSlug[] = procedures.map((p) => ({
  ...p,
  slug: slugify(p.title),
}));

export function getProcedureBySlug(slug: string): ProcedureWithSlug | undefined {
  return proceduresWithSlug.find((p) => p.slug === slug);
}

export function getProcedureByTitle(title: string): ProcedureWithSlug | undefined {
  return proceduresWithSlug.find((p) => p.title === title);
}

/** Índice do procedimento no array original — usado pelos overlays da home. */
export function getProcedureIndex(title: string): number {
  return procedures.findIndex((p) => p.title === title);
}

// --- Áreas de atuação ------------------------------------------------------

export type CategoryWithSlug = Category & { slug: string };

export const categoriesWithSlug: CategoryWithSlug[] = categories.map((c) => ({
  ...c,
  slug: slugify(c.name),
}));

export function getCategoryBySlug(slug: string): CategoryWithSlug | undefined {
  return categoriesWithSlug.find((c) => c.slug === slug);
}

/** Áreas que incluem um dado procedimento — alimenta o link cruzado nas páginas. */
export function getCategoriesForProcedure(title: string): CategoryWithSlug[] {
  return categoriesWithSlug.filter((c) => c.procedures.includes(title));
}

// --- URLs ------------------------------------------------------------------

export const routes = {
  home: "/",
  procedure: (slug: string) => `/procedimentos/${slug}`,
  category: (slug: string) => `/areas/${slug}`,
};

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
