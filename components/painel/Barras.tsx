import { n, pctCurto } from "@/lib/painel/formato";

// Barras horizontais na grade nome | trilha | valor da demonstração
// (`.bars` / `.bar-row`). A largura é proporcional ao MAIOR valor da própria
// lista, e não a um total — as listas do painel não somam um todo fechado.
//
// A opacidade decresce com a ordem, como na demonstração: a primeira linha vem
// cheia, as seguintes vão esmaecendo. É o que faz a ordem ser legível sem
// precisar ler os números.
//
// `tom` segue a convenção de cor do painel: azul para ação importante, violeta
// para sinal de contexto. Duas listas de cores diferentes na mesma tela são um
// aviso visual de que não se somam.
//
// **`total` implementa a regra 7 de `08-matriz-do-dashboard.md`.** Quando o
// total do evento é conhecido e a soma das linhas não bate com ele, a diferença
// aparece escrita, na própria tela. Foi exatamente esse silêncio que derrubou a
// confiança no painel em 06/08: um cartão dizia 11, as barras somavam 8, e nada
// explicava os 3 que faltavam. A plataforma pode omitir linhas por limiar de
// privacidade, e um painel que não avisa deixa o leitor concluir que a conta
// está errada.

export type ItemBarra = { nome: string; valor: number };

export default function Barras({
  itens,
  tom = "acao",
  vazio,
  total,
  mostrarParte = true,
  formatar,
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
  /** Formatação alternativa do valor, para dinheiro ou tempo. */
  formatar?: (valor: number) => string;
}) {
  if (itens.length === 0) {
    return <p className="vazio">{vazio}</p>;
  }

  const maior = Math.max(...itens.map((i) => i.valor), 1);
  const soma = itens.reduce((acumulado, i) => acumulado + i.valor, 0);
  const diferenca = total === undefined ? 0 : total - soma;

  return (
    <>
      <ul className="bars">
        {itens.map((item, indice) => (
          <li className="bar-row" key={item.nome}>
            <span className="bar-name" title={item.nome}>
              {item.nome}
            </span>
            <div className="bar-track">
              <div
                className={`bar-fill${tom === "contexto" ? " contexto" : ""}`}
                style={{
                  // A barra nunca some: 2% de largura mínima mantém a linha
                  // visível para um valor 1 ao lado de um valor 400.
                  ["--w" as string]: `${Math.max((item.valor / maior) * 100, 2)}%`,
                  ["--o" as string]: `${Math.max(1 - indice * 0.14, 0.38)}`,
                }}
              />
            </div>
            <span className="bar-value">
              {formatar ? formatar(item.valor) : n(item.valor)}
              {mostrarParte && soma > 0 && !formatar ? (
                <span>{pctCurto(item.valor, soma)}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      {diferenca > 0 ? (
        <p className="diferenca">
          <b>
            {n(diferenca)}{" "}
            {diferenca === 1 ? "clique não aparece" : "cliques não aparecem"} nesta
            lista.
          </b>{" "}
          O total do período é {n(total ?? 0)}, e as linhas acima somam {n(soma)}. A
          plataforma omite recortes com pouquíssimos acessos, por privacidade. O
          total é o número certo; esta lista mostra a parte que ela liberou.
        </p>
      ) : null}
    </>
  );
}
