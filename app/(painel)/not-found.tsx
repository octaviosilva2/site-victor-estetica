import Link from "next/link";

// 404 do painel. Existe para que o subdomínio nunca precise servir o
// `app/not-found.tsx` da raiz, que monta o layout do site inteiro — com o
// container de tags e o banner de consentimento junto.
//
// O `middleware.ts` reescreve para `/painel/nao-encontrado` tudo o que não for
// do painel no subdomínio, e aquela rota chama `notFound()`, que cai aqui.

export default function PainelNaoEncontrado() {
  return (
    <div className="pnl-entrada">
      <div className="pnl-entrada-caixa">
        <h1>Página não encontrada</h1>
        <p>
          Este endereço não faz parte do painel. Se você chegou por um link
          antigo, volte para a visão geral.
        </p>
        <Link className="pnl-botao" href="/painel">
          Ir para o painel
        </Link>
      </div>
    </div>
  );
}
