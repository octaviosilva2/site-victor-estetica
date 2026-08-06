// Formatação de números e datas do painel, sempre em português do Brasil.

const numero = new Intl.NumberFormat("pt-BR");
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function n(valor: number): string {
  return numero.format(valor);
}

export function brl(valor: number): string {
  return moeda.format(valor);
}

/**
 * Percentual com uma casa decimal.
 *
 * Denominador zero devolve travessão, não `0%`. Em cliente de baixo volume um
 * período sem sessão nenhuma é normal, e "0,0%" ali afirmaria que ninguém
 * entrou em contato — quando a verdade é que ninguém visitou.
 */
export function pct(numerador: number, denominador: number): string {
  if (!denominador) return "—";
  return `${((numerador / denominador) * 100).toFixed(1).replace(".", ",")}%`;
}

export function quando(iso: string): string {
  return dataHora.format(new Date(iso));
}

/** `20260805` → `05/08`. Formato que a API devolve na dimensão de data. */
export function diaCurto(aaaammdd: string): string {
  if (aaaammdd?.length !== 8) return aaaammdd ?? "";
  return `${aaaammdd.slice(6, 8)}/${aaaammdd.slice(4, 6)}`;
}

/**
 * Variação percentual contra o período anterior, já com o sinal.
 *
 * Sem base de comparação — período anterior zerado — devolve `null`, e o cartão
 * omite a linha. "Aumento de 100%" sobre zero não informa nada.
 */
export function variacao(atual: number, anterior: number): string | null {
  if (!anterior) return null;
  const delta = ((atual - anterior) / anterior) * 100;
  const sinal = delta > 0 ? "+" : "";
  return `${sinal}${delta.toFixed(0)}%`;
}

/**
 * Os 7 valores de `click_position` traduzidos para nomes que o cliente
 * reconhece na própria página.
 *
 * Os valores crus são os declarados na seção 4 do `CLAUDE.md` do repositório.
 * Um valor que não estiver no mapa aparece como veio — é sinal de que alguém
 * criou um ponto de rastreio novo, e esconder isso atrás de um rótulo genérico
 * apagaria a pista.
 */
const POSICOES: Record<string, string> = {
  menu_superior: "Menu do topo",
  topo: "Primeira tela",
  fechamento: "Fim da página",
  detalhe_procedimento: "Dentro de um procedimento",
  menu_lateral: "Menu lateral",
  contato: "Seção de contato",
  flutuante: "Botão flutuante",
  resultados: "Seção de resultados",
  avaliacoes: "Seção de avaliações",
};

export function posicao(valor: string): string {
  if (!valor || valor === "(not set)") return "Sem posição registrada";
  return POSICOES[valor] ?? valor;
}

/** Dias da semana na convenção da plataforma: 0 é domingo. */
export const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
