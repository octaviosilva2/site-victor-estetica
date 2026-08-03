"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  categoriesWithSlug,
  getCategoryBySlug,
  getProcedureByTitle,
  routes,
} from "@/lib/content";
import CategoryDetailBody from "@/components/CategoryDetailBody";
import ProcedureDetailBody from "@/components/ProcedureDetailBody";

/**
 * Os cards de "Áreas de Atuação" e os dois overlays de detalhe.
 *
 * Cada card é um link de verdade (<a href="/areas/...">), então o Google
 * segue e indexa. No navegador, o clique é interceptado e abre o overlay —
 * exatamente a experiência da prévia aprovada.
 */
export default function CategoryExplorer() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [procedureTitle, setProcedureTitle] = useState<string | null>(null);

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const procedure = procedureTitle ? getProcedureByTitle(procedureTitle) : undefined;

  // Esc fecha o overlay que estiver por cima
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (procedureTitle) setProcedureTitle(null);
      else if (categorySlug) setCategorySlug(null);
    },
    [categorySlug, procedureTitle],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const openCategory = (slug: string) => {
    setCategorySlug(slug);
    window.scrollTo(0, 0);
  };

  const openProcedure = (title: string) => {
    setProcedureTitle(title);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div id="category-list">
        {categoriesWithSlug.map((item) => (
          <Link
            className="category-card fade"
            href={routes.category(item.slug)}
            key={item.slug}
            onClick={(event) => {
              event.preventDefault();
              openCategory(item.slug);
            }}
          >
            <h3 className="category-title">{item.name}</h3>
            <div className="category-block">{item.short}</div>
            <div className="category-see-more">Ver detalhes →</div>
          </Link>
        ))}
      </div>

      {/* Overlay da área de atuação. Fica no DOM mesmo fechado, para a transição
          de entrada funcionar — por isso o aria-hidden, senão um leitor de tela
          leria o conteúdo de um painel que ainda não está visível. */}
      <div
        className={`detail-overlay${category ? " open" : ""}`}
        style={{ zIndex: 52 }}
        aria-hidden={!category}
      >
        <div className="detail-header">
          <button className="back-btn" onClick={() => setCategorySlug(null)} aria-label="Voltar">
            ←
          </button>
          <div className="detail-title">{category?.name}</div>
        </div>
        <div className="detail-body">
          {category && (
            <CategoryDetailBody category={category} onProcedureSelect={openProcedure} />
          )}
        </div>
      </div>

      {/* Overlay do procedimento — fica por cima do de área */}
      <div
        className={`detail-overlay${procedure ? " open" : ""}`}
        style={{ zIndex: 55 }}
        aria-hidden={!procedure}
      >
        <div className="detail-header">
          <button
            className="back-btn"
            onClick={() => setProcedureTitle(null)}
            aria-label="Voltar"
          >
            ←
          </button>
          <div className="detail-title">{procedure?.title}</div>
        </div>
        <div className="detail-body">
          {procedure && <ProcedureDetailBody procedure={procedure} />}
        </div>
      </div>
    </>
  );
}
