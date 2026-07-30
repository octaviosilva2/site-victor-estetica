import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Droplet,
  MessageCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const icons: Record<string, LucideIcon> = {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Droplet,
  MessageCircle,
  ShieldCheck,
};

const MethodSection = () => {
  const { method, differentials } = siteConfig;

  return (
    <section id="metodo" className="grad-forest-panel px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="eyebrow m-0">Método</p>
          <h2 className="mb-4 mt-3 text-[27px] font-normal">
            Método baseado em ciência, não em tendências
          </h2>
          <p className="max-w-[32.5rem] text-[15px] leading-[1.6] text-foreground-muted">
            Cada indicação nasce de uma avaliação real — não de uma lista de procedimentos da moda. O
            caminho é sempre o mesmo, na ordem certa:
          </p>
        </FadeIn>

        {/* Fluxo: Avaliação → Planejamento → Procedimento */}
        <FadeInUp delay={120}>
          <ol className="mb-2 mt-9 flex list-none flex-wrap items-start justify-between gap-2 p-0">
            {method.steps.map((step, index) => (
              <li key={step} className="flex flex-1 items-start gap-2">
                <div className="flex-1 text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-primary font-serif text-[14px] text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[12.5px] text-foreground-muted">{step}</span>
                </div>
                {index < method.steps.length - 1 && (
                  <span aria-hidden="true" className="mt-[17px] hidden h-px w-10 bg-border sm:block" />
                )}
              </li>
            ))}
          </ol>

          <p className="mt-8 font-serif text-[21px] font-normal italic text-primary">"{method.quote}"</p>
        </FadeInUp>

        {/* Diferenciais */}
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
          {differentials.map((item, index) => {
            const Icon = icons[item.icon] ?? ClipboardCheck;
            return (
              <FadeInUp key={item.title} delay={140 + index * 60}>
                <div className="group h-full rounded-[2px] border border-primary bg-primary px-5 py-6 transition-colors [transition-duration:250ms] hover:border-white/50">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.4}
                    className="mb-4 h-8 w-8 text-white/55 transition-colors [transition-duration:250ms] group-hover:text-white"
                  />
                  <h3 className="mb-1.5 font-serif text-[15.5px] font-normal text-white">{item.title}</h3>
                  <p className="text-[12.5px] leading-[1.6] text-white/[0.62]">{item.description}</p>
                </div>
              </FadeInUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MethodSection;
