import { n, pctCurto } from "@/lib/painel/formato";

// Rosca de composição, para o indicador 7 — de onde vêm as sessões.
// `08-matriz-do-dashboard.md` prevê "rosca ou barras" para este indicador.
//
// **Por que a escala aqui é de um matiz só.** Índigo e ciano já significam
// coisa no painel: ação importante e sinal de contexto. Se a rosca usasse as
// duas, o leitor teria motivo para achar que os canais também se dividem
// nessas famílias — e eles não se dividem: canal é origem de sessão, categoria
// neutra. A escala é toda de índigo/violeta, do mais escuro ao mais claro,
// seguindo a ordem de tamanho. Cor sequencial para dado ordenado, e nenhuma
// colisão com o significado que as outras duas cores carregam.
//
// Desenhada com `stroke-dasharray` num círculo, e não com caminhos de arco:
// menos trigonometria, nenhum caso especial em fatia de 100%.

const ESCALA = ["#3730a3", "#4f46e5", "#7c3aed", "#8b5cf6", "#a5b4fc", "#c7d2fe"];
const RESTO = "#868fa0";

const RAIO = 60;
const ESPESSURA = 22;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export default function Rosca({
  itens,
  rotuloCentro,
  vazio,
}: {
  itens: { nome: string; valor: number }[];
  /** O que o número do meio representa. Duas palavras, no máximo. */
  rotuloCentro: string;
  vazio: string;
}) {
  const total = itens.reduce((soma, i) => soma + i.valor, 0);

  if (itens.length === 0 || total === 0) {
    return <p className="pnl-vazio">{vazio}</p>;
  }

  // A partir da sétima fatia tudo vira uma só: sete cores já são mais do que
  // alguém distingue numa rosca, e a sétima linha de uma lista de origem nunca
  // é o que decide alguma coisa.
  const visiveis = itens.slice(0, ESCALA.length);
  const sobra = itens.slice(ESCALA.length);
  const somaSobra = sobra.reduce((soma, i) => soma + i.valor, 0);

  const fatias = [
    ...visiveis.map((item, i) => ({ ...item, cor: ESCALA[i] })),
    ...(somaSobra > 0
      ? [{ nome: "Outras origens", valor: somaSobra, cor: RESTO }]
      : []),
  ];

  let acumulado = 0;

  return (
    <div className="pnl-rosca-bloco">
      <svg
        className="pnl-rosca"
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Origem das sessões: ${fatias
          .map((f) => `${f.nome}, ${n(f.valor)}`)
          .join("; ")}.`}
      >
        <g transform="rotate(-90 80 80)">
          {fatias.map((fatia) => {
            const comprimento = (fatia.valor / total) * CIRCUNFERENCIA;
            const deslocamento = -acumulado;
            acumulado += comprimento;
            return (
              <circle
                key={fatia.nome}
                cx="80"
                cy="80"
                r={RAIO}
                fill="none"
                stroke={fatia.cor}
                strokeWidth={ESPESSURA}
                strokeDasharray={`${comprimento.toFixed(2)} ${CIRCUNFERENCIA.toFixed(2)}`}
                strokeDashoffset={deslocamento.toFixed(2)}
              />
            );
          })}
        </g>
        <text
          x="80"
          y="78"
          textAnchor="middle"
          className="pnl-rosca-centro-numero"
        >
          {n(total)}
        </text>
        <text
          x="80"
          y="94"
          textAnchor="middle"
          className="pnl-rosca-centro-rotulo"
        >
          {rotuloCentro}
        </text>
      </svg>

      <ul className="pnl-legenda">
        {fatias.map((fatia) => (
          <li key={fatia.nome}>
            <span
              className="pnl-legenda-cor"
              style={{ background: fatia.cor }}
              aria-hidden="true"
            />
            <span className="pnl-legenda-nome">{fatia.nome}</span>
            <span className="pnl-legenda-valor">
              {n(fatia.valor)}
              <span>{pctCurto(fatia.valor, total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
