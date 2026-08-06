// Formatação e tradução de tudo o que a plataforma devolve, sempre em
// português do Brasil.
//
// **Por que traduzir é obrigatório e não é capricho.** A Data API responde em
// inglês: `Unassigned`, `Organic Social`, `State of Santa Catarina`. Entregar
// isso ao cliente transfere para ele o trabalho de decifrar a ferramenta — e
// termos como "Unassigned" não são apenas estrangeiros, são jargão de dentro do
// produto do Google. Quem lê "Unassigned" conclui que faltou alguma coisa.

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

/** Percentual sem casa decimal, para texto corrido. */
export function pctCurto(numerador: number, denominador: number): string {
  if (!denominador) return "—";
  return `${Math.round((numerador / denominador) * 100)}%`;
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
 * Os valores de `click_position` traduzidos para nomes que o cliente
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

/**
 * Os canais de origem da plataforma, traduzidos.
 *
 * Dois merecem explicação, porque a tradução literal não bastaria:
 *
 * - **`Direct`** não quer dizer "veio direto do nada". Quer dizer que o
 *   navegador não informou de onde veio — link salvo, endereço digitado,
 *   aplicativo de mensagem, PDF. "Acesso direto" é o mais próximo que se pode
 *   dizer sem afirmar demais.
 * - **`Unassigned`** é a plataforma dizendo que não conseguiu classificar. Não
 *   é categoria de origem, é ausência de classificação — e o cliente que lê
 *   "não atribuído" entende que faltou algo, quando não faltou.
 */
const CANAIS: Record<string, string> = {
  Direct: "Acesso direto",
  "Organic Search": "Busca no Google",
  "Paid Search": "Anúncio na busca",
  "Organic Social": "Redes sociais",
  "Paid Social": "Anúncio em rede social",
  "Organic Video": "Vídeo",
  "Paid Video": "Anúncio em vídeo",
  "Organic Shopping": "Vitrine de compras",
  "Paid Shopping": "Anúncio de compras",
  "Paid Other": "Outro anúncio",
  "Cross-network": "Anúncio em várias redes",
  Display: "Anúncio de display",
  Email: "E-mail",
  Referral: "Link em outro site",
  Affiliates: "Afiliados",
  Audio: "Áudio",
  SMS: "SMS",
  "Mobile Push Notifications": "Notificação de aplicativo",
  Unassigned: "Origem não identificada",
  "(not set)": "Origem não identificada",
  "(direct)": "Acesso direto",
};

export function canal(valor: string): string {
  return CANAIS[valor] ?? valor;
}

/**
 * Nomes de região como a plataforma os devolve: em inglês, e com o prefixo
 * "State of" nos estados brasileiros. `State of Santa Catarina` vira
 * `Santa Catarina`.
 *
 * O prefixo é removido de forma genérica em vez de estado por estado — são 27
 * unidades federativas, e uma lista incompleta deixaria justamente as menos
 * frequentes em inglês, que é onde ninguém repararia.
 */
const REGIOES: Record<string, string> = {
  "Federal District": "Distrito Federal",
  "(not set)": "Região não identificada",
};

export function regiao(valor: string): string {
  if (!valor) return "Região não identificada";
  if (REGIOES[valor]) return REGIOES[valor];
  return valor.replace(/^State of\s+/i, "");
}

export function cidade(valor: string): string {
  if (!valor || valor === "(not set)") return "Cidade não identificada";
  return valor;
}

/** Dias da semana na convenção da plataforma: 0 é domingo. */
export const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Plural simples, para frases montadas com número. */
export function plural(quantidade: number, singular: string, plural: string): string {
  return quantidade === 1 ? singular : plural;
}
