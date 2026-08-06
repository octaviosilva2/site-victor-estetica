import Link from "next/link";

import { whatsappUrl } from "@/lib/siteConfig";
import Nav from "@/components/Nav";
import FooterAndFloating from "@/components/FooterAndFloating";
import SiteLayout from "@/app/(site)/layout";

export const metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

// Este arquivo precisa ficar na RAIZ de `app/`, e não dentro de `(site)`.
// Dentro do route group ele só atende as rotas do próprio grupo, e qualquer
// endereço desconhecido cai no 404 padrão do Next — página em inglês, sem o
// menu, sem o rodapé e sem o banner de consentimento. Foi o que aconteceu ao
// mover o arquivo em 2026-08-05, e só apareceu abrindo uma URL inexistente.
//
// Como ele mora fora do grupo, o layout de `(site)` não o envolve: por isso a
// medição e o banner são montados aqui explicitamente, reaproveitando o mesmo
// componente de layout em vez de repetir a ordem de carregamento à mão.
export default function NotFound() {
  return (
    <SiteLayout>
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
    </SiteLayout>
  );
}
