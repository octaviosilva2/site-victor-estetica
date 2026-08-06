import { n, pct } from "@/lib/painel/formato";

// Funil com faixas de opacidade crescente — `.funnel` da demonstração.
//
// ============================================================================
// ISTO NÃO É INDICADOR NOVO
// ============================================================================
//
// Cada etapa deste funil é um indicador que já existe em
// `08-matriz-do-dashboard.md`, mostrado noutra forma: visitas (indicador 11),
// cliques em cards (8), chegada aos resultados (9) e cliques no WhatsApp (2).
// Nenhum número é calculado aqui que não seja calculado em outro lugar do
// painel — reapresentar não cria indicador, e a nota de reapresentação está
// registrada na matriz para que a contagem de 17 não pareça ter mudado.
//
// **O que este funil NÃO afirma.** Que as etapas são um caminho obrigatório.
// Ninguém precisa clicar num card para depois clicar no WhatsApp; muita gente
// vai direto. As etapas são recortes independentes do mesmo período, exibidos
// em ordem de proximidade do contato — e é isso que a linha de limite do cartão
// que envolve este componente diz, com todas as letras.

export type Etapa = {
  nome: string;
  descricao: string;
  valor: number;
};

export default function Funil({ etapas }: { etapas: Etapa[] }) {
  const base = etapas[0]?.valor ?? 0;

  if (base === 0) {
    return <p className="vazio">Nenhuma visita registrada no período.</p>;
  }

  return (
    <div className="funnel">
      {etapas.map((etapa, indice) => (
        <div className="funnel-row" key={etapa.nome}>
          <div className="funnel-label">
            <strong>{etapa.nome}</strong>
            <span>{etapa.descricao}</span>
          </div>
          <div className="funnel-track">
            <div
              className="funnel-fill"
              style={{
                ["--w" as string]: `${Math.max((etapa.valor / base) * 100, 6)}%`,
                // A opacidade cresce à medida que a etapa se aproxima do
                // contato: a faixa mais cheia é a que mais importa, e não a
                // maior.
                ["--op" as string]: `${42 + indice * 13}%`,
              }}
            >
              {n(etapa.valor)}
            </div>
          </div>
          <div className="funnel-rate">{pct(etapa.valor, base)}</div>
        </div>
      ))}
    </div>
  );
}
