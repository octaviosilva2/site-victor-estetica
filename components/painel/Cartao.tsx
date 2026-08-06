// Cartão grande. É o bloco de leitura das seções que precisam de mais do que um
// número — gráfico, lista, tabela — com título, nota e as duas linhas de texto
// que a matriz exige.
//
// Três propriedades carregam regra de contrato, e não gosto:
//
// `limite` — `08-matriz-do-dashboard.md`, regra 2: todo indicador que possa ser
// mal interpretado carrega uma linha dizendo o que ele NÃO significa. É
// obrigatória de propósito: esquecer de escrever a limitação passa a ser erro
// de compilação, e não um detalhe que alguém repara meses depois.
//
// `tom` — regra 1: ação importante e sinal de contexto nunca se somam. O tom
// pinta a faixa do topo do cartão, que é como a regra continua visível na tela
// depois que ninguém lembrar mais dela.
//
// `leitura` — o que fazer com o número. É a diferença entre um painel que
// informa e um que orienta: "11 cliques" não diz nada sozinho. Fica ACIMA do
// limite de propósito — a orientação é o que o cliente procura, e a ressalva
// vem depois dela, não no lugar dela.

export type Tom = "acao" | "contexto" | "neutro";

export default function Cartao({
  titulo,
  nota,
  etiqueta,
  leitura,
  limite,
  tom = "neutro",
  largura,
  children,
}: {
  titulo: string;
  /** Subtítulo curto, embaixo do título. */
  nota?: string;
  /** Pastilha no canto direito do cabeçalho. */
  etiqueta?: React.ReactNode;
  /** O que fazer com este número. Omitida quando não há o que dizer. */
  leitura?: React.ReactNode;
  /** O que este número não significa. Obrigatório. */
  limite: string;
  tom?: Tom;
  /** Quantas colunas o cartão ocupa na grade. */
  largura?: 2 | 3;
  children: React.ReactNode;
}) {
  const classes = [
    "card",
    tom === "neutro" ? "" : `card-${tom}`,
    largura ? `span-${largura}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <div className="card-head">
        <div>
          <h2 className="card-title">{titulo}</h2>
          {nota ? <p className="card-note">{nota}</p> : null}
        </div>
        {etiqueta}
      </div>

      {children}

      {leitura ? <p className="leitura">{leitura}</p> : null}
      <p className="limite">{limite}</p>
    </article>
  );
}
