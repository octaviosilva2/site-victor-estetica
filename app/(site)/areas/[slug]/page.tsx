import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { categoriesWithSlug, getCategoryBySlug, routes, absoluteUrl } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/siteConfig";
import { categoryJsonLd, breadcrumbJsonLd } from "@/lib/seo";

import Nav from "@/components/Nav";
import CategoryDetailBody from "@/components/CategoryDetailBody";
import FooterAndFloating from "@/components/FooterAndFloating";
import FadeInProvider from "@/components/FadeInProvider";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Gera as 5 páginas de área em tempo de build. */
export function generateStaticParams() {
  return categoriesWithSlug.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  const title = `${category.name} em ${siteConfig.address.city}`;
  const description = `${category.short} Com ${siteConfig.name}, ${siteConfig.role.toLowerCase()} em ${siteConfig.address.city}.`;
  const url = routes.category(category.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title: `${title} | ${siteConfig.name}`,
      description,
      images: ["/images/dr-victor-folster-hero.png"],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const breadcrumb = [
    { name: "Início", path: "/" },
    { name: category.name, path: routes.category(category.slug) },
  ];

  return (
    <>
      <Nav />

      <main className="detail-page">
        <div className="detail-header detail-header-page">
          <Link className="back-btn" href="/#procedimentos" aria-label="Voltar para a home">
            ←
          </Link>
          <div className="detail-title">{category.name}</div>
        </div>

        <div className="detail-body">
          <p className="eyebrow detail-page-eyebrow">Áreas de Atuação · {siteConfig.address.city}</p>
          <CategoryDetailBody category={category} headingLevel="h1" />

          <div className="next-step-card">
            <div className="eyebrow">Próximo passo</div>
            <h2>Não sabe qual procedimento é o seu caso?</h2>
            <p>
              A indicação exata sai da avaliação, não de uma lista. Conversa comigo e a gente
              define o caminho a partir do seu rosto.
            </p>
            <a className="btn" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Agendar Avaliação
            </a>
          </div>
        </div>
      </main>

      <FooterAndFloating />
      <FadeInProvider />

      <JsonLd data={[categoryJsonLd(category), breadcrumbJsonLd(breadcrumb)]} />
    </>
  );
}
