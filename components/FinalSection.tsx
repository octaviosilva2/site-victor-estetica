import { whatsappUrl } from "@/lib/siteConfig";

export default function FinalSection() {
  return (
    <section className="final">
      <div className="container">
        <h2 className="fade">Sua melhor versão começa com um planejamento estratégico.</h2>
        <p className="fade">
          Agende sua avaliação personalizada e descubra o protocolo ideal para você.
        </p>
        <a className="btn fade" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          Agendar Avaliação
        </a>
      </div>
    </section>
  );
}
