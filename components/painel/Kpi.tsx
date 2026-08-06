// A fila de indicadores do topo de cada página — `.grid-6` e `.grid-4` da
// demonstração, com `.kpi-label`, `.kpi-value` em monoespaçada, `.kpi-foot` com
// variação e a mini-série de 52 × 18.
//
// ============================================================================
// POR QUE A FILA E O GLOSSÁRIO SÃO O MESMO COMPONENTE
// ============================================================================
//
// A regra 2 de `08-matriz-do-dashboard.md` exige que todo indicador que possa
// ser mal lido carregue a linha do que ele NÃO significa. No cartão grande essa
// linha cabe embaixo do número. Num KPI de 130 pixels de altura, não cabe — e a
// saída fácil seria pendurá-la num balão de `title`, que **não existe em
// celular**, onde não há ponteiro para passar por cima.
//
// Então a fila renderiza as duas coisas de uma vez: os cartões e, logo abaixo,
// um `<details>` com a explicação de cada um, por extenso e sem depender de
// hover. Não é possível montar a fila e esquecer as explicações, porque saem do
// mesmo array — e `limite` é propriedade obrigatória, como no `Cartao`.

export type ItemKpi = {
  rotulo: string;
  /** Já formatado. Travessão quando a plataforma não devolveu o número. */
  valor: string;
  /** Linha de rodapé: comparação, base de cálculo, o que for. */
  nota?: React.ReactNode;
  /** Variação contra o período anterior, com sinal. `null` quando não há base. */
  variacao?: string | null;
  /** Série curta para a mini-linha. Menos de 3 pontos não desenha nada. */
  serie?: number[];
  /** O que este número NÃO significa. Obrigatório — regra 2 da matriz. */
  limite: string;
  tom?: "acao" | "contexto" | "neutro";
};

export default function FilaKpi({
  itens,
  colunas = 6,
}: {
  itens: ItemKpi[];
  /** 6 para a fila larga da visão geral, 4 para as páginas internas. */
  colunas?: 4 | 6;
}) {
  return (
    <>
      <div className={`grid grid-${colunas}`}>
        {itens.map((item) => (
          <Kpi key={item.rotulo} {...item} />
        ))}
      </div>

      <details className="explicacoes">
        <summary>O que cada indicador acima quer dizer</summary>
        <dl className="glossario">
          {itens.map((item) => (
            <div key={item.rotulo}>
              <dt>{item.rotulo}</dt>
              <dd>{item.limite}</dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  );
}

function Kpi({ rotulo, valor, nota, variacao, serie, limite, tom = "neutro" }: ItemKpi) {
  const desce = variacao?.startsWith("-") ?? false;

  return (
    <article className={`card kpi${tom === "neutro" ? "" : ` card-${tom}`}`}>
      <div>
        <div className="kpi-label">
          {rotulo}
          {/* Atalho para quem tem ponteiro. A mesma frase está no
              `<details>` acima, visível para quem não tem. */}
          <span className="explica" data-tip={limite} aria-hidden="true">
            ?
          </span>
        </div>
        <div className={`kpi-value${tom === "neutro" ? "" : ` ${tom}`}`}>{valor}</div>
      </div>
      <div className="kpi-foot">
        <span>
          {variacao ? (
            <>
              <b className={`delta${desce ? " down" : ""}`}>
                {desce ? "↓" : "↑"} {variacao.replace("-", "").replace("+", "")}
              </b>{" "}
              vs. anterior
            </>
          ) : (
            nota
          )}
        </span>
        {serie && serie.length >= 3 ? <Micro serie={serie} desce={desce} /> : null}
      </div>
      {variacao && nota ? (
        <div className="kpi-foot" style={{ marginTop: 4 }}>
          <span>{nota}</span>
        </div>
      ) : null}
    </article>
  );
}

/**
 * A mini-série de 52 × 18 do `.kpi-foot`.
 *
 * Sem eixo, sem número e sem escala declarada — de propósito. Ela diz "subiu",
 * "desceu" ou "oscilou", e é só isso que uma linha de 52 pixels consegue dizer
 * com honestidade. O número que importa está logo acima, em corpo grande.
 */
function Micro({ serie, desce }: { serie: number[]; desce: boolean }) {
  const maior = Math.max(...serie, 1);
  const menor = Math.min(...serie);
  const amplitude = maior - menor || 1;
  const passo = 52 / (serie.length - 1);

  const pontos = serie
    .map((valor, i) => {
      const x = i * passo;
      // 2 e 16 em vez de 0 e 18: a espessura do traço é 2, e um pico exato na
      // borda sai cortado pela metade.
      const y = 16 - ((valor - menor) / amplitude) * 14;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" L ");

  // Série inteiramente plana: nem sobe nem desce, e pintar de verde ou de
  // vermelho afirmaria uma direção que não existe.
  const plana = maior === menor;

  return (
    <svg
      className={`micro${plana ? " flat" : desce ? " down" : ""}`}
      viewBox="0 0 52 18"
      aria-hidden="true"
    >
      <path d={`M ${pontos}`} />
    </svg>
  );
}
