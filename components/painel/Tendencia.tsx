import { diaCurto, n } from "@/lib/painel/formato";

// Linha de tendência das sessões, desenhada em SVG à mão.
//
// Sem biblioteca de gráfico de propósito: o painel vive no mesmo repositório
// do site, e cada dependência nova entra também no build do site institucional.
// Uma linha e uns eixos não justificam isso.

export default function Tendencia({
  serie,
}: {
  serie: { data: string; sessoes: number }[];
}) {
  if (serie.length < 2) {
    return (
      <p className="pnl-vazio">
        Ainda não há dias suficientes no período para desenhar a tendência.
      </p>
    );
  }

  const largura = 100;
  const altura = 30;
  const maior = Math.max(...serie.map((p) => p.sessoes), 1);
  const passo = largura / (serie.length - 1);

  const pontos = serie
    .map((p, i) => `${(i * passo).toFixed(2)},${(altura - (p.sessoes / maior) * altura).toFixed(2)}`)
    .join(" ");

  const primeiro = serie[0];
  const ultimo = serie[serie.length - 1];

  return (
    <>
      <svg
        className="pnl-tendencia"
        viewBox={`0 0 ${largura} ${altura}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Sessões por dia, de ${diaCurto(primeiro.data)} a ${diaCurto(ultimo.data)}. Maior dia: ${n(maior)} sessões.`}
      >
        <polyline
          points={pontos}
          fill="none"
          stroke="var(--forest)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="pnl-comparacao">
        {diaCurto(primeiro.data)} a {diaCurto(ultimo.data)} · maior dia:{" "}
        <b>{n(maior)}</b> sessões
      </p>
    </>
  );
}
