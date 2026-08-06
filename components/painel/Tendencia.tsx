import { diaCurto, n, plural } from "@/lib/painel/formato";

// Sessões por dia, desenhado em SVG à mão.
//
// Sem biblioteca de gráfico de propósito: o painel vive no mesmo repositório do
// site, e cada dependência nova entra também no build do site institucional.
//
// **Duas formas, e a escolha entre elas é honestidade, não estética.** Com
// poucos dias no período, uma linha desenha uma inclinação que não existe —
// dois pontos sempre formam uma reta, e a reta parece tendência. Até 10 dias o
// gráfico vira barras, que dizem "estes foram os dias" sem sugerir direção. De
// 11 em diante, a área faz sentido, porque aí existe forma para ler.

export default function Tendencia({
  serie,
}: {
  serie: { data: string; sessoes: number }[];
}) {
  if (serie.length === 0) {
    return (
      <p className="pnl-vazio">
        Nenhum dia com acesso registrado neste período.
      </p>
    );
  }

  const maior = Math.max(...serie.map((p) => p.sessoes), 1);
  const primeiro = serie[0];
  const ultimo = serie[serie.length - 1];
  const total = serie.reduce((soma, p) => soma + p.sessoes, 0);

  const descricao = `Sessões por dia, de ${diaCurto(primeiro.data)} a ${diaCurto(
    ultimo.data,
  )}. Maior dia: ${n(maior)} ${plural(maior, "sessão", "sessões")}.`;

  return (
    <div className="pnl-tendencia-bloco">
      {serie.length <= 10 ? (
        <Colunas serie={serie} maior={maior} descricao={descricao} />
      ) : (
        <Area serie={serie} maior={maior} descricao={descricao} />
      )}

      <div className="pnl-tendencia-eixo">
        <span>{diaCurto(primeiro.data)}</span>
        <span>
          {n(total)} {plural(total, "sessão", "sessões")} no período · maior dia:{" "}
          {n(maior)}
        </span>
        <span>{diaCurto(ultimo.data)}</span>
      </div>
    </div>
  );
}

const LARGURA = 600;
const ALTURA = 120;
const TOPO = 10; // respiro para o rótulo do maior valor não encostar na borda

/** Poucos dias: uma coluna por dia, sem sugerir direção nenhuma. */
function Colunas({
  serie,
  maior,
  descricao,
}: {
  serie: { data: string; sessoes: number }[];
  maior: number;
  descricao: string;
}) {
  const vao = LARGURA / serie.length;
  const larguraBarra = Math.min(vao * 0.55, 54);

  return (
    <svg
      className="pnl-tendencia"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={descricao}
    >
      <Grade />
      {serie.map((ponto, i) => {
        const altura = (ponto.sessoes / maior) * (ALTURA - TOPO);
        const x = i * vao + (vao - larguraBarra) / 2;
        return (
          <g key={ponto.data}>
            <rect
              x={x}
              y={ALTURA - altura}
              width={larguraBarra}
              height={Math.max(altura, 2)}
              rx="4"
              fill="var(--pnl-acao)"
            />
            {ponto.sessoes > 0 ? (
              <text
                x={x + larguraBarra / 2}
                y={ALTURA - altura - 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="var(--pnl-tinta-2)"
              >
                {n(ponto.sessoes)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** Muitos dias: área preenchida, que é onde a forma passa a informar. */
function Area({
  serie,
  maior,
  descricao,
}: {
  serie: { data: string; sessoes: number }[];
  maior: number;
  descricao: string;
}) {
  const passo = LARGURA / (serie.length - 1);
  const y = (sessoes: number) => ALTURA - (sessoes / maior) * (ALTURA - TOPO);

  const pontos = serie.map((p, i) => `${(i * passo).toFixed(1)},${y(p.sessoes).toFixed(1)}`);
  const linha = pontos.join(" ");
  const area = `0,${ALTURA} ${linha} ${LARGURA},${ALTURA}`;

  return (
    <svg
      className="pnl-tendencia"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={descricao}
    >
      <defs>
        <linearGradient id="pnl-grad-tendencia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Grade />
      <polygon points={area} fill="url(#pnl-grad-tendencia)" />
      <polyline
        points={linha}
        fill="none"
        stroke="var(--pnl-acao)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Três linhas de apoio. Sem números no eixo: o rótulo abaixo já os diz. */
function Grade() {
  return (
    <g>
      {[0.25, 0.5, 0.75].map((fracao) => (
        <line
          key={fracao}
          x1="0"
          x2={LARGURA}
          y1={ALTURA - fracao * (ALTURA - TOPO)}
          y2={ALTURA - fracao * (ALTURA - TOPO)}
          stroke="var(--pnl-borda)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <line
        x1="0"
        x2={LARGURA}
        y1={ALTURA}
        y2={ALTURA}
        stroke="var(--pnl-borda-forte)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
