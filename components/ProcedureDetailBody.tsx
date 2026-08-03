import Link from "next/link";

import { whatsappProcedureUrl } from "@/lib/siteConfig";
import { routes, getCategoriesForProcedure, type ProcedureWithSlug } from "@/lib/content";

type Props = {
  procedure: ProcedureWithSlug;
  /**
   * Como o título principal é renderizado.
   * "h1" na página dedicada (é o título da página);
   * "h2" dentro do overlay da home, onde o h1 já é o nome do Victor.
   */
  headingLevel?: "h1" | "h2";
  /** Mostra os links para as áreas que incluem este procedimento. Só na página. */
  showRelatedCategories?: boolean;
};

/**
 * Corpo do detalhe de um procedimento.
 *
 * Usado nos dois lugares: dentro do overlay da home e na página
 * /procedimentos/[slug]. Um arquivo só, para o conteúdo nunca divergir
 * entre o que o visitante vê e o que o Google indexa.
 */
export default function ProcedureDetailBody({
  procedure,
  headingLevel = "h2",
  showRelatedCategories = false,
}: Props) {
  const Heading = headingLevel;
  // Mantém a hierarquia sem pular nível: h1 -> h2 na página dedicada,
  // h2 -> h3 dentro do overlay da home.
  const SectionHeading = headingLevel === "h1" ? "h2" : "h3";
  const relatedCategories = showRelatedCategories
    ? getCategoriesForProcedure(procedure.title)
    : [];

  return (
    <>
      <Heading className="proc-page-title">{procedure.title}</Heading>
      <p className="detail-desc">{procedure.detail}</p>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">Duração do efeito</div>
          <div className="info-value">{procedure.duracao}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Indicado para</div>
          <div className="info-value">{procedure.indicado}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Sessões</div>
          <div className="info-value">{procedure.sessoes}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Recuperação</div>
          <div className="info-value">{procedure.recuperacao}</div>
        </div>
      </div>

      <SectionHeading className="detail-section-title">Benefícios</SectionHeading>
      <ul className="benefit-list">
        {procedure.beneficios.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <SectionHeading className="detail-section-title">Como é feito, passo a passo</SectionHeading>
      <div className="step-list">
        {procedure.passos.map(([titulo, descricao], index) => (
          <div className="step-item" key={titulo}>
            <div className="step-num">{index + 1}</div>
            <div>
              <div className="step-title">{titulo}</div>
              <div className="step-desc">{descricao}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading className="detail-section-title">Cuidados pós-procedimento</SectionHeading>
      <ul className="benefit-list">
        {procedure.posCare.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="poscare-note">
        Outras orientações podem ser indicadas conforme a individualidade de cada paciente,
        definidas durante a consulta.
      </p>

      <SectionHeading className="detail-section-title">Perguntas frequentes</SectionHeading>
      <div>
        {procedure.faq.map(([pergunta, resposta]) => (
          <div className="faq-detail-item" key={pergunta}>
            <div className="faq-detail-q">{pergunta}</div>
            <div className="faq-detail-a">{resposta}</div>
          </div>
        ))}
      </div>

      {relatedCategories.length > 0 && (
        <>
          <SectionHeading className="detail-section-title">Faz parte destas áreas de atuação</SectionHeading>
          <div className="proc-chip-grid">
            {relatedCategories.map((category) => (
              <Link className="proc-chip" href={routes.category(category.slug)} key={category.slug}>
                {category.name}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="next-step-card">
        <div className="eyebrow">Próximo passo</div>
        <SectionHeading>Pronto para agendar sua avaliação?</SectionHeading>
        <p>{procedure.cta}</p>
        <a
          className="btn"
          href={whatsappProcedureUrl(procedure.title)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Agendar Avaliação
        </a>
      </div>
      <p className="contraindication-note">
        Contraindicações específicas são avaliadas individualmente durante a consulta,
        considerando seu histórico de saúde.
      </p>
    </>
  );
}
