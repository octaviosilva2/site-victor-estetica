import { Instagram } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const results = [
  { src: "/ANTESEDEPOIS_1.jpg", alt: "Antes e depois de um caso real atendido no consultório" },
  { src: "/ANTESEDEPOIS_2.jpg", alt: "Antes e depois de um caso real atendido no consultório" },
  { src: "/ANTESEDEPOIS_3.jpg", alt: "Antes e depois de um caso real atendido no consultório" },
];

const ResultsSection = () => (
  <section id="resultados" className="section-padding bg-background">
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <p className="eyebrow m-0">Resultados</p>
        <h2 className="mb-4 mt-3 text-[27px] font-normal">Resultados reais. Elegância sem exageros.</h2>
        <p className="mb-9 max-w-[32.5rem] text-[15px] leading-[1.6] text-foreground-muted">
          A prioridade não é transformar, é harmonizar. Resultados progressivos, seguros e compatíveis com
          sua estrutura.
        </p>
      </FadeIn>

      <FadeInUp delay={120}>
        <div className="grid gap-3.5 sm:grid-cols-3">
          {results.map((result) => (
            <img
              key={result.src}
              src={result.src}
              alt={result.alt}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-[2px] border border-primary/30 object-cover"
            />
          ))}
        </div>

        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2.5 rounded-[2px] border border-primary px-5 py-3.5 text-center text-[13px] text-primary no-underline transition-colors hover:bg-primary/10"
        >
          <Instagram aria-hidden="true" strokeWidth={1.6} className="h-[18px] w-[18px] flex-shrink-0" />
          <span>
            Ver mais casos reais no Instagram <b className="font-bold">{siteConfig.social.instagramHandle}</b>
          </span>
        </a>
      </FadeInUp>
    </div>
  </section>
);

export default ResultsSection;
