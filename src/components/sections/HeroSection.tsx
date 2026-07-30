import { siteConfig } from "@/lib/siteConfig";
import ScheduleButton from "@/components/ScheduleButton";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const HeroSection = () => {
  const { professional, cta, heroChecklist } = siteConfig;

  return (
    <header id="top" className="grad-hero px-6 pb-24 pt-16 md:px-12 md:pb-28 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid items-center gap-11 md:grid-cols-[1.15fr_.85fr]">
          {/* Coluna de texto */}
          <div>
            <FadeIn>
              <p className="eyebrow m-0">Estética Avançada · {professional.city}</p>
            </FadeIn>

            <FadeInUp delay={80}>
              <h1 className="mb-4 mt-4 text-[clamp(2rem,5.2vw,2.875rem)] font-normal leading-[1.08] text-foreground">
                Dr. Victor
                <br />
                <span className="font-medium italic text-primary">Folster</span>
              </h1>
            </FadeInUp>

            <FadeInUp delay={140}>
              <p className="mb-6 max-w-[27.5rem] text-[15px] leading-[1.65] text-foreground-muted">
                Farmacêutico esteta especializado em {professional.focusAreas}, com planejamento individual
                em cada caso.
              </p>
            </FadeInUp>

            {/* Linha de especialização — só texto, não é botão nem link */}
            <FadeInUp delay={180}>
              <p className="mb-7 border-y border-foreground/[0.18] py-3 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
                <strong className="font-bold text-primary">{professional.role}</strong> · Estética
                Regenerativa · Reestruturação Facial
              </p>
            </FadeInUp>

            <FadeInUp delay={220}>
              <div className="mb-7 flex flex-wrap gap-2.5">
                <ScheduleButton />
                <a
                  href="#procedimentos"
                  className="btn-texture inline-flex items-center justify-center rounded-[2px] border border-primary px-6 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-primary no-underline transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {cta.secondaryButton}
                </a>
              </div>
            </FadeInUp>

            <FadeInUp delay={260}>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {heroChecklist.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-foreground-muted">
                    <span aria-hidden="true" className="font-bold text-primary">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeInUp>
          </div>

          {/* Foto + selo do conselho */}
          <FadeIn delay={200}>
            <div className="relative">
              <img
                src="/FOTO_PROFISSIONAL_VICTOR.jpg"
                alt={`${professional.name}, ${professional.role.toLowerCase()}`}
                className="aspect-[3/4] w-full rounded-[2px] border border-primary/30 object-cover object-top"
              />
              <p className="absolute -bottom-3.5 -left-3.5 m-0 rounded-[2px] bg-primary px-4 py-3 text-center text-[11.5px] leading-[1.4] text-white shadow-[0_6px_18px_rgba(0,0,0,.25)]">
                <strong className="block font-serif text-[15px] font-medium">{professional.council}</strong>
                {professional.councilNumber}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
