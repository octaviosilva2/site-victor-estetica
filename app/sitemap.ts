import type { MetadataRoute } from "next";

import { proceduresWithSlug, categoriesWithSlug, routes, absoluteUrl } from "@/lib/content";

/**
 * Sitemap com as 19 URLs do site (home + 5 áreas + 13 procedimentos).
 * Fica disponível em /sitemap.xml — é o arquivo a enviar no Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl(routes.home),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...categoriesWithSlug.map((category) => ({
      url: absoluteUrl(routes.category(category.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...proceduresWithSlug.map((procedure) => ({
      url: absoluteUrl(routes.procedure(procedure.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
