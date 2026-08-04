import Image from "next/image";
import Link from "next/link";

import { siteConfig, whatsappUrl } from "@/lib/siteConfig";

const specialties = [
  "Farmacêutico Esteta",
  "Arquitetura Facial",
  "Estética Regenerativa",
  "Envelhecimento Saudável",
];

const checklist = [
  "Avaliação individual, sem protocolo padrão",
  "Resultados naturais, sem promessa de milagre",
  "Produtos e protocolos regulamentados",
];

export default function HeroSection() {
  return (
    <header className="hero" id="topo">
      <div className="hero-photo-bleed">
        <Image
          src="/images/dr-victor-folster-hero.png"
          alt={`${siteConfig.name}, ${siteConfig.role.toLowerCase()} em ${siteConfig.address.city}`}
          width={1600}
          height={1600}
          priority
          sizes="(max-width: 780px) 280px, 44vw"
        />
      </div>
      <div className="container">
        <div className="hero-text">
          <p className="eyebrow fade">{siteConfig.tagline}</p>
          <h1 className="fade">
            Dr. Victor <span className="accent">Folster</span>
          </h1>
          <div className="hero-credential-chip fade">{siteConfig.credentials}</div>
          <p className="sub fade">
            Farmacêutico esteta especializado em Arquitetura Facial, Estética Regenerativa e
            Envelhecimento Saudável, com planejamento individual em cada caso.
          </p>
          <div className="specialty-grid fade">
            {specialties.map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
          <div className="hero-buttons fade">
            {/* data-track* são lidos pela medição para saber qual botão de
                agendamento converteu. Não remover em refatoração. */}
            <a
              className="btn"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-track="topo"
              data-track-cta="agendar"
            >
              Agendar Avaliação
            </a>
            <Link className="btn btn-outline" href="/#procedimentos">
              Conhecer Procedimentos
            </Link>
          </div>
          <ul className="checklist fade">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
