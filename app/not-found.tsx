import Link from "next/link";

import { whatsappUrl } from "@/lib/siteConfig";
import Nav from "@/components/Nav";
import FooterAndFloating from "@/components/FooterAndFloating";

export const metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="final" style={{ minHeight: "60vh" }}>
        <div className="container">
          <h1 style={{ fontSize: 29, marginBottom: 14, fontWeight: 400 }}>
            Essa página não existe
          </h1>
          <p>O link pode ter mudado de endereço. Volte para o início ou fale comigo direto.</p>
          <div
            style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link className="btn" href="/">
              Voltar ao início
            </Link>
            <a
              className="btn btn-outline"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <FooterAndFloating />
    </>
  );
}
