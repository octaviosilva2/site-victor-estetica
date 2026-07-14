import { siteConfig } from "@/lib/siteConfig";
import { MapPin, Phone, Instagram } from "lucide-react";
import { FadeIn } from "@/hooks/useScrollAnimation";

const FooterSection = () => {
  return (
    <footer className="bg-background-dark py-12 px-6">
      <div className="container-narrow">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Left - Contact Info */}
            <div className="space-y-4">
              <h3 className="font-luxerie text-3xl font-normal tracking-widest text-foreground-light mb-2">
                {siteConfig.professional.name}
              </h3>
              <p className="text-primary text-sm tracking-wider">
                {siteConfig.professional.specialty}
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3 text-foreground-light/70 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{siteConfig.contact.address}</p>
                    <p>{siteConfig.contact.city}, {siteConfig.contact.cep}</p>
                  </div>
                </div>

                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 text-foreground-light/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  {siteConfig.contact.phone}
                </a>

                {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground-light/70 hover:text-primary transition-colors text-sm"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    @dr.victorfolster
                  </a>
                )}
              </div>
            </div>

            {/* Right - Map Icon / Location */}
            <div className="flex items-center justify-center md:justify-end">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  siteConfig.contact.address + ", " + siteConfig.contact.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-foreground-light/70 hover:text-primary transition-colors group"
              >
                <div className="w-16 h-16 rounded-full border border-foreground-light/20 flex items-center justify-center group-hover:border-primary transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-sm">Ver no mapa</span>
              </a>
            </div>
          </div>

          {/* Institutional Message */}
          <div className="border-t border-foreground-light/10 pt-8 text-center space-y-3">
            <p className="text-foreground-light/60 text-sm">
              Estética com base clínica, planejamento e responsabilidade profissional.
            </p>
            <p className="text-foreground-light/40 text-xs">
              © {new Date().getFullYear()} {siteConfig.professional.name}. Todos os direitos reservados.
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default FooterSection;
