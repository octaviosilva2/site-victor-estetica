import type { Metadata } from "next";

import "@/app/painel.css";

// Layout do PAINEL do cliente.
//
// O que este arquivo NÃO monta é a razão de ele existir: nem `TagManager`, nem
// `ConsentBanner`, nem os dados estruturados do negócio. Esses três moram em
// `app/(site)/layout.tsx` e valem só para o site institucional.
//
// Trazer a medição para cá faria o painel carregar o container de tags do
// próprio cliente: cada vez que o Victor abrisse o relatório, o Analytics dele
// registraria uma visita. Os números do painel passariam a incluir quem os lê.
//
// `(painel)` é um route group — não aparece na URL. As rotas reais continuam
// sendo `/painel`, `/painel/acoes` e `/painel/interesse`, e o `middleware.ts`
// cuida de elas só responderem no subdomínio.

export const metadata: Metadata = {
  // `absolute` evita o sufixo com o nome do consultório que o layout raiz
  // acrescenta a toda página do site.
  title: { absolute: "Painel de resultados — Dr. Victor Folster" },
  description: "Painel de resultados do site. Acesso restrito.",

  // Critério C14 de `05-escopo-contratado.md`: a página do painel não é
  // indexável. A diretiva vale junto com o `robots.txt` próprio do subdomínio,
  // servido pelo `middleware.ts`. São duas proteções diferentes: o robots.txt
  // pede para não rastrear, o `noindex` proíbe publicar o que for rastreado.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },

  // O layout raiz declara `canonical: "/"` e um bloco de Open Graph para o
  // site. Herdados aqui, apontariam o painel para a home do consultório.
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pnl-corpo">{children}</div>;
}
