import Image from "next/image";

import { siteConfig } from "@/lib/siteConfig";

export default function AboutSection() {
  return (
    <section id="sobre">
      <div className="about-photo-bleed">
        <Image
          src="/images/dr-victor-folster-sobre.png"
          alt={`${siteConfig.name}, ${siteConfig.role.toLowerCase()} formado pela UFSC`}
          width={1600}
          height={1600}
          sizes="(max-width: 780px) 280px, 40vw"
        />
      </div>
      <div className="container">
        <div className="about-text-col">
          <p className="eyebrow fade">Sobre</p>
          <h2 className="section-title fade">Sobre o Dr. Victor Folster</h2>
          <p className="about-text fade">
            Farmacêutico (CRF/SC 18.551 | RQE 19028-49), formado pela UFSC, com residência em
            Urgência e Emergência, formação em Farmacologia Estética e pós-graduação em Estética
            Avançada e Harmonização Facial e Corporal. Atua em estética há quase três anos,
            sempre a partir de planejamento individual — não de protocolo padrão. Aqui não há
            promessa de resultado milagroso: o critério é ciência, segurança e naturalidade.
          </p>
        </div>
      </div>
    </section>
  );
}
