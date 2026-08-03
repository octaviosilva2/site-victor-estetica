"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteConfig, whatsappUrl } from "@/lib/siteConfig";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";

// Os links levam para "/#secao" em vez de só "#secao": assim funcionam
// igual a partir da home e das páginas internas de procedimento e área.
const navLinks = [
  { href: "/#topo", label: "Início" },
  { href: "/#metodo", label: "Método" },
  { href: "/#procedimentos", label: "Áreas de Atuação" },
  { href: "/#resultados", label: "Resultados" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#avaliacoes", label: "Avaliações" },
  { href: "/#contato", label: "Contato" },
];

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-name" aria-label={`${siteConfig.name} — página inicial`}>
            <Image
              src="/images/logo-victor-folster.png"
              className="nav-logo-mark"
              alt=""
              width={298}
              height={364}
              priority
            />
            {siteConfig.shortName}
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <button
            className="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
          >
            ☰
          </button>

          <a
            className="btn btn-small"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar Avaliação
          </a>
        </div>
      </nav>

      {/* Gaveta lateral do mobile */}
      <div
        className={`nav-drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <button
          className="nav-drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
        >
          ✕
        </button>
        <ul className="nav-drawer-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setDrawerOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-drawer-contact">
          <div className="nav-drawer-phone">{siteConfig.phone.display}</div>
          <div className="nav-drawer-icons">
            <a
              className="nav-drawer-icon-btn"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar no WhatsApp"
            >
              <WhatsAppIcon />
            </a>
            <a
              className="nav-drawer-icon-btn"
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil no Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
