import type { Metadata } from "next";
import localFont from "next/font/local";

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
// sendo `/painel`, `/painel/acoes`, `/painel/interesse` e `/painel/ads`, e o
// `middleware.ts` cuida de elas só responderem no subdomínio.

// As fontes da demonstração, servidas do próprio domínio.
//
// **Só aqui, nunca no layout raiz.** O site institucional tem tipografia
// própria (Fraunces e Manrope) e não deve baixar mais duas famílias por causa
// do painel. Declaradas neste layout, os arquivos entram apenas nas rotas de
// `(painel)`.
const geist = localFont({
  src: [
    { path: "../../public/fonts/Geist-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Geist-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Geist-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Geist-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-geist",
});

// A monoespaçada existe por um motivo funcional: algarismo de largura fixa.
// Numa coluna de números, a fonte proporcional faz o "1" ocupar menos espaço
// que o "8", e as casas deixam de se alinhar entre linhas.
const geistMono = localFont({
  src: [
    { path: "../../public/fonts/GeistMono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/GeistMono-500.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-geist-mono",
});

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

/**
 * Aplica o tema salvo antes da primeira pintura.
 *
 * Sem isto, o painel abre claro e escurece um quadro depois — o clarão branco
 * que todo painel de tema escuro dá quando a preferência só é lida depois da
 * hidratação. Roda antes do React de propósito.
 *
 * O `try` não é decoração: em navegação privada de alguns navegadores, ler
 * `localStorage` **lança**. Sem o `catch`, o erro derrubaria a página inteira
 * por causa de uma preferência de cor.
 */
const TEMA_INICIAL = `
try {
  var t = localStorage.getItem("painel-tema");
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`pnl-raiz ${geist.variable} ${geistMono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: TEMA_INICIAL }} />
      {children}
    </div>
  );
}
