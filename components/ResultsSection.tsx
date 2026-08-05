"use client";

import { useRef } from "react";

import { siteConfig } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import CompareCard from "@/components/CompareCard";

// Casos exibidos no carrossel. Fotos reais de pacientes, com uso autorizado
// por cada um — confirmado pelo Victor em 2026-08-05.
//
// TODO — o rótulo de cada caso ainda é genérico porque o procedimento de cada
// um não foi confirmado. Nomear o procedimento errado num antes e depois de
// paciente é erro grave num site de profissional de saúde, então o texto fica
// neutro até a confirmação chegar. Trocar apenas o campo `label`.
const compareCases = [
  { id: "caso-1", label: "Antes e depois" },
  { id: "caso-2", label: "Antes e depois" },
  { id: "caso-3", label: "Antes e depois" },
  { id: "caso-4", label: "Antes e depois" },
  { id: "caso-5", label: "Antes e depois" },
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
            {compareCases.map((item, index) => (
              <CompareCard
                key={item.id}
                label={item.label}
                before={`/images/resultados/${item.id}-antes.jpg`}
                after={`/images/resultados/${item.id}-depois.jpg`}
                alt={`Resultado de paciente, caso ${index + 1}`}
              />
            ))}
          </div>
          <button className="compare-nav next" onClick={() => scroll(1)} aria-label="Próximo">
            →
          </button>
        </div>
        <p className="compare-disclaimer fade">RESULTADO INDIVIDUAL · AVALIAÇÃO NECESSÁRIA</p>

        {/* data-track: lido pela medição. Não remover em refatoração. */}
        <a
          className="ig-cta fade"
          href={siteConfig.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          data-track="resultados"
        >
          <InstagramIcon />
          Ver mais casos reais no Instagram <b>{siteConfig.links.instagramHandle}</b>
        </a>

        {/* data-track: lido pela medição. Não remover em refatoração.
            Este link é canal de transmissão (whatsapp.com/channel), não wa.me:
            é medido como evento próprio e fica fora da taxa de ações
            importantes. Trocar o destino para wa.me quebraria essa separação. */}
        <a
          className="vip-cta fade"
          href={siteConfig.links.whatsappChannel}
          target="_blank"
          rel="noopener noreferrer"
          data-track="resultados"
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
