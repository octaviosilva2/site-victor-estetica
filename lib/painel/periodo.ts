// Filtro global de período do painel.
//
// O padrão é 28 dias por decisão registrada em `08-matriz-do-dashboard.md`:
// consultório individual em cidade de porte médio produz pouco volume, e
// janelas curtas fazem a plataforma esconder linhas inteiras pelo limiar de
// privacidade dela (risco R4). Uma janela de 7 dias mostra menos porque há
// menos dado E porque parte do que existe fica oculta — as duas causas
// aparecem iguais na tela.

export const PERIODOS = [
  { dias: 7, rotulo: "7 dias" },
  { dias: 28, rotulo: "28 dias" },
  { dias: 90, rotulo: "90 dias" },
] as const;

export const PERIODO_PADRAO = 28;

export type Periodo = {
  /** Quantidade de dias da janela. */
  dias: number;
  /** Rótulo curto, para o seletor. */
  rotulo: string;
  /** Início da janela, no formato relativo aceito pela Data API. */
  inicio: string;
  /** Fim da janela. `today` inclui o dia corrente, que é preliminar. */
  fim: string;
  /** Início da janela imediatamente anterior, do mesmo tamanho. */
  inicioAnterior: string;
  /** Fim da janela anterior — o dia antes do início da janela atual. */
  fimAnterior: string;
};

/**
 * Lê o período do endereço e devolve as duas janelas: a atual e a anterior de
 * mesmo tamanho, usada nas comparações.
 *
 * Valor desconhecido cai no padrão em vez de dar erro. O parâmetro vem da URL
 * e qualquer pessoa pode digitar o que quiser nele.
 */
export function lerPeriodo(valor: string | undefined): Periodo {
  const dias = Number(valor);
  const escolhido =
    PERIODOS.find((p) => p.dias === dias) ??
    PERIODOS.find((p) => p.dias === PERIODO_PADRAO)!;

  return {
    dias: escolhido.dias,
    rotulo: escolhido.rotulo,
    inicio: `${escolhido.dias}daysAgo`,
    fim: "today",
    inicioAnterior: `${escolhido.dias * 2}daysAgo`,
    fimAnterior: `${escolhido.dias + 1}daysAgo`,
  };
}
