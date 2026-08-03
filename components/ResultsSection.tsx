"use client";

import { useRef } from "react";

import { siteConfig } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import CompareCard from "@/components/CompareCard";

// Casos exibidos no carrossel. As fotos reais ainda não foram liberadas —
// ficam no backup do site antigo até o Victor aprovar o uso no site novo.
const compareCases = [
  "Toxina Botulínica — exemplo (foto real a definir)",
  "Bioestimulador de Colágeno — exemplo (foto real a definir)",
  "Preenchimento Labial — exemplo (foto real a definir)",
  "Reestruturação Facial — exemplo (foto real a definir)",
  "Rinomodelação — exemplo (foto real a definir)",
];

export default function ResultsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".compare-card");
    const gap = 16;
    const cardWidth = card ? card.getBoundingClientRect().width + gap : 300;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section id="resultados">
      <div className="container">
        <p className="eyebrow fade">Resultados</p>
        <h2 className="section-title fade">Resultados reais. Elegância sem exageros.</h2>
        <p className="section-sub fade">
          A prioridade não é transformar, é harmonizar. Resultados progressivos, seguros e
          compatíveis com sua estrutura. Arraste a linha em cada foto para comparar antes e
          depois.
        </p>

        <div className="compare-wrap fade">
          <button className="compare-nav prev" onClick={() => scroll(-1)} aria-label="Anterior">
            ←
          </button>
          <div className="compare-track" ref={trackRef}>
            {compareCases.map((label) => (
              <CompareCard label={label} key={label} />
            ))}
          </div>
          <button className="compare-nav next" onClick={() => scroll(1)} aria-label="Próximo">
            →
          </button>
        </div>
        <p className="compare-disclaimer fade">RESULTADO INDIVIDUAL · AVALIAÇÃO NECESSÁRIA</p>

        <a
          className="ig-cta fade"
          href={siteConfig.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon />
          Ver mais casos reais no Instagram <b>{siteConfig.links.instagramHandle}</b>
        </a>

        <a
          className="vip-cta fade"
          href={siteConfig.links.whatsappChannel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          <span className="vip-cta-text">
            <b>Grupo VIP</b>
            <small>Oportunidades antecipadas e pacientes modelo</small>
          </span>
        </a>
      </div>
    </section>
  );
}
