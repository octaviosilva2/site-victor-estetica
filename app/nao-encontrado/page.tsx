import { notFound } from "next/navigation";

// Rota-alvo do `middleware.ts` para esconder o painel do domínio do site.
//
// Ela não desenha nada: chama `notFound()`, o que faz o Next responder com
// **status 404 de verdade** e renderizar `app/not-found.tsx` — a página 404 do
// site, com menu, rodapé e banner de consentimento.
//
// Por que não basta reescrever para um caminho que não existe: em
// desenvolvimento aquilo devolve 404, mas em produção a hospedagem resolve o
// caminho reescrito como página pré-renderizada e responde **200**. Medido em
// 2026-08-06 em `www.victorfolster.com.br/painel`: corpo certo, cabeçalho
// `X-Matched-Path: /404`, e status 200. É um "soft 404" — o buscador lê como
// página válida, e o `robots.txt` do site permite rastrear tudo.
//
// Fica na raiz de `app/`, fora do route group `(site)`, pelo mesmo motivo que
// `app/not-found.tsx` fica: dentro do grupo ela não seria alcançável a partir
// de uma reescrita vinda de qualquer caminho.
export default function NaoEncontrado(): never {
  notFound();
}
