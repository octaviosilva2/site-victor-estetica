import Link from "next/link";

import { signOut } from "@/auth";
import { INSTANCIA } from "@/lib/painel/instancia";
import { plural } from "@/lib/painel/formato";
import {
  INICIO_DA_MEDICAO,
  PERIODOS,
  dataCurta,
  mesesDisponiveis,
  type Periodo,
} from "@/lib/painel/periodo";

// Cabeçalho das páginas de dados. A tela de entrada não o monta — quem não
// entrou não tem período para escolher nem sessão para encerrar.
//
// A marca que aparece aqui é a da **Escale IA**, não a do cliente: o painel é
// produto da agência entregue como instância (decisão D7). O nome do cliente
// vem logo abaixo, e sai de `lib/painel/instancia.ts` — nenhum nome próprio
// está escrito neste arquivo.

const PAGINAS = [
  { href: "/painel", rotulo: "Visão geral" },
  { href: "/painel/acoes", rotulo: "Ações comerciais" },
  { href: "/painel/interesse", rotulo: "Interesse e público" },
  { href: "/painel/ads", rotulo: "Google Ads" },
] as const;

export default function Cabecalho({
  atual,
  periodo,
}: {
  /** Caminho da página aberta, para marcar a aba e montar os links de período. */
  atual: string;
  periodo: Periodo;
}) {
  const meses = mesesDisponiveis();
  const mesEscolhido = meses.find((m) => m.chave === periodo.chave);

  return (
    <>
      <header className="pnl-topo">
        <div className="pnl-largura">
          <div className="pnl-topo-linha">
            <div className="pnl-marca">
              <span className="pnl-marca-simbolo" aria-hidden="true" />
              <div className="pnl-marca-texto">
                <p className="pnl-marca-nome">Escale IA</p>
                <p className="pnl-marca-cliente">
                  {INSTANCIA.cliente} · {INSTANCIA.subtitulo}
                </p>
              </div>
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
                href={`${pagina.href}?periodo=${periodo.chave}`}
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
          <div className="pnl-periodo-opcoes">
            {PERIODOS.map((opcao) => (
              <Link
                key={opcao.chave}
                href={`${atual}?periodo=${opcao.chave}`}
                className="pnl-periodo-opcao"
                aria-current={opcao.chave === periodo.chave ? "true" : undefined}
              >
                {opcao.rotulo}
              </Link>
            ))}

            {/* Escolher um mês. `<details>` nativo: sem JavaScript, o painel
                inteiro continua funcionando, inclusive este menu. */}
            <details className="pnl-meses">
              <summary>
                {mesEscolhido ? mesEscolhido.rotulo : "Escolher um mês"}
              </summary>
              <div className="pnl-meses-lista">
                {meses.map((mes) => (
                  <Link
                    key={mes.chave}
                    href={`${atual}?periodo=${mes.chave}`}
                    aria-current={mes.chave === periodo.chave ? "true" : undefined}
                  >
                    {mes.rotulo}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>

        <AlcanceDoPeriodo periodo={periodo} />
      </div>
    </>
  );
}

/**
 * A linha que diz o que o período escolhido cobre de verdade.
 *
 * Regra 8 de `08-matriz-do-dashboard.md`, vinda do achado E0.11: a medição
 * começou em uma data, e um período que começa antes dela **não** tem menos
 * movimento — tem menos medição. Sem esta linha, "este ano" e "esta semana"
 * mostram o mesmo número e o cliente conclui que o painel travou.
 */
function AlcanceDoPeriodo({ periodo }: { periodo: Periodo }) {
  const parcial = periodo.diasMedidos < periodo.dias;

  return (
    <p className="pnl-periodo-alcance">
      <b>{periodo.rotulo}</b> — {periodo.descricao}.{" "}
      {periodo.diasMedidos === 0 ? (
        <>
          Este período é <b>inteiro anterior ao início da medição</b>, em{" "}
          {dataCurta(INICIO_DA_MEDICAO)}. Não há o que mostrar aqui — e isso não
          quer dizer que ninguém visitou o site.
        </>
      ) : parcial ? (
        <>
          A medição começou em <b>{dataCurta(INICIO_DA_MEDICAO)}</b>, então
          destes {periodo.dias} dias há dado de{" "}
          <b>
            {periodo.diasMedidos} {plural(periodo.diasMedidos, "dia", "dias")}
          </b>
          . Períodos maiores ainda mostram os mesmos números — não é o painel
          travado, é o histórico que ainda está sendo formado.
        </>
      ) : (
        <>
          {periodo.dias} {plural(periodo.dias, "dia", "dias")} de medição
          {periodo.incluiHoje ? ", incluindo hoje, que ainda é preliminar" : ""}.
        </>
      )}
    </p>
  );
}
