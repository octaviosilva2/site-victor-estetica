import Link from "next/link";

import { siteConfig, whatsappUrl } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import ConsentPreferencesLink from "@/components/ConsentPreferencesLink";

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
          {/* Acesso permanente à política e à revisão do consentimento.
              Sem esta linha, quem fechou o aviso não tem como voltar atrás —
              e consentimento que não pode ser revogado não é consentimento. */}
          <div className="footer-links">
            <Link href="/privacidade">Política de Privacidade</Link>
            <span className="footer-links-sep" aria-hidden="true">
              ·
            </span>
            <ConsentPreferencesLink />
          </div>
        </div>
      </footer>

      {/* Botões flutuantes de contato rápido.
          data-track é lido pela medição — não remover em refatoração. Ambos
          contêm só um ícone SVG: o clique acontece no SVG, não no <a>, e a
          leitura do atributo precisa subir até o link. */}
      <a
        className="wa-float"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        data-track="flutuante"
      >
        <WhatsAppIcon />
      </a>
      <a
        className="wa-float ig-float"
        href={siteConfig.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil no Instagram"
        data-track="flutuante"
      >
        <InstagramIcon style={{ stroke: "var(--white)", width: 24, height: 24 }} />
      </a>
    </>
  );
}
