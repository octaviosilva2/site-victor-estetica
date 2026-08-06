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
 * Origem da visita em rótulo de negócio, a partir de `sessionSource` e
 * `sessionMedium`.
 *
 * **Por que não basta a dimensão nativa de canal.** A classificação padrão da
 * plataforma joga Instagram, Facebook, TikTok e qualquer outra rede numa única
 * linha chamada `Organic Social`. Para um consultório que publica no Instagram
 * e não no Facebook, "Redes sociais: 47" não responde nada — a pergunta é se o
 * Instagram está trazendo gente, e a resposta estava escondida dentro do
 * agrupamento.
 *
 * Este mapeamento é a **revisão R1 do indicador 7** de
 * `08-matriz-do-dashboard.md`, de 2026-08-06: o cálculo declarado deixa de ser
 * "dimensão nativa de canal padrão" e passa a ser origem e meio agrupados por
 * rótulo de negócio. Não é indicador novo — é o mesmo indicador com o cálculo
 * revisado, e a revisão está registrada na matriz.
 *
 * **A ordem das regras importa.** `google` com meio pago é Google Ads; `google`
 * com meio orgânico é busca. Testar a origem antes do meio inverteria os dois.
 *
 * O que não bate com nenhuma regra volta como `origem / meio`, em vez de virar
 * "Outros": um rótulo genérico esconderia justamente a origem nova que ninguém
 * esperava, que é a única que valeria a pena descobrir.
 */
const MEIOS_PAGOS = ["cpc", "ppc", "paid", "cpm", "cpv", "cpa", "retargeting"];

export function origem(fonte: string, meio: string): string {
  const f = (fonte || "").toLowerCase();
  const m = (meio || "").toLowerCase();
  const pago = MEIOS_PAGOS.some((p) => m.includes(p));

  // Acesso direto: a plataforma não escreve isso de uma forma só.
  if (f === "(direct)" || f === "direct" || (!f && !m)) return "Acesso direto";

  // As redes primeiro, e por conteúdo do texto: o Instagram chega como
  // `instagram`, `instagram.com`, `l.instagram.com` e `ig`, conforme o
  // aplicativo que abriu o link.
  if (f.includes("instagram") || f === "ig") {
    return pago ? "Anúncio no Instagram" : "Instagram";
  }
  if (f.includes("facebook") || f === "fb" || f.includes("fb.me")) {
    return pago ? "Anúncio no Facebook" : "Facebook";
  }
  // `l.wl.co` é o redirecionador de links do WhatsApp — quem chega por ali
  // clicou num link enviado numa conversa.
  if (f.includes("whatsapp") || f.includes("wa.me") || f.includes("l.wl.co")) {
    return "WhatsApp";
  }
  if (f.includes("youtube")) return "YouTube";
  if (f.includes("tiktok")) return "TikTok";
  if (f.includes("linkedin")) return "LinkedIn";

  if (f.includes("google")) {
    if (pago) return "Google Ads";
    if (m === "organic" || !m || m === "(none)") return "Busca no Google";
    if (m === "referral") return "Google — outros serviços";
  }
  if (f.includes("bing") || f.includes("duckduckgo") || f.includes("yahoo")) {
    return "Busca em outro buscador";
  }

  if (pago) return "Anúncio pago";
  if (m === "email" || m === "e-mail") return "E-mail";
  if (m === "referral") return "Link em outro site";
  if (f === "(not set)" || m === "(not set)") return "Origem não identificada";

  return `${fonte} / ${meio}`;
}

/**
 * O que cada rótulo de origem quer dizer, para quem nunca viu o termo.
 *
 * Pedido do cliente em 06/08 — "acesso direto" foi o exemplo que ele deu pelo
 * nome. Um rótulo que o leitor interpreta errado é pior do que rótulo nenhum:
 * "acesso direto" soa como "digitou o endereço", e quase nunca é isso.
 */
const EXPLICACAO_ORIGEM: Record<string, string> = {
  "Acesso direto":
    "O navegador não informou de onde a pessoa veio. Quase sempre é link salvo, endereço digitado, link colado numa conversa ou clique dentro de um aplicativo. Não quer dizer que a pessoa já conhecia o site.",
  Instagram: "Veio de um link no Instagram — perfil, story ou publicação.",
  Facebook: "Veio de um link no Facebook.",
  WhatsApp:
    "Alguém mandou o link do site numa conversa de WhatsApp e a pessoa clicou. É indicação boca a boca acontecendo.",
  "Busca no Google":
    "A pessoa pesquisou no Google e clicou no resultado sem anúncio. É a busca que o site conquista sozinho.",
  "Google Ads": "Veio de um anúncio pago no Google.",
  "Link em outro site":
    "Outro site tem um link para o do consultório e alguém clicou nele.",
  "Origem não identificada":
    "A plataforma não conseguiu classificar de onde veio. Não é erro de medição nem visita perdida — é ausência de classificação.",
  "Anúncio no Instagram": "Veio de um anúncio pago exibido no Instagram.",
  "Anúncio no Facebook": "Veio de um anúncio pago exibido no Facebook.",
  "Busca em outro buscador":
    "A pessoa pesquisou em um buscador que não é o Google — Bing, DuckDuckGo ou Yahoo.",
};

export function explicarOrigem(rotulo: string): string | undefined {
  return EXPLICACAO_ORIGEM[rotulo];
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
