import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { proceduresWithSlug, getProcedureBySlug, routes, absoluteUrl } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { procedureJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

import Nav from "@/components/Nav";
import ProcedureDetailBody from "@/components/ProcedureDetailBody";
import FooterAndFloating from "@/components/FooterAndFloating";
import FadeInProvider from "@/components/FadeInProvider";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Gera as 13 páginas em tempo de build — HTML pronto, sem custo de servidor. */
export function generateStaticParams() {
  return proceduresWithSlug.map((procedure) => ({ slug: procedure.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const procedure = getProcedureBySlug(slug);

  if (!procedure) return {};

  const title = `${procedure.title} em ${siteConfig.address.city}`;
  const description = `${procedure.short} Avaliação individual com ${siteConfig.name}, ${siteConfig.role.toLowerCase()} em ${siteConfig.address.city}.`;
  const url = routes.procedure(procedure.slug);

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

export default async function ProcedurePage({ params }: Props) {
  const { slug } = await params;
  const procedure = getProcedureBySlug(slug);

  if (!procedure) notFound();

  const breadcrumb = [
    { name: "Início", path: "/" },
    { name: procedure.title, path: routes.procedure(procedure.slug) },
  ];

  return (
    <>
      <Nav />

      <main className="detail-page">
        <div className="detail-header detail-header-page">
          <Link className="back-btn" href="/#procedimentos" aria-label="Voltar para a home">
            ←
          </Link>
          <div className="detail-title">{procedure.title}</div>
        </div>

        <div className="detail-body">
          <p className="eyebrow detail-page-eyebrow">
            {siteConfig.tagline}
          </p>
          <ProcedureDetailBody
            procedure={procedure}
            headingLevel="h1"
            showRelatedCategories
          />
        </div>
      </main>

      <FooterAndFloating />
      <FadeInProvider />

      <JsonLd
        data={[
          procedureJsonLd(procedure),
          faqJsonLd(procedure.faq),
          breadcrumbJsonLd(breadcrumb),
        ]}
      />
    </>
  );
}
