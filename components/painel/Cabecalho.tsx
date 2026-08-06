import Link from "next/link";

import { signOut } from "@/auth";
import { PERIODOS, type Periodo } from "@/lib/painel/periodo";

// Cabeçalho das 3 páginas de dados. A tela de entrada não o monta — quem não
// entrou não tem período para escolher nem sessão para encerrar.
//
// As 3 páginas são as de `08-matriz-do-dashboard.md` e não mudam: uma página a
// mais é aditivo de escopo, não ajuste de navegação.

const PAGINAS = [
  { href: "/painel", rotulo: "Visão geral" },
  { href: "/painel/acoes", rotulo: "Ações comerciais" },
  { href: "/painel/interesse", rotulo: "Interesse e público" },
] as const;

export default function Cabecalho({
  atual,
  periodo,
}: {
  /** Caminho da página aberta, para marcar a aba e montar os links de período. */
  atual: string;
  periodo: Periodo;
}) {
  return (
    <>
      <header className="pnl-topo">
        <div className="pnl-largura">
          <div className="pnl-topo-linha">
            <div className="pnl-marca">
              Dr. Victor Folster
              <span>Painel de resultados do site</span>
            </div>
            {/* Encerrar a sessão é uma ação, não um link: precisa apagar o
                cookie no servidor. Formulário para funcionar sem JavaScript. */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/painel/entrar" });
              }}
            >
              <button type="submit" className="pnl-sair">
                Sair
              </button>
            </form>
          </div>
          <nav className="pnl-abas" aria-label="Páginas do painel">
            {PAGINAS.map((pagina) => (
              <Link
                key={pagina.href}
                href={`${pagina.href}?periodo=${periodo.dias}`}
                className="pnl-aba"
                aria-current={pagina.href === atual ? "page" : undefined}
              >
                {pagina.rotulo}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="pnl-largura">
        <div className="pnl-periodo">
          <span className="pnl-periodo-rotulo">Período</span>
          <div className="pnl-periodo-opcoes">
            {PERIODOS.map((opcao) => (
              <Link
                key={opcao.dias}
                href={`${atual}?periodo=${opcao.dias}`}
                className="pnl-periodo-opcao"
                aria-current={opcao.dias === periodo.dias ? "true" : undefined}
              >
                {opcao.rotulo}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
