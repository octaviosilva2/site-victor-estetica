import { siteConfig } from "@/lib/siteConfig";
import ScheduleButton from "@/components/ScheduleButton";
import { FadeIn } from "@/hooks/useScrollAnimation";

/**
 * CTA final. O verde entra em degradê a partir do fundo neutro e continua
 * sem corte na seção de Contato, logo abaixo.
 */
const FinalSection = () => (
  <section className="grad-final-in px-6 pb-16 pt-28 text-center md:px-12 lg:px-20">
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <h2 className="mb-3.5 text-[29px] font-normal leading-tight text-white">
          {siteConfig.cta.finalTitle}
        </h2>
        <p className="mb-7 text-[14.5px] text-white/75">{siteConfig.cta.finalSubtitle}</p>
        <ScheduleButton variant="light">{siteConfig.cta.finalButton}</ScheduleButton>
      </FadeIn>
    </div>
  </section>
);

export default FinalSection;
