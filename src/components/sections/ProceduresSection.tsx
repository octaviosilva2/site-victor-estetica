import { Link } from "react-router-dom";
import { procedures } from "@/lib/procedures";
import { procedurePath, TARGET_CITY } from "@/lib/seo";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

/**
 * Lista de procedimentos. Cada card é um link real para a página do
 * procedimento — é assim que essas 12 páginas ficam rastreáveis.
 */
const ProceduresSection = () => (
  <section id="procedimentos" className="section-padding bg-background">
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <p className="eyebrow m-0">Procedimentos</p>
        <h2 className="mb-4 mt-3 text-[27px] font-normal">
          Procedimentos de estética avançada em {TARGET_CITY}
        </h2>
        <p className="mb-9 max-w-[32.5rem] text-[15px] leading-[1.6] text-foreground-muted">
          Cada procedimento é indicado após avaliação individual — nenhum protocolo é aplicado de forma
          padronizada. Toque em um procedimento para ver duração, sessões, recuperação e as dúvidas mais
          comuns.
        </p>
      </FadeIn>

      <FadeInUp delay={120}>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {procedures.map((procedure) => (
            <li key={procedure.slug}>
              <Link
                to={procedurePath(procedure.slug)}
                className="flex items-center justify-between gap-3 rounded-[2px] bg-primary p-[22px] text-left text-white no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span>
                  <span className="block font-serif text-[17px] font-normal">{procedure.title}</span>
                  <span className="mt-1 block text-[12.5px] text-white/65">{procedure.short}</span>
                </span>
                <span aria-hidden="true" className="flex-shrink-0 text-[18px] italic text-white/70">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </FadeInUp>
    </div>
  </section>
);

export default ProceduresSection;
