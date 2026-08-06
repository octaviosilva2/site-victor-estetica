import { protos } from "@google-analytics/data";
import { unstable_cache } from "next/cache";

import { clienteGa4, propriedade, DIMENSAO, EVENTO } from "@/lib/ga4";
import type { Periodo } from "@/lib/painel/periodo";

// As consultas que alimentam os 12 indicadores de `08-matriz-do-dashboard.md`.
//
// Regra que atravessa o arquivo inteiro: **nenhum número novo é inventado
// aqui.** Cada função abaixo corresponde a uma linha daquela matriz, com o
// mesmo cálculo declarado lá. Indicador que não está na matriz não tem função
// neste arquivo, e criar uma seria implementar escopo não contratado.
//
// Errar o nome de uma dimensão personalizada não quebra build nem teste: a
// consulta responde com sucesso e a coluna vem vazia. Os nomes estão
// centralizados em `DIMENSAO`, de `lib/ga4.ts`, validados com dado real em
// EV-29 de `13-evidencias.md`. Não escreva o texto `customEvent:` aqui.

type Requisicao = protos.google.analytics.data.v1beta.IRunReportRequest;
type Filtro = protos.google.analytics.data.v1beta.IFilterExpression;

/** Uma linha de relatório já convertida para número. */
export type Linha = {
  /** Valores das dimensões, na ordem em que foram pedidas. */
  chaves: string[];
  /** Valores das métricas, na ordem em que foram pedidas. */
  valores: number[];
};

/**
 * Janela de cache do painel: 12 horas, em segundos.
 *
 * Declarado em `08-matriz-do-dashboard.md` como "até 12h" em todos os
 * indicadores, e sustentado pela seção 3 de `06-plano-de-medicao.md`: o
 * processamento da plataforma leva de 24 a 48 horas, e o crédito de atribuição
 * pode ser recalculado por até 12 dias. Consultar de minuto em minuto daria
 * variação sem significado e nenhuma informação a mais.
 */
export const CACHE_SEGUNDOS = 12 * 60 * 60;

async function consultar(req: Omit<Requisicao, "property">): Promise<Linha[]> {
  const [resposta] = await clienteGa4().runReport({
    ...req,
    property: propriedade(),
  });

  return (resposta.rows ?? []).map((linha) => ({
    chaves: (linha.dimensionValues ?? []).map((d) => d.value ?? ""),
    valores: (linha.metricValues ?? []).map((m) => Number(m.value ?? 0)),
  }));
}

/** Filtro de igualdade exata numa dimensão. */
function igual(campo: string, valor: string): Filtro {
  return {
    filter: {
      fieldName: campo,
      stringFilter: { value: valor, matchType: "EXACT" },
    },
  };
}

/** Filtro de pertencimento a uma lista de valores. */
function umDentre(campo: string, valores: string[]): Filtro {
  return { filter: { fieldName: campo, inListFilter: { values: valores } } };
}

/** Todos os filtros precisam valer ao mesmo tempo. */
function e(...expressoes: Filtro[]): Filtro {
  return { andGroup: { expressions: expressoes } };
}

/** Primeiro valor de métrica da primeira linha, ou zero se não houver linha. */
function primeiro(linhas: Linha[], indice = 0): number {
  return linhas[0]?.valores[indice] ?? 0;
}

// ---------------------------------------------------------------------------
// Página 1 — Visão geral (indicadores 10, 2 e 7)
// ---------------------------------------------------------------------------

export type VisaoGeral = {
  usuariosAtivos: number;
  sessoes: number;
  sessoesAnterior: number;
  cliquesWhatsapp: number;
  cliquesWhatsappAnterior: number;
  /** Sessões em que houve ao menos um clique no WhatsApp. Numerador da taxa. */
  sessoesComWhatsapp: number;
  /** Série diária para a linha de tendência: data (AAAAMMDD) e sessões. */
  serie: { data: string; sessoes: number; usuarios: number }[];
  /** Canais de origem, do maior para o menor. */
  canais: { canal: string; sessoes: number }[];
  geradoEm: string;
};

async function carregarVisaoGeral(periodo: Periodo): Promise<VisaoGeral> {
  const janelas = [
    { startDate: periodo.inicio, endDate: periodo.fim },
    { startDate: periodo.inicioAnterior, endDate: periodo.fimAnterior },
  ];

  const [nativas, whatsapp, serie, canais] = await Promise.all([
    // Usuários ativos e sessões nas duas janelas. Com dois intervalos, a API
    // devolve uma linha por intervalo, na ordem em que foram pedidos.
    consultar({
      dateRanges: janelas,
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    }),
    // O indicador principal do contrato, e a base da taxa de ações
    // importantes: `sessions` sob filtro de evento devolve as sessões em que
    // aquele evento aconteceu, não o total de sessões.
    consultar({
      dateRanges: janelas,
      metrics: [{ name: "eventCount" }, { name: "sessions" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
    }),
    consultar({
      dateRanges: [janelas[0]],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    }),
    consultar({
      dateRanges: [janelas[0]],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
  ]);

  return {
    usuariosAtivos: primeiro(nativas, 0),
    sessoes: primeiro(nativas, 1),
    sessoesAnterior: nativas[1]?.valores[1] ?? 0,
    cliquesWhatsapp: primeiro(whatsapp, 0),
    cliquesWhatsappAnterior: whatsapp[1]?.valores[0] ?? 0,
    sessoesComWhatsapp: primeiro(whatsapp, 1),
    serie: serie.map((l) => ({
      data: l.chaves[0],
      sessoes: l.valores[0],
      usuarios: l.valores[1],
    })),
    canais: canais.map((l) => ({ canal: l.chaves[0], sessoes: l.valores[0] })),
    geradoEm: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Página 2 — Ações comerciais (indicadores 1, 2, 4, 5, 14 e 6)
// ---------------------------------------------------------------------------

export type AcoesComerciais = {
  /** Os 4 botões "Agendar Avaliação", separados por onde ficam na página. */
  agendarPorPosicao: { posicao: string; cliques: number }[];
  /** Os 7 pontos de WhatsApp, sem recorte de CTA. */
  whatsappPorPosicao: { posicao: string; cliques: number }[];
  cliquesWhatsapp: number;
  /** Sinais de contexto. Não somam com o WhatsApp em nenhuma tela. */
  instagram: number;
  instagramPorPosicao: { posicao: string; cliques: number }[];
  endereco: number;
  grupoVip: number;
  /** Origem paga. `null` quando a leitura de custo não está disponível. */
  ads: {
    campanhas: {
      campanha: string;
      sessoes: number;
      acoes: number;
      custo: number | null;
    }[];
    /** Verdadeiro quando o Analytics não devolveu as métricas de custo. */
    custoIndisponivel: boolean;
  };
  geradoEm: string;
};

async function carregarAcoesComerciais(periodo: Periodo): Promise<AcoesComerciais> {
  const janela = [{ startDate: periodo.inicio, endDate: periodo.fim }];

  const [agendar, porPosicao, contexto, instagramPosicao, ads] = await Promise.all([
    // Indicador 1: só os cliques marcados como chamada à ação.
    consultar({
      dateRanges: janela,
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(
        igual("eventName", EVENTO.whatsapp),
        igual(DIMENSAO.ehCta, "sim"),
      ),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    // Indicador 2 aberto por posição: todos os pontos de WhatsApp.
    consultar({
      dateRanges: janela,
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    // Indicadores 2, 4, 5 e 14 numa consulta só, agrupados por evento.
    consultar({
      dateRanges: janela,
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: umDentre("eventName", [
        EVENTO.whatsapp,
        EVENTO.instagram,
        EVENTO.endereco,
        EVENTO.grupoVip,
      ]),
    }),
    consultar({
      dateRanges: janela,
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.instagram),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    carregarAds(periodo),
  ]);

  const porEvento = new Map(contexto.map((l) => [l.chaves[0], l.valores[0]]));

  return {
    agendarPorPosicao: agendar.map((l) => ({
      posicao: l.chaves[0],
      cliques: l.valores[0],
    })),
    whatsappPorPosicao: porPosicao.map((l) => ({
      posicao: l.chaves[0],
      cliques: l.valores[0],
    })),
    cliquesWhatsapp: porEvento.get(EVENTO.whatsapp) ?? 0,
    instagram: porEvento.get(EVENTO.instagram) ?? 0,
    instagramPorPosicao: instagramPosicao.map((l) => ({
      posicao: l.chaves[0],
      cliques: l.valores[0],
    })),
    endereco: porEvento.get(EVENTO.endereco) ?? 0,
    grupoVip: porEvento.get(EVENTO.grupoVip) ?? 0,
    ads,
    geradoEm: new Date().toISOString(),
  };
}

/**
 * Indicador 6 — ações vindas do Google Ads.
 *
 * O bloco **existe mesmo sem dado**: `08-matriz-do-dashboard.md` determina que
 * ele seja exibido com a mensagem de espera, nunca escondido e nunca preenchido
 * com estimativa. Em 2026-08-05 a conta está vinculada, mas nenhuma campanha
 * veicula — uma pausada, outra com os anúncios reprovados. A resposta legítima
 * desta consulta, hoje, é lista vazia.
 *
 * As métricas de custo só existem enquanto o vínculo com o Google Ads estiver
 * ativo. Se ele cair, a consulta passa a dar erro em vez de zero, e o painel
 * inteiro cairia junto. Por isso o custo é pedido numa tentativa separada.
 */
async function carregarAds(periodo: Periodo): Promise<AcoesComerciais["ads"]> {
  const janela = [{ startDate: periodo.inicio, endDate: periodo.fim }];
  // Origem paga na classificação nativa de canais. Cobre a marcação automática
  // do Google Ads, que está ativa na conta 304-199-5554.
  const origemPaga = umDentre("sessionDefaultChannelGroup", [
    "Paid Search",
    "Paid Shopping",
    "Paid Video",
    "Paid Social",
    "Paid Other",
    "Cross-network",
  ]);

  const [sessoes, acoes] = await Promise.all([
    consultar({
      dateRanges: janela,
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: origemPaga,
      limit: 25,
    }),
    consultar({
      dateRanges: janela,
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(origemPaga, igual("eventName", EVENTO.whatsapp)),
      limit: 25,
    }),
  ]);

  let custoPorCampanha = new Map<string, number>();
  let custoIndisponivel = false;

  try {
    const custos = await consultar({
      dateRanges: janela,
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: [{ name: "advertiserAdCost" }],
      dimensionFilter: origemPaga,
      limit: 25,
    });
    custoPorCampanha = new Map(custos.map((l) => [l.chaves[0], l.valores[0]]));
  } catch {
    // Métrica de custo indisponível: o vínculo com o Google Ads não está
    // devolvendo investimento. O bloco continua aparecendo, com as ações que
    // conhecemos e sem custo — inventar um valor aqui seria pior que omiti-lo.
    custoIndisponivel = true;
  }

  const acoesPorCampanha = new Map(acoes.map((l) => [l.chaves[0], l.valores[0]]));

  return {
    campanhas: sessoes.map((l) => ({
      campanha: l.chaves[0],
      sessoes: l.valores[0],
      acoes: acoesPorCampanha.get(l.chaves[0]) ?? 0,
      custo: custoIndisponivel ? null : (custoPorCampanha.get(l.chaves[0]) ?? 0),
    })),
    custoIndisponivel,
  };
}

// ---------------------------------------------------------------------------
// Página 3 — Interesse e público (indicadores 8, 9, 12 e 13)
// ---------------------------------------------------------------------------

export type InteresseEPublico = {
  procedimentos: { nome: string; cliques: number }[];
  areas: { nome: string; cliques: number }[];
  sessoes: number;
  sessoesComResultados: number;
  regioes: { cidade: string; estado: string; usuarios: number }[];
  /** Uma célula por combinação de dia da semana (0 = domingo) e hora. */
  horarios: { diaSemana: number; hora: number; sessoes: number }[];
  geradoEm: string;
};

async function carregarInteresse(periodo: Periodo): Promise<InteresseEPublico> {
  const janela = [{ startDate: periodo.inicio, endDate: periodo.fim }];

  const [procedimentos, areas, sessoes, resultados, regioes, horarios] =
    await Promise.all([
      // Indicador 8, metade dos procedimentos. O recorte por tipo não é
      // opcional: "Estética Regenerativa" é área E procedimento, e sem o tipo
      // as duas viram uma linha só — número errado, não número vazio.
      consultar({
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.nomeItem }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: e(
          igual("eventName", EVENTO.procedimento),
          igual(DIMENSAO.tipoItem, "procedimento"),
        ),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 20,
      }),
      consultar({
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.nomeItem }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: e(
          igual("eventName", EVENTO.procedimento),
          igual(DIMENSAO.tipoItem, "area"),
        ),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 10,
      }),
      consultar({ dateRanges: janela, metrics: [{ name: "sessions" }] }),
      // Indicador 9: sessões que chegaram à seção, sobre o total de sessões.
      consultar({
        dateRanges: janela,
        metrics: [{ name: "sessions" }],
        dimensionFilter: igual("eventName", EVENTO.resultados),
      }),
      consultar({
        dateRanges: janela,
        dimensions: [{ name: "city" }, { name: "region" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      consultar({
        dateRanges: janela,
        dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
        metrics: [{ name: "sessions" }],
        limit: 200,
      }),
    ]);

  return {
    procedimentos: procedimentos.map((l) => ({
      nome: l.chaves[0],
      cliques: l.valores[0],
    })),
    areas: areas.map((l) => ({ nome: l.chaves[0], cliques: l.valores[0] })),
    sessoes: primeiro(sessoes),
    sessoesComResultados: primeiro(resultados),
    regioes: regioes.map((l) => ({
      cidade: l.chaves[0],
      estado: l.chaves[1],
      usuarios: l.valores[0],
    })),
    horarios: horarios.map((l) => ({
      diaSemana: Number(l.chaves[0]),
      hora: Number(l.chaves[1]),
      sessoes: l.valores[0],
    })),
    geradoEm: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------
//
// A chave inclui o período: trocar a janela no seletor precisa buscar dado
// novo, não devolver o da janela anterior. `geradoEm` é gravado junto com o
// resultado, então o rodapé mostra quando a leitura foi feita de verdade — e
// não a hora em que a página foi aberta.

export function visaoGeral(periodo: Periodo): Promise<VisaoGeral> {
  return unstable_cache(
    () => carregarVisaoGeral(periodo),
    ["painel", "visao-geral", String(periodo.dias)],
    { revalidate: CACHE_SEGUNDOS },
  )();
}

export function acoesComerciais(periodo: Periodo): Promise<AcoesComerciais> {
  return unstable_cache(
    () => carregarAcoesComerciais(periodo),
    ["painel", "acoes-comerciais", String(periodo.dias)],
    { revalidate: CACHE_SEGUNDOS },
  )();
}

export function interesseEPublico(periodo: Periodo): Promise<InteresseEPublico> {
  return unstable_cache(
    () => carregarInteresse(periodo),
    ["painel", "interesse-publico", String(periodo.dias)],
    { revalidate: CACHE_SEGUNDOS },
  )();
}
