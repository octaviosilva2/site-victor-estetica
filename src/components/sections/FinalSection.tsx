import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin } from "lucide-react";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const FinalSection = () => {
  const handleWhatsApp = () => {
    window.open(siteConfig.links.whatsappUrl, "_blank");
  };

  return (
    <section id="clinica">
      {/* BLOCO 1 — CTA puro */}
      <div className="section-padding bg-background">
        <div className="container-narrow">
          <FadeIn className="text-center pt-4">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 leading-tight">
              {siteConfig.cta.finalTitle}
            </h2>
            <div className="w-14 h-px bg-primary/60 mx-auto mb-6" />
            <p className="text-foreground-muted text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              {siteConfig.cta.finalSubtitle}
            </p>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-base font-medium tracking-wide transition-all duration-300 hover:scale-105 gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              {siteConfig.cta.finalButton}
            </Button>
          </FadeIn>
        </div>
      </div>

      {/* BLOCO 2 — Institucional */}
      <div className="section-padding bg-background-subtle/60 pb-24 sm:pb-16">
        <div className="container-narrow">
          <FadeInUp className="text-center max-w-[720px] mx-auto mb-10 lg:mb-12">
            <p className="font-playfair text-lg text-foreground font-medium">
              {siteConfig.contact.clinicName}
            </p>
            <div className="flex items-start justify-center gap-2 text-foreground-muted text-sm leading-relaxed mt-1.5">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p>{siteConfig.contact.address}</p>
                <p>{siteConfig.contact.city}, {siteConfig.contact.cep}</p>
              </div>
            </div>
            <p className="text-foreground-muted/60 text-xs pt-2">
              Atendimento em Florianópolis mediante agendamento.
            </p>
          </FadeInUp>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Coluna esquerda — Foto da clínica */}
            <FadeInUp delay={100}>
              <div className="lg:hidden mb-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-foreground-muted hover:text-primary gap-1.5 px-1"
                >
                  <a href={siteConfig.links.mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-3.5 h-3.5" />
                    Ver no mapa
                  </a>
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl h-[180px] sm:h-[240px] lg:h-[380px]">
                <img
                  src="/FOTO_CLINICA.jpg"
                  alt="Clínica Dr. Victor Folster"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeInUp>

            {/* Coluna direita — Mapa */}
            <FadeInUp delay={200}>
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden h-[230px] sm:h-[240px] lg:h-[380px]">
                  <iframe
                    src={siteConfig.contact.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    className="h-full w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização da Clínica"
                  />
                </div>
                <div className="hidden lg:block">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs text-foreground-muted hover:text-primary gap-1.5 px-2"
                  >
                    <a href={siteConfig.links.mapUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-3.5 h-3.5" />
                      Ver no mapa
                    </a>
                  </Button>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
