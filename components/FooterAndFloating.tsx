import { siteConfig, whatsappUrl } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";

export default function FooterAndFloating() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer>
        <div className="container">
          <div className="brand-line">
            Estética com base clínica, planejamento e responsabilidade profissional.
          </div>
          <p className="footer-legal">
            © {year} {siteConfig.name} · {siteConfig.credentials}
          </p>
        </div>
      </footer>

      {/* Botões flutuantes de contato rápido */}
      <a
        className="wa-float"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <a
        className="wa-float ig-float"
        href={siteConfig.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil no Instagram"
      >
        <InstagramIcon style={{ stroke: "var(--white)", width: 24, height: 24 }} />
      </a>
    </>
  );
}
