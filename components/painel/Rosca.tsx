import { n, pctCurto } from "@/lib/painel/formato";

// Rosca de composição — `.donut-layout` da demonstração: o anel em
// `conic-gradient` à esquerda, a legenda em lista à direita.
//
// **Por que a escala é de um matiz só.** Azul e violeta já significam coisa no
// painel: ação importante e sinal de contexto. Se a rosca usasse as duas, o
// leitor teria motivo para achar que as origens também se dividem nessas
// famílias — e não se dividem: origem é categoria neutra. A escala vai do azul
// escuro ao claro, seguindo a ordem de tamanho. Cor sequencial para dado
// ordenado, e nenhuma colisão com o significado que as outras duas carregam.
//
// O anel é CSS puro, sem SVG: `conic-gradient` com as paradas calculadas no
// servidor. É como a demonstração faz, e evita a trigonometria dos arcos.

const ESCALA = ["#1748c7", "#246bfd", "#5b8dff", "#8fb2ff", "#b9cdff", "#d8e3ff"];
const RESTO = "#b7c0cf";

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
    return <p className="vazio">{vazio}</p>;
  }

  // A partir da sétima fatia tudo vira uma só: sete cores já são mais do que
  // alguém distingue num anel, e a sétima linha de uma lista de origem nunca é
  // o que decide alguma coisa.
  const visiveis = itens.slice(0, ESCALA.length);
  const sobra = itens.slice(ESCALA.length);
  const somaSobra = sobra.reduce((soma, i) => soma + i.valor, 0);

  const fatias = [
    ...visiveis.map((item, i) => ({ ...item, cor: ESCALA[i] })),
    ...(somaSobra > 0
      ? [{ nome: "Outras origens", valor: somaSobra, cor: RESTO }]
      : []),
  ];

  // As paradas do gradiente cônico, em porcentagem acumulada. Cada fatia
  // começa onde a anterior terminou — sem isso o gradiente interpola e o anel
  // vira degradê em vez de setores.
  let acumulado = 0;
  const paradas = fatias
    .map((fatia) => {
      const inicio = acumulado;
      acumulado += (fatia.valor / total) * 100;
      return `${fatia.cor} ${inicio.toFixed(2)}% ${acumulado.toFixed(2)}%`;
    })
    .join(",");

  return (
    <div className="donut-layout">
      <div
        className="donut"
        style={{ ["--fatias" as string]: paradas }}
        role="img"
        aria-label={`Origem das visitas: ${fatias
          .map((f) => `${f.nome}, ${n(f.valor)}`)
          .join("; ")}.`}
      >
        <div className="donut-center">
          <strong>{n(total)}</strong>
          <span>{rotuloCentro}</span>
        </div>
      </div>

      <ul className="donut-list">
        {fatias.map((fatia) => (
          <li className="donut-item" key={fatia.nome}>
            <i style={{ ["--c" as string]: fatia.cor }} aria-hidden="true" />
            <span>{fatia.nome}</span>
            <strong>{pctCurto(fatia.valor, total)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
