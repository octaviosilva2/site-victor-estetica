import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Procedure } from "@/lib/procedures";
import ScheduleButton from "@/components/ScheduleButton";

interface ProcedureDetailProps {
  /** Procedimento aberto, ou null quando a tela está fechada. */
  procedure: Procedure | null;
  onClose: () => void;
}

/**
 * Tela de detalhe do procedimento: desliza da direita como se fosse outra
 * página, com botão voltar. O botão "voltar" do navegador/celular também
 * fecha a tela, em vez de sair do site.
 */
const ProcedureDetail = ({ procedure, onClose }: ProcedureDetailProps) => {
  const isOpen = Boolean(procedure);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  /** Elemento que abriu a tela, para devolver o foco ao fechar. */
  const openerRef = useRef<HTMLElement | null>(null);

  // Mantém o último procedimento em tela durante a animação de saída.
  const [shown, setShown] = useState<Procedure | null>(procedure);
  useEffect(() => {
    if (procedure) setShown(procedure);
  }, [procedure]);

  /** Fecha e descarta a entrada de histórico criada na abertura. */
  const handleClose = () => {
    onClose();
    if (window.history.state?.procedureDetail) window.history.back();
  };

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    openerRef.current = document.activeElement as HTMLElement | null;

    // Entrada de histórico própria: o "voltar" fecha a tela de detalhe.
    window.history.pushState({ procedureDetail: true }, "");

    const handlePopState = () => onClose();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={shown ? `Procedimento: ${shown.title}` : undefined}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-background transition-transform [transition-duration:350ms] ease-out",
        isOpen ? "translate-x-0" : "pointer-events-none invisible translate-x-full",
      )}
    >
      {shown && (
        <>
          <div className="sticky top-0 z-10 flex items-center gap-3.5 bg-primary px-5 py-4 text-white">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Voltar para a lista de procedimentos"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="font-serif text-[19px] font-normal">{shown.title}</h2>
          </div>

          <div className="mx-auto max-w-[40rem] px-6 pb-16 pt-7">
            <p className="mb-7 text-[15px] leading-[1.7] text-foreground-muted">{shown.detail}</p>

            {/* 4 cards rápidos */}
            <dl className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Duração do efeito", value: shown.duracao },
                { label: "Indicado para", value: shown.indicado },
                { label: "Sessões", value: shown.sessoes },
                { label: "Recuperação", value: shown.recuperacao },
              ].map((info) => (
                <div key={info.label} className="rounded-[2px] border border-border bg-white p-4">
                  <dt className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-primary">
                    {info.label}
                  </dt>
                  <dd className="m-0 text-[13.5px] italic leading-[1.5] text-foreground-muted">
                    {info.value}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">Benefícios</h3>
            <ul className="m-0 list-none p-0">
              {shown.beneficios.map((benefit) => (
                <li
                  key={benefit}
                  className="relative border-t border-border py-2.5 pl-5 text-[14px] text-foreground-muted"
                >
                  <span aria-hidden="true" className="absolute left-0 font-bold text-primary">
                    —
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <h3 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">
              Como é feito, passo a passo
            </h3>
            <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
              {shown.passos.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-[2px] border border-border bg-white p-3.5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="mb-0.5 block text-[13.5px] font-bold text-foreground">
                      {step.title}
                    </span>
                    <span className="block text-[13px] leading-[1.5] text-foreground-muted">
                      {step.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <h3 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">
              Perguntas frequentes
            </h3>
            <dl className="m-0">
              {shown.faq.map((item) => (
                <div key={item.question} className="border-t border-border py-3.5 last:border-b">
                  <dt className="mb-1.5 text-[13.5px] font-bold">{item.question}</dt>
                  <dd className="m-0 text-[13px] leading-[1.55] text-foreground-muted">{item.answer}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 rounded-[2px] bg-primary px-6 py-8 text-center text-white">
              <p className="eyebrow m-0 text-white/65">Próximo passo</p>
              <h3 className="mb-2.5 mt-2 text-[19px] font-normal text-white">
                Pronto para agendar sua avaliação?
              </h3>
              <p className="mb-5 text-[13.5px] leading-[1.55] text-white/75">{shown.cta}</p>
              <ScheduleButton
                variant="light"
                message={`Olá! Gostaria de agendar uma avaliação sobre ${shown.title} com o Dr. Victor Folster.`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProcedureDetail;
