import { ReactNode } from "react";
import { Instagram, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

interface ContactItem {
  label: string;
  icon: ReactNode;
  value: ReactNode;
}

/**
 * Contato. Continua o verde escuro do CTA final (sem corte entre as duas) e
 * sai em degradê para o fundo claro do rodapé.
 *
 * Não há telefone fixo aqui de propósito: o contato é por WhatsApp.
 */
const ContactSection = () => {
  const { contact, social, links } = siteConfig;

  const linkClass = "block text-[13.5px] text-white underline";

  const items: ContactItem[] = [
    {
      label: "Endereço",
      icon: <MapPin aria-hidden="true" className="h-4 w-4" />,
      value: (
        <span className="block text-[13.5px] text-white">
          {contact.address}
          <br />
          {contact.city}, {contact.cep}
        </span>
      ),
    },
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-4 w-4" />,
      value: (
        <a href={links.whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {contact.whatsappDisplay}
        </a>
      ),
    },
    // A linha de e-mail aparece sozinha quando o campo for preenchido em siteConfig.
    ...(contact.email
      ? [
          {
            label: "E-mail",
            icon: <Mail aria-hidden="true" className="h-4 w-4" />,
            value: (
              <a href={`mailto:${contact.email}`} className={linkClass}>
                {contact.email}
              </a>
            ),
          },
        ]
      : []),
    {
      label: "Instagram",
      icon: <Instagram aria-hidden="true" className="h-4 w-4" />,
      value: (
        <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {social.instagramHandle}
        </a>
      ),
    },
  ];

  return (
    <section id="contato" className="grad-contact-out px-6 pb-28 pt-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="eyebrow m-0 text-white/60">Fale Comigo</p>
          <h2 className="mb-8 mt-3 text-[27px] font-normal text-white">Contato</h2>
        </FadeIn>

        <div className="grid items-start gap-7 md:grid-cols-2">
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {items.map((item, index) => (
              <li key={item.label}>
                <FadeInUp delay={index * 80} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white">
                    {item.icon}
                  </span>
                  <span>
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">
                      {item.label}
                    </span>
                    {item.value}
                  </span>
                </FadeInUp>
              </li>
            ))}
          </ul>

          {/* Mapa: incorporado + link que abre o app/site de mapas */}
          <FadeInUp delay={120}>
            <div className="space-y-2.5">
              <div className="h-[15rem] overflow-hidden rounded-[2px] border border-white/20">
                <iframe
                  src={contact.mapEmbedUrl}
                  title={`Localização de ${contact.clinicName}`}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={links.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[2px] border border-white/20 bg-white/[0.04] px-4 py-3 text-center text-[13px] text-white no-underline transition-colors hover:bg-white/[0.09]"
              >
                <MapPin aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                Ver endereço no Google Maps
              </a>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
