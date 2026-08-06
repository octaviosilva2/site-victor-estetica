import { n } from "@/lib/painel/formato";

// Barras horizontais. A largura é proporcional ao MAIOR valor da própria
// lista, e não a um total — as listas do painel não somam um todo fechado.
//
// `tom` segue a mesma convenção de cor do `Cartao`: verde escuro para ação
// importante, verde claro para sinal de contexto. Duas listas de cores
// diferentes na mesma tela são um aviso visual de que não se somam.

export type ItemBarra = { nome: string; valor: number };

export default function Barras({
  itens,
  tom = "acao",
  vazio,
}: {
  itens: ItemBarra[];
  tom?: "acao" | "contexto";
  /** Texto exibido quando não há nenhuma linha no período. */
  vazio: string;
}) {
  if (itens.length === 0) {
    return <p className="pnl-vazio">{vazio}</p>;
  }

  const maior = Math.max(...itens.map((i) => i.valor), 1);

  return (
    <ul className="pnl-barras">
      {itens.map((item) => (
        <li key={item.nome}>
          <div className="pnl-barra-topo">
            <span className="pnl-barra-nome">{item.nome}</span>
            <span className="pnl-barra-valor">{n(item.valor)}</span>
          </div>
          <div className="pnl-barra-trilho">
            <div
              className={`pnl-barra-preenchimento${tom === "contexto" ? " contexto" : ""}`}
              style={{ width: `${Math.max((item.valor / maior) * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
