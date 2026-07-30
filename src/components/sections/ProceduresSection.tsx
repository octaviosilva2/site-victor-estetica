import { useState } from "react";
import { procedures } from "@/lib/procedures";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";
import ProcedureDetail from "@/components/ProcedureDetail";

const ProceduresSection = () => {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const activeProcedure = procedures.find((p) => p.slug === openSlug) ?? null;

  return (
    <>
      <section id="procedimentos" className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="eyebrow m-0">Procedimentos</p>
            <h2 className="mb-4 mt-3 text-[27px] font-normal">Áreas de atuação</h2>
            <p className="mb-9 max-w-[32.5rem] text-[15px] leading-[1.6] text-foreground-muted">
              Cada procedimento é indicado após avaliação individual — nenhum protocolo é aplicado de forma
              padronizada.
            </p>
          </FadeIn>

          <FadeInUp delay={120}>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {procedures.map((procedure) => (
                <li key={procedure.slug}>
                  <button
                    type="button"
                    onClick={() => setOpenSlug(procedure.slug)}
                    aria-haspopup="dialog"
                    className="flex w-full items-center justify-between gap-3 rounded-[2px] bg-primary p-[22px] text-left text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span>
                      <span className="block font-serif text-[17px] font-normal">{procedure.title}</span>
                      <span className="mt-1 block text-[12.5px] text-white/65">{procedure.short}</span>
                    </span>
                    <span aria-hidden="true" className="flex-shrink-0 text-[18px] italic text-white/70">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>
      </section>

      <ProcedureDetail procedure={activeProcedure} onClose={() => setOpenSlug(null)} />
    </>
  );
};

export default ProceduresSection;
