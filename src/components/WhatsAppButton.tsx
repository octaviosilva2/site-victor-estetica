import { siteConfig } from "@/lib/siteConfig";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

/**
 * Botão flutuante de WhatsApp, com o ícone real do app (não o símbolo
 * genérico de telefone ou de balão de conversa).
 */
const WhatsAppButton = () => (
  <a
    href={siteConfig.links.whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar no WhatsApp"
    title="WhatsApp"
    className="group fixed bottom-6 right-6 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_14px_rgba(0,0,0,.18)] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <WhatsAppIcon className="h-6 w-6" />
  </a>
);

export default WhatsAppButton;
