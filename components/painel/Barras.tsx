import { n, pctCurto } from "@/lib/painel/formato";

// Barras horizontais. A largura é proporcional ao MAIOR valor da própria
// lista, e não a um total — as listas do painel não somam um todo fechado.
//
// `tom` segue a mesma convenção de cor do `Cartao`: índigo para ação
// importante, ciano para sinal de contexto. Duas listas de cores diferentes na
// mesma tela são um aviso visual de que não se somam.
//
// **`total` implementa a regra 7 de `08-matriz-do-dashboard.md`.** Quando o
// total do evento é conhecido e a soma das linhas não bate com ele, a
// diferença aparece escrita, na própria tela. Foi exatamente esse silêncio que
// derrubou a confiança no painel em 06/08: um cartão dizia 11, as barras
// somavam 8, e nada explicava os 3 que faltavam. A plataforma pode omitir
// linhas por limiar de privacidade, e um painel que não avisa deixa o leitor
// concluir que a conta está errada.

export type ItemBarra = { nome: string; valor: number };

export default function Barras({
  itens,
  tom = "acao",
  vazio,
  total,
  mostrarParte = true,
}: {
  itens: ItemBarra[];
  tom?: "acao" | "contexto";
  /** Texto exibido quando não há nenhuma linha no período. */
  vazio: string;
  /**
   * Total conhecido do evento, quando existe consulta separada para ele.
   * Serve só para conferir a soma — a barra continua proporcional ao maior.
   */
  total?: number;
  /** Mostrar a fatia percentual de cada linha ao lado do número. */
  mostrarParte?: boolean;
}) {
  if (itens.length === 0) {
    return <p className="pnl-vazio">{vazio}</p>;
  }

  const maior = Math.max(...itens.map((i) => i.valor), 1);
  const soma = itens.reduce((acumulado, i) => acumulado + i.valor, 0);
  const diferenca = total === undefined ? 0 : total - soma;

  return (
    <>
      <ul className="pnl-barras">
        {itens.map((item) => (
          <li key={item.nome}>
            <div className="pnl-barra-topo">
              <span className="pnl-barra-nome">{item.nome}</span>
              <span className="pnl-barra-valor">
                {n(item.valor)}
                {mostrarParte && soma > 0 ? (
                  <span className="pnl-barra-parte">
                    {pctCurto(item.valor, soma)}
                  </span>
                ) : null}
              </span>
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

      {diferenca > 0 ? (
        <p className="pnl-diferenca">
          <b>
            {n(diferenca)} {diferenca === 1 ? "clique não aparece" : "cliques não aparecem"}{" "}
            nesta lista.
          </b>{" "}
          O total do período é {n(total ?? 0)}, e as linhas acima somam {n(soma)}.
          A plataforma omite recortes com pouquíssimos acessos, por privacidade.
          O total é o número certo; esta lista mostra a parte que ela liberou.
        </p>
      ) : null}
    </>
  );
}
