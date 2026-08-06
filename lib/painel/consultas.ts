import { protos } from "@google-analytics/data";
import { unstable_cache } from "next/cache";

import { clienteGa4, propriedade, DIMENSAO, EVENTO } from "@/lib/ga4";
import { origem as origemDeNegocio } from "@/lib/painel/formato";
import type { Periodo } from "@/lib/painel/periodo";

// As consultas que alimentam os indicadores de `08-matriz-do-dashboard.md`.
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
 * O que a API respondeu além das linhas.
 *
 * `limiar` é o motivo de este tipo existir. A plataforma **omite linhas
 * inteiras** quando o recorte tem gente demais identificável e gente de menos
 * para proteger — e a omissão não vem como erro nem como linha vazia: vem como
 * uma lista mais curta do que a realidade. Quem soma as barras encontra menos
 * do que o total, e a conclusão natural é que o painel está errado.
 *
 * O sinal chega em `metadata.subjectToThresholding`. Sem lê-lo, a diferença
 * fica sem explicação na tela.
 */
type Resposta = {
  linhas: Linha[];
  /** Nomes das colunas de dimensão, na ordem devolvida pela API. */
  colunas: string[];
  /** A plataforma ocultou linhas desta consulta por limiar de privacidade. */
  limiar: boolean;
};

/**
 * Nome da coluna que a API acrescenta quando a consulta pede mais de um
 * intervalo de datas. Os valores são `date_range_0`, `date_range_1`, e assim
 * por diante, na ordem em que os intervalos foram declarados.
 */
const COLUNA_INTERVALO = "dateRange";

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

async function bruta(req: Omit<Requisicao, "property">): Promise<Resposta> {
  const [resposta] = await clienteGa4().runReport({
    ...req,
    property: propriedade(),
  });

  return {
    linhas: (resposta.rows ?? []).map((linha) => ({
      chaves: (linha.dimensionValues ?? []).map((d) => d.value ?? ""),
      valores: (linha.metricValues ?? []).map((m) => Number(m.value ?? 0)),
    })),
    colunas: (resposta.dimensionHeaders ?? []).map((c) => c.name ?? ""),
    limiar: Boolean(resposta.metadata?.subjectToThresholding),
  };
}

async function consultar(req: Omit<Requisicao, "property">): Promise<Linha[]> {
  return (await bruta(req)).linhas;
}

/**
 * Consulta as duas janelas de uma vez e separa as linhas por intervalo.
 *
 * **Por que isto não é `linhas[0]` e `linhas[1]`.** Com mais de um intervalo, a
 * API acrescenta sozinha a coluna `dateRange` e devolve uma linha por
 * intervalo. A ordem dessas linhas **não é garantida**: sem `orderBys`
 * explícito a plataforma ordena como quiser, e nada impede que o intervalo
 * anterior venha primeiro. Quem lê a linha 0 como "período atual" está
 * apostando numa ordem que a API nunca prometeu.
 *
 * O desfecho de perder essa aposta é o pior possível: o painel mostra os
 * números do período anterior no lugar do atual, com o rótulo do atual, sem
 * erro nenhum em lugar nenhum.
 *
 * **`dateRange` se lê, não se pede.** Listá-la em `dimensions` devolve
 * `INVALID_ARGUMENT: Field dateRange is not a dimension` e derruba a página
 * inteira. Ela entra sozinha no cabeçalho quando há mais de um intervalo, e é
 * de lá que sai o índice. Medido em produção em 2026-08-06, consultas A1 e A2
 * de EV-32.
 */
async function duasJanelas(
  periodo: Periodo,
  req: Omit<Requisicao, "property" | "dateRanges">,
): Promise<{ atual: Linha[]; anterior: Linha[]; limiar: boolean }> {
  const resposta = await bruta({
    ...req,
    dateRanges: [
      { startDate: periodo.inicio, endDate: periodo.fim },
      { startDate: periodo.inicioAnterior, endDate: periodo.fimAnterior },
    ],
  });

  // A posição da coluna vem do cabeçalho, não de uma suposição sobre onde a
  // API a colocou. Se um dia ela mudar de lugar, isto continua certo.
  const coluna = resposta.colunas.indexOf(COLUNA_INTERVALO);

  // Sem a coluna não há como saber qual linha é qual período. Falhar alto é
  // deliberado: o alternativo seria devolver duas listas vazias, e um painel
  // zerado é indistinguível de um mês sem visita nenhuma.
  if (coluna < 0) {
    throw new Error(
      `A resposta da Data API não trouxe a coluna ${COLUNA_INTERVALO}. ` +
        `Colunas recebidas: ${resposta.colunas.join(", ") || "nenhuma"}.`,
    );
  }

  const separar = (indice: number) =>
    resposta.linhas
      .filter((l) => l.chaves[coluna] === `date_range_${indice}`)
      // Fora a chave do intervalo: quem chama pediu as próprias dimensões e
      // espera encontrá-las na ordem em que as pediu.
      .map((l) => ({
        chaves: l.chaves.filter((_, i) => i !== coluna),
        valores: l.valores,
      }));

  return { atual: separar(0), anterior: separar(1), limiar: resposta.limiar };
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

/** A negação de um filtro. */
function nao(expressao: Filtro): Filtro {
  return { notExpression: expressao };
}

/** Primeiro valor de métrica da primeira linha, ou zero se não houver linha. */
function primeiro(linhas: Linha[], indice = 0): number {
  return linhas[0]?.valores[indice] ?? 0;
}

/** A janela do período, no formato que a Data API aceita. */
function janela(periodo: Periodo) {
  return [{ startDate: periodo.inicio, endDate: periodo.fim }];
}

/**
 * Origem paga na classificação nativa de canais.
 *
 * Cobre a marcação automática do Google Ads, que está ativa na conta
 * 304-199-5554. Vale para os indicadores 6 e 15 a 19.
 */
const ORIGEM_PAGA = umDentre("sessionDefaultChannelGroup", [
  "Paid Search",
  "Paid Shopping",
  "Paid Video",
  "Paid Social",
  "Paid Other",
  "Cross-network",
]);

// ---------------------------------------------------------------------------
// Página 1 — Visão geral (indicadores 10, 2 e 7)
// ---------------------------------------------------------------------------

export type VisaoGeral = {
  usuariosAtivos: number;
  usuariosAtivosAnterior: number;
  sessoes: number;
  sessoesAnterior: number;
  cliquesWhatsapp: number;
  cliquesWhatsappAnterior: number;
  /** Sessões em que houve ao menos um clique no WhatsApp. Numerador da taxa. */
  sessoesComWhatsapp: number;
  sessoesComWhatsappAnterior: number;
  /** Série diária para o gráfico: data (AAAAMMDD) e sessões. */
  serie: { data: string; sessoes: number; usuarios: number }[];
  /** A mesma série na janela anterior, para o traço tracejado do gráfico. */
  serieAnterior: { data: string; sessoes: number }[];
  /** Origem das visitas em rótulo de negócio, do maior para o menor. */
  origens: { origem: string; sessoes: number }[];
  /** Os procedimentos mais clicados. A lista completa está na página 3. */
  topProcedimentos: { nome: string; cliques: number }[];
  topAreas: { nome: string; cliques: number }[];
  /** Total de `procedimento_click`, procedimentos e áreas somados. */
  cliquesEmCards: number;
  sessoesComResultados: number;
  /** Sinais de contexto. Nunca somam com o WhatsApp nem entre si. */
  instagram: number;
  endereco: number;
  grupoVip: number;
  geradoEm: string;
};

async function carregarVisaoGeral(periodo: Periodo): Promise<VisaoGeral> {
  const [
    nativas,
    whatsapp,
    serie,
    serieAnterior,
    origens,
    procedimentos,
    areas,
    cards,
    resultados,
    contexto,
  ] = await Promise.all([
    // Usuários ativos e sessões nas duas janelas, cada linha identificada pelo
    // intervalo a que pertence.
    duasJanelas(periodo, {
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    }),
    // O indicador principal do contrato, e a base da taxa de ações
    // importantes: `sessions` sob filtro de evento devolve as sessões em que
    // aquele evento aconteceu, não o total de sessões.
    duasJanelas(periodo, {
      metrics: [{ name: "eventCount" }, { name: "sessions" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
    }),
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    }),
    // A janela anterior, dia a dia. Pedida separadamente, e não como segundo
    // `dateRange` da consulta acima: com dois intervalos E a dimensão de data,
    // a resposta mistura os dois períodos numa lista só e a separação depende
    // da coluna `dateRange` — que resolve o problema mas dobra o custo de
    // leitura de cada linha. Duas consultas simples são mais fáceis de ler e
    // de conferir do que uma difícil.
    consultar({
      dateRanges: [{ startDate: periodo.inicioAnterior, endDate: periodo.fimAnterior }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    }),
    // Indicador 7, com o cálculo revisado (R1 de 06/08): origem e meio, em vez
    // da dimensão nativa de canal. É o que separa Instagram de Facebook, que a
    // classificação padrão junta em "Organic Social".
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 50,
    }),
    // Indicador 8, reapresentado: aqui só os três primeiros aparecem na tela.
    // A lista completa fica na página 3 — reapresentar não cria indicador.
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: DIMENSAO.nomeItem }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(
        igual("eventName", EVENTO.procedimento),
        igual(DIMENSAO.tipoItem, "procedimento"),
      ),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 5,
    }),
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: DIMENSAO.nomeItem }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(
        igual("eventName", EVENTO.procedimento),
        igual(DIMENSAO.tipoItem, "area"),
      ),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 5,
    }),
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.procedimento),
    }),
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "sessions" }],
      dimensionFilter: igual("eventName", EVENTO.resultados),
    }),
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: umDentre("eventName", [
        EVENTO.instagram,
        EVENTO.endereco,
        EVENTO.grupoVip,
      ]),
    }),
  ]);

  const porEvento = new Map(contexto.map((l) => [l.chaves[0], l.valores[0]]));

  return {
    usuariosAtivos: primeiro(nativas.atual, 0),
    usuariosAtivosAnterior: primeiro(nativas.anterior, 0),
    sessoes: primeiro(nativas.atual, 1),
    sessoesAnterior: primeiro(nativas.anterior, 1),
    cliquesWhatsapp: primeiro(whatsapp.atual, 0),
    cliquesWhatsappAnterior: primeiro(whatsapp.anterior, 0),
    sessoesComWhatsapp: primeiro(whatsapp.atual, 1),
    sessoesComWhatsappAnterior: primeiro(whatsapp.anterior, 1),
    serie: serie.map((l) => ({
      data: l.chaves[0],
      sessoes: l.valores[0],
      usuarios: l.valores[1],
    })),
    serieAnterior: serieAnterior.map((l) => ({
      data: l.chaves[0],
      sessoes: l.valores[0],
    })),
    origens: agruparOrigens(origens),
    topProcedimentos: procedimentos.map((l) => ({
      nome: l.chaves[0],
      cliques: l.valores[0],
    })),
    topAreas: areas.map((l) => ({ nome: l.chaves[0], cliques: l.valores[0] })),
    cliquesEmCards: primeiro(cards),
    sessoesComResultados: primeiro(resultados),
    instagram: porEvento.get(EVENTO.instagram) ?? 0,
    endereco: porEvento.get(EVENTO.endereco) ?? 0,
    grupoVip: porEvento.get(EVENTO.grupoVip) ?? 0,
    geradoEm: new Date().toISOString(),
  };
}

/**
 * Junta as linhas de origem e meio nos rótulos de negócio.
 *
 * A API devolve uma linha por par origem/meio, e vários pares caem no mesmo
 * rótulo: `instagram.com / referral` e `l.instagram.com / referral` são os dois
 * Instagram. Somar aqui, no servidor, é o que faz a rosca ter cinco fatias
 * legíveis em vez de vinte.
 */
function agruparOrigens(linhas: Linha[]): { origem: string; sessoes: number }[] {
  const soma = new Map<string, number>();

  for (const linha of linhas) {
    const rotulo = origemDeNegocio(linha.chaves[0], linha.chaves[1]);
    soma.set(rotulo, (soma.get(rotulo) ?? 0) + linha.valores[0]);
  }

  return [...soma.entries()]
    .map(([origem, sessoes]) => ({ origem, sessoes }))
    .sort((a, b) => b.sessoes - a.sessoes);
}

// ---------------------------------------------------------------------------
// Página 2 — Ações comerciais (indicadores 1, 2, 4, 5 e 14)
// ---------------------------------------------------------------------------

export type AcoesComerciais = {
  /** Os 4 botões "Agendar Avaliação", separados por onde ficam na página. */
  agendarPorPosicao: { posicao: string; cliques: number }[];
  /** Total dos cliques marcados como chamada à ação, para conferir a soma. */
  totalAgendar: number;
  /** Os 7 pontos de WhatsApp, sem recorte de CTA. */
  whatsappPorPosicao: { posicao: string; cliques: number }[];
  cliquesWhatsapp: number;
  /** Sinais de contexto. Não somam com o WhatsApp em nenhuma tela. */
  instagram: number;
  instagramPorPosicao: { posicao: string; cliques: number }[];
  endereco: number;
  grupoVip: number;
  /** Etapas do funil. Todas reapresentam indicadores que já existem. */
  sessoes: number;
  cliquesEmCards: number;
  sessoesComResultados: number;
  sessoesComWhatsapp: number;
  /** Onde a conversa começa, por origem da visita. */
  acoesPorOrigem: { origem: string; cliques: number }[];
  geradoEm: string;
};

async function carregarAcoesComerciais(periodo: Periodo): Promise<AcoesComerciais> {
  const [
    agendar,
    cta,
    porPosicao,
    contexto,
    instagramPosicao,
    sessoes,
    cards,
    resultados,
    sessoesWhats,
    porOrigem,
  ] = await Promise.all([
    // Indicador 1: só os cliques marcados como chamada à ação.
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(
        igual("eventName", EVENTO.whatsapp),
        igual(DIMENSAO.ehCta, "sim"),
      ),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    // O mesmo recorte sem abrir por posição. Existe para a regra 7: é o total
    // contra o qual a soma das barras é conferida.
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "eventCount" }],
      dimensionFilter: e(
        igual("eventName", EVENTO.whatsapp),
        igual(DIMENSAO.ehCta, "sim"),
      ),
    }),
    // Indicador 2 aberto por posição: todos os pontos de WhatsApp.
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    // Indicadores 2, 4, 5 e 14 numa consulta só, agrupados por evento.
    consultar({
      dateRanges: janela(periodo),
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
      dateRanges: janela(periodo),
      dimensions: [{ name: DIMENSAO.posicao }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.instagram),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
    }),
    // As quatro consultas abaixo alimentam o funil. Nenhuma delas calcula nada
    // novo: são os indicadores 11, 8, 9 e 2 pedidos de novo, para poderem ser
    // exibidos lado a lado.
    consultar({ dateRanges: janela(periodo), metrics: [{ name: "sessions" }] }),
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.procedimento),
    }),
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "sessions" }],
      dimensionFilter: igual("eventName", EVENTO.resultados),
    }),
    consultar({
      dateRanges: janela(periodo),
      metrics: [{ name: "sessions" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
    }),
    consultar({
      dateRanges: janela(periodo),
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: igual("eventName", EVENTO.whatsapp),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 50,
    }),
  ]);

  const porEvento = new Map(contexto.map((l) => [l.chaves[0], l.valores[0]]));

  return {
    agendarPorPosicao: agendar.map((l) => ({
      posicao: l.chaves[0],
      cliques: l.valores[0],
    })),
    totalAgendar: primeiro(cta),
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
    sessoes: primeiro(sessoes),
    cliquesEmCards: primeiro(cards),
    sessoesComResultados: primeiro(resultados),
    sessoesComWhatsapp: primeiro(sessoesWhats),
    acoesPorOrigem: agruparOrigens(porOrigem).map((o) => ({
      origem: o.origem,
      cliques: o.sessoes,
    })),
    geradoEm: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Página 3 — Interesse e público (indicadores 8, 9, 12 e 13)
// ---------------------------------------------------------------------------

export type InteresseEPublico = {
  procedimentos: { nome: string; cliques: number }[];
  areas: { nome: string; cliques: number }[];
  /** Total de `procedimento_click`, para conferir a soma das duas listas. */
  totalProcedimentoClick: number;
  sessoes: number;
  sessoesComResultados: number;
  regioes: { cidade: string; estado: string; usuarios: number }[];
  /** Uma célula por combinação de dia da semana (0 = domingo) e hora. */
  horarios: { diaSemana: number; hora: number; sessoes: number }[];
  /** Indicador 7, lista completa. A rosca da visão geral mostra as maiores. */
  origens: { origem: string; sessoes: number }[];
  /** Celular, computador e tablet. */
  dispositivos: { nome: string; sessoes: number }[];
  geradoEm: string;
};

async function carregarInteresse(periodo: Periodo): Promise<InteresseEPublico> {
  const [
    procedimentos,
    areas,
    total,
    sessoes,
    resultados,
    regioes,
    horarios,
    origens,
    dispositivos,
  ] = await Promise.all([
      // Indicador 8, metade dos procedimentos. O recorte por tipo não é
      // opcional: "Estética Regenerativa" é área E procedimento, e sem o tipo
      // as duas viram uma linha só — número errado, não número vazio.
      consultar({
        dateRanges: janela(periodo),
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
        dateRanges: janela(periodo),
        dimensions: [{ name: DIMENSAO.nomeItem }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: e(
          igual("eventName", EVENTO.procedimento),
          igual(DIMENSAO.tipoItem, "area"),
        ),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 10,
      }),
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.procedimento),
      }),
      consultar({ dateRanges: janela(periodo), metrics: [{ name: "sessions" }] }),
      // Indicador 9: sessões que chegaram à seção, sobre o total de sessões.
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "sessions" }],
        dimensionFilter: igual("eventName", EVENTO.resultados),
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "city" }, { name: "region" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
        metrics: [{ name: "sessions" }],
        limit: 200,
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 50,
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 5,
      }),
    ]);

  return {
    procedimentos: procedimentos.map((l) => ({
      nome: l.chaves[0],
      cliques: l.valores[0],
    })),
    areas: areas.map((l) => ({ nome: l.chaves[0], cliques: l.valores[0] })),
    totalProcedimentoClick: primeiro(total),
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
    origens: agruparOrigens(origens),
    dispositivos: dispositivos.map((l) => ({
      nome: DISPOSITIVOS[l.chaves[0]] ?? l.chaves[0],
      sessoes: l.valores[0],
    })),
    geradoEm: new Date().toISOString(),
  };
}

/** Os três valores que a plataforma devolve em `deviceCategory`, em português. */
const DISPOSITIVOS: Record<string, string> = {
  mobile: "Celular",
  desktop: "Computador",
  tablet: "Tablet",
  smart_tv: "TV",
};

// ---------------------------------------------------------------------------
// Página 4 — Google Ads (indicadores 6, 15, 16, 17, 18 e 19)
// ---------------------------------------------------------------------------
//
// Entrou pelo aditivo A2, seção 13 de `05-escopo-contratado.md`.
//
// A página **existe mesmo sem dado**: a matriz determina que ela seja exibida
// com a mensagem de espera, nunca escondida e nunca preenchida com estimativa.
// Em 2026-08-06 a conta está vinculada, mas nenhuma campanha veicula — uma
// pausada, outra com os anúncios reprovados. A resposta legítima desta consulta,
// hoje, é tudo zerado.
//
// As métricas de investimento só existem enquanto o vínculo com o Google Ads
// estiver ativo. Se ele cair, elas passam a dar erro em vez de zero, e a página
// inteira cairia junto. Por isso vêm numa tentativa separada.

export type GoogleAds = {
  /** Sessões vindas de origem paga. */
  sessoes: number;
  /** Cliques no WhatsApp vindos de origem paga. Indicador 6. */
  acoes: number;
  /** Sessões pagas em que houve ao menos um clique no WhatsApp. */
  sessoesComAcao: number;
  /** Indicador 18: o mesmo par, para tudo o que não é origem paga. */
  naoPago: { sessoes: number; sessoesComAcao: number };
  /** Indicadores 15, 16 e 17. `null` quando a plataforma não devolve. */
  investimento: number | null;
  cliquesNoAnuncio: number | null;
  impressoes: number | null;
  custoPorClique: number | null;
  /** Verdadeiro quando o Analytics não devolveu as métricas de mídia. */
  custoIndisponivel: boolean;
  /** Indicador 19. */
  campanhas: {
    campanha: string;
    sessoes: number;
    acoes: number;
    custo: number | null;
  }[];
  geradoEm: string;
};

async function carregarGoogleAds(periodo: Periodo): Promise<GoogleAds> {
  const [pagas, acoesPagas, totais, acoesTotais, campanhas, acoesPorCampanha] =
    await Promise.all([
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "sessions" }],
        dimensionFilter: ORIGEM_PAGA,
      }),
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "eventCount" }, { name: "sessions" }],
        dimensionFilter: e(ORIGEM_PAGA, igual("eventName", EVENTO.whatsapp)),
      }),
      // O não pago sai por subtração? Não: `sessions` sob dois filtros
      // diferentes não se subtrai com segurança quando uma sessão pode mudar
      // de canal. Pedimos o complemento explicitamente.
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "sessions" }],
        dimensionFilter: nao(ORIGEM_PAGA),
      }),
      consultar({
        dateRanges: janela(periodo),
        metrics: [{ name: "sessions" }],
        dimensionFilter: e(nao(ORIGEM_PAGA), igual("eventName", EVENTO.whatsapp)),
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: [{ name: "sessions" }],
        dimensionFilter: ORIGEM_PAGA,
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 25,
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: e(ORIGEM_PAGA, igual("eventName", EVENTO.whatsapp)),
        limit: 25,
      }),
    ]);

  let investimento: number | null = null;
  let cliquesNoAnuncio: number | null = null;
  let impressoes: number | null = null;
  let custoPorClique: number | null = null;
  let custoPorCampanha = new Map<string, number>();
  let custoIndisponivel = false;

  try {
    const [midia, midiaPorCampanha] = await Promise.all([
      // Só três métricas, e o custo por clique sai da divisão delas. A
      // plataforma tem uma métrica pronta para isso, mas cada nome a mais é
      // uma chance a mais de a consulta inteira ser recusada — e aqui uma
      // recusa apaga o investimento e os cliques junto.
      consultar({
        dateRanges: janela(periodo),
        metrics: [
          { name: "advertiserAdCost" },
          { name: "advertiserAdClicks" },
          { name: "advertiserAdImpressions" },
        ],
      }),
      consultar({
        dateRanges: janela(periodo),
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: [{ name: "advertiserAdCost" }],
        dimensionFilter: ORIGEM_PAGA,
        limit: 25,
      }),
    ]);

    investimento = primeiro(midia, 0);
    cliquesNoAnuncio = primeiro(midia, 1);
    impressoes = primeiro(midia, 2);
    custoPorClique =
      cliquesNoAnuncio > 0 ? investimento / cliquesNoAnuncio : null;
    custoPorCampanha = new Map(
      midiaPorCampanha.map((l) => [l.chaves[0], l.valores[0]]),
    );
  } catch {
    // Métricas de mídia indisponíveis: o vínculo com o Google Ads não está
    // devolvendo investimento. A página continua aparecendo, com o que
    // conhecemos e sem os valores — inventar um número aqui seria pior que
    // omiti-lo, e um zero diria "anunciou e não gastou".
    custoIndisponivel = true;
  }

  const acoesCampanha = new Map(
    acoesPorCampanha.map((l) => [l.chaves[0], l.valores[0]]),
  );

  return {
    sessoes: primeiro(pagas),
    acoes: primeiro(acoesPagas, 0),
    sessoesComAcao: primeiro(acoesPagas, 1),
    naoPago: {
      sessoes: primeiro(totais),
      sessoesComAcao: primeiro(acoesTotais),
    },
    investimento,
    cliquesNoAnuncio,
    impressoes,
    custoPorClique,
    custoIndisponivel,
    campanhas: campanhas.map((l) => ({
      campanha: l.chaves[0],
      sessoes: l.valores[0],
      acoes: acoesCampanha.get(l.chaves[0]) ?? 0,
      custo: custoIndisponivel ? null : (custoPorCampanha.get(l.chaves[0]) ?? 0),
    })),
    geradoEm: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------
//
// A chave inclui as duas pontas do período, e não só o nome dele: "este mês"
// muda de conteúdo todo dia, e uma chave só com o nome serviria hoje o que foi
// lido ontem. `geradoEm` é gravado junto com o resultado, então o rodapé
// mostra quando a leitura foi feita de verdade — e não a hora em que a página
// foi aberta.

function chave(periodo: Periodo, nome: string): string[] {
  return ["painel", nome, periodo.chave, periodo.inicio, periodo.fim];
}

export function visaoGeral(periodo: Periodo): Promise<VisaoGeral> {
  return unstable_cache(() => carregarVisaoGeral(periodo), chave(periodo, "visao-geral"), {
    revalidate: CACHE_SEGUNDOS,
  })();
}

export function acoesComerciais(periodo: Periodo): Promise<AcoesComerciais> {
  return unstable_cache(() => carregarAcoesComerciais(periodo), chave(periodo, "acoes"), {
    revalidate: CACHE_SEGUNDOS,
  })();
}

export function interesseEPublico(periodo: Periodo): Promise<InteresseEPublico> {
  return unstable_cache(() => carregarInteresse(periodo), chave(periodo, "interesse"), {
    revalidate: CACHE_SEGUNDOS,
  })();
}

export function googleAds(periodo: Periodo): Promise<GoogleAds> {
  return unstable_cache(() => carregarGoogleAds(periodo), chave(periodo, "ads"), {
    revalidate: CACHE_SEGUNDOS,
  })();
}
