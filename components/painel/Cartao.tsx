// Cartão de indicador. É a unidade de leitura do painel inteiro.
//
// `limite` não é decoração: `08-matriz-do-dashboard.md`, regra 2, determina que
// todo indicador que possa ser mal interpretado carregue uma linha dizendo o
// que ele NÃO significa. Por isso a propriedade é obrigatória — esquecer de
// escrever a limitação passa a ser erro de compilação, e não um detalhe que
// alguém repara meses depois.
//
// `tom` escolhe a cor do número e carrega significado:
//   "acao"     — ação importante. Só o WhatsApp.
//   "contexto" — sinal de contexto. Instagram, endereço, Grupo VIP.
//   "neutro"   — número de alcance, que não é nem uma coisa nem outra.

export type Tom = "acao" | "contexto" | "neutro";

const CLASSE_TOM: Record<Tom, string> = {
  acao: "",
  contexto: " pnl-numero-contexto",
  neutro: " pnl-numero-neutro",
};

export default function Cartao({
  rotulo,
  valor,
  comparacao,
  limite,
  tom = "neutro",
  children,
}: {
  rotulo: string;
  valor: string;
  /** Linha de comparação com o período anterior. Omitida quando não há base. */
  comparacao?: React.ReactNode;
  /** O que este número não significa. Obrigatório. */
  limite: string;
  tom?: Tom;
  children?: React.ReactNode;
}) {
  return (
    <div className="pnl-cartao">
      <p className="pnl-cartao-rotulo">{rotulo}</p>
      <p className={`pnl-numero${CLASSE_TOM[tom]}`}>{valor}</p>
      {comparacao ? <p className="pnl-comparacao">{comparacao}</p> : null}
      {children}
      <p className="pnl-limite">{limite}</p>
    </div>
  );
}
