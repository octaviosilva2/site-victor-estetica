// Cartão de indicador. É a unidade de leitura do painel inteiro.
//
// Três propriedades carregam regra de contrato, e não gosto:
//
// `limite` — `08-matriz-do-dashboard.md`, regra 2: todo indicador que possa ser
// mal interpretado carrega uma linha dizendo o que ele NÃO significa. Por isso
// é obrigatória: esquecer de escrever a limitação passa a ser erro de
// compilação, e não um detalhe que alguém repara meses depois.
//
// `tom` — regra 1: ação importante e sinal de contexto nunca se somam. O tom
// pinta a faixa do topo e o ponto do rótulo, que é como a regra continua
// visível na tela depois que ninguém lembrar mais dela.
//
// `leitura` — o que fazer com o número. É a diferença entre um painel que
// informa e um que orienta: "11 cliques" não diz nada sozinho. Fica ACIMA do
// limite de propósito — a orientação é o que o cliente procura, e a ressalva
// vem depois dela, não no lugar dela.

export type Tom = "acao" | "contexto" | "neutro";

const CLASSE_CARTAO: Record<Tom, string> = {
  acao: " pnl-cartao-acao",
  contexto: " pnl-cartao-contexto",
  neutro: "",
};

const CLASSE_PONTO: Record<Tom, string> = {
  acao: " pnl-ponto-acao",
  contexto: " pnl-ponto-contexto",
  neutro: "",
};

export default function Cartao({
  rotulo,
  valor,
  comparacao,
  leitura,
  limite,
  tom = "neutro",
  destaque = false,
  children,
}: {
  rotulo: string;
  valor: string;
  /** Linha de comparação com o período anterior. Omitida quando não há base. */
  comparacao?: React.ReactNode;
  /** O que fazer com este número. Omitida quando não há o que dizer. */
  leitura?: React.ReactNode;
  /** O que este número não significa. Obrigatório. */
  limite: string;
  tom?: Tom;
  /** Número maior, para o indicador que a página existe para responder. */
  destaque?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`pnl-cartao${CLASSE_CARTAO[tom]}`}>
      <p className="pnl-cartao-rotulo">
        {tom === "neutro" ? null : (
          <span className={`pnl-ponto${CLASSE_PONTO[tom]}`} aria-hidden="true" />
        )}
        {rotulo}
      </p>

      <p
        className={`pnl-numero${tom === "acao" ? " pnl-numero-acao" : ""}${
          destaque ? " pnl-numero-grande" : ""
        }`}
      >
        {valor}
      </p>

      {comparacao ? <p className="pnl-comparacao">{comparacao}</p> : null}
      {children}
      {leitura ? <p className="pnl-leitura">{leitura}</p> : null}
      <p className="pnl-limite">{limite}</p>
    </div>
  );
}
