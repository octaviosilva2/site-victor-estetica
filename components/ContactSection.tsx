import Image from "next/image";

import { siteConfig, whatsappUrl } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";

export default function ContactSection() {
  const { address, phone, links } = siteConfig;

  return (
    <section id="contato" style={{ background: "var(--forest)", paddingBottom: 90 }}>
      <div className="container">
        <Image
          src="/images/logo-victor-folster-branca.png"
          className="contato-logo-mark contato-logo-top fade"
          alt=""
          width={298}
          height={364}
        />

        <p className="eyebrow fade">Fale Comigo</p>
        <h2 className="section-title fade" style={{ color: "var(--white)" }}>
          Contato
        </h2>

        <div className="contact-grid">
          <ul className="contact-list">
            <li className="fade">
              <div className="contact-icon" aria-hidden="true">
                📍
              </div>
              <div>
                <div className="contact-label">Endereço</div>
                <address className="contact-value">
                  {address.place} — {address.street} – {address.district}
                  <br />
                  {address.city} – {address.state}, {address.zip}
                </address>
              </div>
            </li>

            <li className="fade">
              <div className="contact-icon">
                <WhatsAppIcon className="icon-wa" style={{ color: "var(--white)" }} />
              </div>
              <div>
                <div className="contact-label">WhatsApp</div>
                {/* data-track: lido pela medição. Não remover em refatoração. */}
                <div className="contact-value">
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="contato"
                  >
                    {phone.display}
                  </a>
                </div>
              </div>
            </li>

            <li className="fade">
              <div className="contact-icon">
                <InstagramIcon className="icon-wa" style={{ color: "var(--white)" }} />
              </div>
              <div>
                <div className="contact-label">Instagram</div>
                {/* data-track: lido pela medição. Não remover em refatoração. */}
                <div className="contact-value">
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="contato"
                  >
                    {links.instagramHandle}
                  </a>
                </div>
              </div>
            </li>
          </ul>

          {/* data-track: lido pela medição (intenção de visita presencial).
              Não remover em refatoração. */}
          <a
            className="map-link fade"
            href={links.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            data-track="contato"
          >
            📍 Ver endereço no Google Maps
            <br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>(abre direto o app/site de mapas)</span>
          </a>
        </div>

        <Image
          src="/images/logo-victor-folster-branca.png"
          className="contato-logo-mark contato-logo-mid fade"
          alt=""
          width={298}
          height={364}
        />
      </div>
    </section>
  );
}
