import { whatsappUrl } from "@/lib/siteConfig";

export default function FinalSection() {
  return (
    <section className="final">
      <div className="container">
        <h2 className="fade">Sua melhor versão começa com um planejamento estratégico.</h2>
        <p className="fade">
          Agende sua avaliação personalizada e descubra o protocolo ideal para você.
        </p>
        {/* data-track* são lidos pela medição para saber qual botão de
            agendamento converteu. Não remover em refatoração. */}
        <a
          className="btn fade"
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          data-track="fechamento"
          data-track-cta="agendar"
        >
          Agendar Avaliação
        </a>
      </div>
    </section>
  );
}
