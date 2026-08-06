import { diaCurto, n, plural } from "@/lib/painel/formato";

// Gráfico de linha com área — o `.chart-wrap` da demonstração, com a série do
// período atual em traço cheio e a do período ANTERIOR em traço tracejado
// (`.trend-compare`). Desenhado em SVG à mão.
//
// Sem biblioteca de gráfico de propósito: o painel vive no mesmo repositório do
// site, e cada dependência nova entra também no build do site institucional.
//
// **Duas formas, e a escolha entre elas é honestidade, não estética.** Com
// poucos dias no período, uma linha desenha uma inclinação que não existe —
// dois pontos sempre formam uma reta, e a reta parece tendência. Até 10 dias o
// gráfico vira colunas, que dizem "estes foram os dias" sem sugerir direção. De
// 11 em diante, a linha com área faz sentido, porque aí existe forma para ler.
//
// A série anterior só é desenhada na forma de linha. Em colunas ela viraria uma
// segunda fileira de barras coladas, e comparar dois períodos de dois dias cada
// é ruído, não informação.

const L = 760;
const A = 260;
const ESQ = 46; // faixa reservada aos rótulos do eixo vertical
const TOPO = 22;
const BASE = 218;

export type Ponto = { data: string; sessoes: number };

export default function Tendencia({
  serie,
  serieAnterior = [],
  rotuloSerie = "Visitas por dia",
}: {
  serie: Ponto[];
  /** Mesma métrica na janela anterior. Vazio quando não há base de comparação. */
  serieAnterior?: Ponto[];
  rotuloSerie?: string;
}) {
  if (serie.length === 0) {
    return (
      <p className="vazio">Nenhum dia com acesso registrado neste período.</p>
    );
  }

  // A escala é comum às duas séries. Escalas separadas fariam duas curvas de
  // alturas parecidas representarem números muito diferentes — que é a forma
  // mais silenciosa de mentir num gráfico comparativo.
  const maior = Math.max(
    ...serie.map((p) => p.sessoes),
    ...serieAnterior.map((p) => p.sessoes),
    1,
  );
  const total = serie.reduce((soma, p) => soma + p.sessoes, 0);
  const y = (valor: number) => BASE - (valor / maior) * (BASE - TOPO);

  const descricao = `${rotuloSerie}, de ${diaCurto(serie[0].data)} a ${diaCurto(
    serie[serie.length - 1].data,
  )}. Maior dia: ${n(maior)}.`;

  return (
    <>
      <div className="chart-wrap">
        <svg
          className="line-chart"
          viewBox={`0 0 ${L} ${A}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={descricao}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#246bfd" stopOpacity=".22" />
              <stop offset="1" stopColor="#246bfd" stopOpacity="0" />
            </linearGradient>
          </defs>

          <Grade maior={maior} />

          {serie.length <= 10 ? (
            <Colunas serie={serie} y={y} />
          ) : (
            <Linhas serie={serie} serieAnterior={serieAnterior} y={y} />
          )}

          <text className="axis-label" x={ESQ} y={A - 6}>
            {diaCurto(serie[0].data)}
          </text>
          <text className="axis-label" x={L - 44} y={A - 6}>
            {diaCurto(serie[serie.length - 1].data)}
          </text>
        </svg>
      </div>

      <div className="legend">
        <span>
          <i />
          Período atual
        </span>
        {serieAnterior.length > 0 && serie.length > 10 ? (
          <span>
            <i className="old" />
            Período anterior
          </span>
        ) : null}
        <span style={{ marginLeft: "auto" }}>
          {n(total)} {plural(total, "visita", "visitas")} no período · maior dia:{" "}
          {n(maior)}
        </span>
      </div>
    </>
  );
}

/** Poucos dias: uma coluna por dia, sem sugerir direção nenhuma. */
function Colunas({ serie, y }: { serie: Ponto[]; y: (v: number) => number }) {
  const vao = (L - ESQ - 14) / serie.length;
  const largura = Math.min(vao * 0.5, 46);

  return (
    <g>
      {serie.map((ponto, i) => {
        const topo = y(ponto.sessoes);
        const x = ESQ + i * vao + (vao - largura) / 2;
        return (
          <g key={ponto.data}>
            <rect
              className="col"
              x={x}
              y={topo}
              width={largura}
              height={Math.max(BASE - topo, 2)}
              rx="4"
              data-tip={`${diaCurto(ponto.data)} · ${n(ponto.sessoes)} ${plural(
                ponto.sessoes,
                "visita",
                "visitas",
              )}`}
            />
            {ponto.sessoes > 0 ? (
              <text
                className="axis-label"
                x={x + largura / 2}
                y={topo - 7}
                textAnchor="middle"
              >
                {n(ponto.sessoes)}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

/** Muitos dias: área preenchida, traço cheio e o período anterior tracejado. */
function Linhas({
  serie,
  serieAnterior,
  y,
}: {
  serie: Ponto[];
  serieAnterior: Ponto[];
  y: (v: number) => number;
}) {
  const caminho = (pontos: Ponto[]) => {
    if (pontos.length === 0) return "";
    const passo = (L - ESQ - 10) / Math.max(pontos.length - 1, 1);
    return pontos
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${(ESQ + i * passo).toFixed(1)} ${y(p.sessoes).toFixed(1)}`,
      )
      .join(" ");
  };

  const linha = caminho(serie);
  const passo = (L - ESQ - 10) / Math.max(serie.length - 1, 1);
  const ultimoX = ESQ + (serie.length - 1) * passo;

  return (
    <g>
      <path className="area" d={`${linha} L ${ultimoX.toFixed(1)} ${BASE} L ${ESQ} ${BASE} Z`} />
      {serieAnterior.length > 1 ? (
        <path className="trend-compare" d={caminho(serieAnterior)} />
      ) : null}
      <path className="trend" d={linha} />
      <circle
        className="point"
        cx={ultimoX}
        cy={y(serie[serie.length - 1].sessoes)}
        r="4"
      />
    </g>
  );
}

/** Quatro linhas de apoio, com o valor de cada uma escrito à esquerda. */
function Grade({ maior }: { maior: number }) {
  const niveis = [1, 0.75, 0.5, 0.25];

  return (
    <g>
      {niveis.map((fracao) => {
        const altura = BASE - fracao * (BASE - TOPO);
        return (
          <g key={fracao}>
            <path className="gridline" d={`M${ESQ} ${altura.toFixed(1)} H${L - 10}`} />
            <text className="axis-label" x="6" y={altura + 3}>
              {n(Math.round(maior * fracao))}
            </text>
          </g>
        );
      })}
      <path className="gridline" d={`M${ESQ} ${BASE} H${L - 10}`} />
    </g>
  );
}
