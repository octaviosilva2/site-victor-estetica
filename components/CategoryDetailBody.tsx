import Link from "next/link";

import { routes, getProcedureByTitle, type CategoryWithSlug } from "@/lib/content";

type Props = {
  category: CategoryWithSlug;
  headingLevel?: "h1" | "h2";
  /**
   * Quando informado, clicar num procedimento abre o overlay em vez de navegar.
   * É o que mantém a experiência da home igual à prévia — o link continua
   * existindo no HTML para o Google seguir.
   */
  onProcedureSelect?: (procedureTitle: string) => void;
};

/**
 * Corpo do detalhe de uma área de atuação.
 * Compartilhado entre o overlay da home e a página /areas/[slug].
 */
export default function CategoryDetailBody({
  category,
  headingLevel = "h2",
  onProcedureSelect,
}: Props) {
  const Heading = headingLevel;
  // Mesma regra do detalhe de procedimento: não pular nível de heading.
  const SectionHeading = headingLevel === "h1" ? "h2" : "h3";

  return (
    <>
      <Heading className="cat-page-title">{category.name}</Heading>

      <div className="category-block">
        <b>Objetivo:</b> {category.objetivo}
      </div>
      {category.escolhaSe && (
        <div className="category-block">
          <b>Escolha esta área se:</b> {category.escolhaSe}
        </div>
      )}
      <div className="category-block">
        <b>Queixas comuns:</b> {category.queixas}
      </div>
      <div className="category-block">
        <b>Indicado para:</b> {category.indicado}
      </div>

      <SectionHeading className="detail-section-title">Procedimentos incluídos</SectionHeading>
      {/* data-track-item* são lidos pela medição. Não remover em refatoração.
          O tipo separa este card do card de área de mesmo nome ("Estética
          Regenerativa"), que sem ele viraria uma linha só no relatório. */}
      <div className="cat-proc-grid">
        {category.procedures.map((title) => {
          const procedure = getProcedureByTitle(title);
          if (!procedure) return null;

          return (
            <Link
              className="cat-proc-card"
              href={routes.procedure(procedure.slug)}
              key={procedure.slug}
              data-track-item={title}
              data-track-item-type="procedimento"
              onClick={
                onProcedureSelect
                  ? (event) => {
                      event.preventDefault();
                      onProcedureSelect(title);
                    }
                  : undefined
              }
            >
              <span>{title}</span>
              <span className="cat-proc-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
