import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const AboutSection = () => {
  const handleWhatsApp = () => {
    window.open(siteConfig.links.whatsappUrl, "_blank");
  };
  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Foto Profissional */}
          <FadeIn>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl">
              <img
                src="/FOTO_PROFISSIONAL_VICTOR.jpg"
                alt="Dr. Victor Folster"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>
          {/* Right Column - Content */}
          <FadeInUp delay={200} className="flex flex-col justify-center">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
              {siteConfig.about.title}
            </h2>
            <p className="text-primary text-sm tracking-wider mb-6">
              {siteConfig.professional.credentials}
            </p>
            <p className="text-foreground-muted text-lg leading-relaxed mb-8">
              Especialista em <strong>Farmácia Estética e Clínica</strong>, com sólida experiência na integração entre conhecimento científico e prática estética avançada, dedicado a potencializar a beleza natural de cada paciente por meio de protocolos personalizados, seguros e com resultados harmoniosos e realistas.
            </p>
            {/* Highlights */}
            <ul className="space-y-4 mb-10">
              {siteConfig.about.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 font-medium tracking-wide transition-all duration-300 hover:scale-105 w-fit"
            >
              {siteConfig.cta.heroButton}
            </Button>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
