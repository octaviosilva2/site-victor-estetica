import { siteConfig } from "@/lib/siteConfig";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";
import clinicWork from "@/assets/clinic-reception-new.png";

const AboutSection = () => {
  const { about, professional } = siteConfig;

  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="eyebrow m-0">Sobre</p>
          <h2 className="mb-8 mt-3 text-[27px] font-normal">{about.title}</h2>
        </FadeIn>

        <div className="grid items-start gap-7 sm:grid-cols-[13.75rem_1fr]">
          <FadeIn delay={120}>
            <img
              src={clinicWork}
              alt={`${professional.name}, ${professional.role.toLowerCase()}, durante um atendimento de estética avançada`}
              width={1280}
              height={859}
              loading="lazy"
              decoding="async"
              className="mx-auto h-[13.75rem] w-[13.75rem] rounded-[2px] border border-primary/30 object-cover sm:h-[13.75rem] sm:w-full"
            />
          </FadeIn>

          <FadeInUp delay={180}>
            <p className="mb-6 text-[15.5px] leading-[1.8] text-foreground-muted">{about.description}</p>

            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {about.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="relative border-t border-border pl-5 pt-2.5 text-[13.5px] text-foreground-muted"
                >
                  <span aria-hidden="true" className="absolute left-0 top-2.5 font-bold text-primary">
                    —
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
