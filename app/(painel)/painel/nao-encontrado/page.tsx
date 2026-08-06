import { notFound } from "next/navigation";

// Rota-alvo do `middleware.ts` para tudo o que não é painel no subdomínio.
//
// Ela não desenha nada: chama `notFound()`, o que faz o Next responder com
// status 404 de verdade e renderizar `app/(painel)/not-found.tsx`. Sem esta
// rota, a única forma de devolver 404 no subdomínio seria cair na página do
// site — que carrega a medição.

export default function NaoEncontrado(): never {
  notFound();
}
