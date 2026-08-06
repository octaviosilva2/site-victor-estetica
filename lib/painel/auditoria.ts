import { protos } from "@google-analytics/data";

import { clienteGa4, propriedade, DIMENSAO, EVENTO } from "@/lib/ga4";

// ARQUIVO TEMPORÁRIO — DIAGNÓSTICO, NÃO É PRODUTO.
//
// Existe para responder uma pergunta e ser apagado depois: **por que o total de
// um evento não bate com a soma do mesmo evento aberto por posição?** Observado
// no painel em 2026-08-06: "Total de 11" com as barras somando 8; Instagram com
// 7 no cartão e 4 nas barras; e a soma dos canais maior que o total de sessões.
//
// Enquanto a causa não estiver medida, qualquer conserto seria maquiagem. As
// duas hipóteses em aberto:
//
//   (a) as dimensões personalizadas foram registradas em 2026-08-04 e não valem
//       para eventos anteriores — nesse caso as linhas faltantes existem e vêm
//       como `(not set)`, e a soma fecha;
//   (b) a plataforma omite linhas inteiras pelo limiar de privacidade ao cruzar
//       dimensão de escopo de evento em volume baixo — nesse caso a soma NÃO
//       fecha, e `subjectToThresholding` vem verdadeiro na resposta.
//
// As duas produzem exatamente o mesmo sintoma na tela e pedem textos diferentes
// no painel. Só a resposta bruta da API separa uma da outra.
//
// Este arquivo não é lido por nenhuma página do produto. Ele e
// `app/(painel)/painel/auditoria/page.tsx` saem juntos quando a evidência
// estiver registrada em `13-evidencias.md`.

type Requisicao = protos.google.analytics.data.v1beta.IRunReportRequest;

export type Consulta = {
  titulo: string;
  /** O que esta consulta prova, ou distingue de qual outra. */
  proposito: string;
  /** Nomes das colunas de dimensão como a API as devolveu. */
  colunas: string[];
  linhas: { chaves: string[]; valores: number[] }[];
  /** Soma da primeira métrica em todas as linhas. */
  soma: number;
  /** `metadata.subjectToThresholding` — a plataforma ocultou linhas. */
  limiar: boolean;
  /** Total de linhas que existem no relatório, além das devolvidas. */
  totalDeLinhas: number | null;
  erro: string | null;
};

async function rodar(
  titulo: string,
  proposito: string,
  req: Omit<Requisicao, "property">,
): Promise<Consulta> {
  const base: Consulta = {
    titulo,
    proposito,
    colunas: [],
    linhas: [],
    soma: 0,
    limiar: false,
    totalDeLinhas: null,
    erro: null,
  };

  try {
    const [r] = await clienteGa4().runReport({ ...req, property: propriedade() });
    const linhas = (r.rows ?? []).map((l) => ({
      chaves: (l.dimensionValues ?? []).map((d) => d.value ?? ""),
      valores: (l.metricValues ?? []).map((m) => Number(m.value ?? 0)),
    }));

    return {
      ...base,
      colunas: (r.dimensionHeaders ?? []).map((c) => c.name ?? ""),
      linhas,
      soma: linhas.reduce((total, l) => total + (l.valores[0] ?? 0), 0),
      limiar: Boolean(r.metadata?.subjectToThresholding),
      totalDeLinhas: r.rowCount ?? null,
    };
  } catch (erro) {
    // Uma consulta que falha não pode derrubar as outras: metade da evidência
    // ainda é evidência.
    return { ...base, erro: erro instanceof Error ? erro.message : String(erro) };
  }
}

function igual(campo: string, valor: string): protos.google.analytics.data.v1beta.IFilterExpression {
  return {
    filter: {
      fieldName: campo,
      stringFilter: { value: valor, matchType: "EXACT" },
    },
  };
}

/**
 * Roda o conjunto de consultas de reconciliação para uma janela de N dias.
 *
 * Sem cache de propósito: `unstable_cache` guardaria a resposta por 12 horas e
 * a auditoria passaria a medir o cache em vez da API.
 */
export async function auditar(dias: number): Promise<Consulta[]> {
  const janela = [{ startDate: `${dias}daysAgo`, endDate: "today" }];
  const duas = [
    { startDate: `${dias}daysAgo`, endDate: "today" },
    { startDate: `${dias * 2}daysAgo`, endDate: `${dias + 1}daysAgo` },
  ];

  return Promise.all([
    // --- A ordem dos dois intervalos ---------------------------------------
    rodar(
      "A1 · duas janelas, SEM pedir a dimensão do intervalo",
      "É exatamente o que o painel fazia. Se a linha 0 for date_range_1, o painel mostrava o período anterior como se fosse o atual.",
      { dateRanges: duas, metrics: [{ name: "activeUsers" }, { name: "sessions" }] },
    ),
    rodar(
      "A2 · duas janelas, PEDINDO a dimensão do intervalo",
      "A mesma consulta com cada linha identificada. Comparar a ordem com A1 responde se a aposta na linha 0 estava certa ou errada.",
      {
        dateRanges: duas,
        dimensions: [{ name: "dateRange" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      },
    ),

    // --- Sessões contra canais ---------------------------------------------
    rodar(
      "B1 · sessões e usuários, uma janela só",
      "O total de sessões do período atual, sem ambiguidade de intervalo.",
      { dateRanges: janela, metrics: [{ name: "sessions" }, { name: "activeUsers" }] },
    ),
    rodar(
      "B2 · sessões por canal, mesma janela",
      "A soma daqui tem de bater com B1: canal é dimensão de sessão. Se não bater, sobra limiar de privacidade.",
      {
        dateRanges: janela,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        limit: 25,
      },
    ),

    // --- WhatsApp: total contra aberto por posição -------------------------
    rodar(
      "C1 · whatsapp_click, total",
      "O número do cartão. Nenhuma dimensão personalizada envolvida.",
      {
        dateRanges: janela,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
      },
    ),
    rodar(
      "C2 · whatsapp_click por click_position",
      "O número das barras. A diferença para C1 é o que precisa de explicação.",
      {
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.posicao }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
        limit: 50,
      },
    ),
    rodar(
      "C3 · o mesmo, com keepEmptyRows",
      "Se a linha faltante for `(not set)` suprimida por ser vazia, ela aparece aqui e a hipótese (a) vence.",
      {
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.posicao }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
        keepEmptyRows: true,
        limit: 50,
      },
    ),
    rodar(
      "C4 · whatsapp_click por dia e posição",
      "Mostra a partir de que data a dimensão passou a vir preenchida. É o teste direto da hipótese (a): registro em 04/08.",
      {
        dateRanges: janela,
        dimensions: [{ name: "date" }, { name: DIMENSAO.posicao }],
        metrics: [{ name: "eventCount" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
        limit: 300,
      },
    ),
    rodar(
      "C5 · whatsapp_click por dia, sem dimensão personalizada",
      "O par de C4. A diferença dia a dia diz em que dias os eventos perderam a posição.",
      {
        dateRanges: janela,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "eventCount" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
        limit: 300,
      },
    ),
    rodar(
      "C6 · whatsapp_click por is_cta",
      "Segunda dimensão personalizada sobre o mesmo evento. Se ela fechar e a posição não, o problema é da posição, não das dimensões em geral.",
      {
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.ehCta }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.whatsapp),
        limit: 50,
      },
    ),

    // --- Instagram: o mesmo par --------------------------------------------
    rodar(
      "D1 · instagram_click, total",
      "O número do cartão de contexto.",
      {
        dateRanges: janela,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.instagram),
      },
    ),
    rodar(
      "D2 · instagram_click por click_position",
      "O número das barras de contexto. Mesma diferença observada no WhatsApp.",
      {
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.posicao }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.instagram),
        limit: 50,
      },
    ),
    rodar(
      "D3 · instagram_click por dia e posição",
      "O equivalente de C4 para o Instagram.",
      {
        dateRanges: janela,
        dimensions: [{ name: "date" }, { name: DIMENSAO.posicao }],
        metrics: [{ name: "eventCount" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        dimensionFilter: igual("eventName", EVENTO.instagram),
        limit: 300,
      },
    ),

    // --- Panorama -----------------------------------------------------------
    rodar(
      "E1 · todos os eventos do período",
      "O volume real com que estamos lidando. Volume baixo é o que aciona o limiar de privacidade.",
      {
        dateRanges: janela,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "sessions" }],
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 50,
      },
    ),
    rodar(
      "E2 · procedimento_click por item_name e item_type",
      "A página 3 depende deste cruzamento. Se ele também perder linhas, o problema atravessa o painel inteiro.",
      {
        dateRanges: janela,
        dimensions: [{ name: DIMENSAO.nomeItem }, { name: DIMENSAO.tipoItem }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: igual("eventName", EVENTO.procedimento),
        limit: 50,
      },
    ),
    rodar(
      "E3 · sessões por dia",
      "Distribuição do tráfego na janela, para saber se o período tem dado suficiente para qualquer conclusão.",
      {
        dateRanges: janela,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: 100,
      },
    ),
  ]);
}
