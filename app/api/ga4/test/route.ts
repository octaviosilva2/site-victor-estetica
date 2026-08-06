import { clienteGa4, propriedade, DIMENSAO, EVENTO } from "@/lib/ga4";

// ENDPOINT TEMPORÁRIO DE DIAGNÓSTICO — APAGAR APÓS O TESTE.
//
// Enquanto ele existir, há uma rota no domínio do cliente capaz de devolver
// métricas da propriedade dele. Por isso exige segredo e devolve 404 sem ele.
//
// A corrente de autenticação em si já vive em `lib/ga4.ts` e é a mesma que o
// painel vai usar — este arquivo só a exercita e mostra o resultado.

// Sem isto o Next pode pré-renderizar a rota durante o build. No build não
// existe request, e o token OIDC das funções chega no cabeçalho da request —
// a rota precisa ser dinâmica ou falha por token ausente.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PERIODO = [{ startDate: "28daysAgo", endDate: "today" }];

/** Filtro por nome de evento, o recorte de toda consulta do painel. */
function porEvento(nome: string) {
  return { filter: { fieldName: "eventName", stringFilter: { value: nome } } };
}

/**
 * Roda uma consulta e devolve as linhas em forma legível, ou a mensagem de erro
 * daquela consulta específica. Cada uma é isolada de propósito: se um nome de
 * dimensão estiver errado, o objetivo é saber QUAL, e não perder as outras
 * junto numa exceção só.
 */
async function consultar(
  rotulo: string,
  dimensoes: string[],
  filtro?: ReturnType<typeof porEvento>,
) {
  try {
    const [relatorio] = await clienteGa4().runReport({
      property: propriedade(),
      dateRanges: PERIODO,
      dimensions: dimensoes.map((name) => ({ name })),
      metrics: [{ name: "eventCount" }],
      dimensionFilter: filtro,
      limit: 50,
    });

    return {
      rotulo,
      dimensoes,
      ok: true,
      linhas: (relatorio.rows ?? []).map((linha) => ({
        valores: (linha.dimensionValues ?? []).map((v) => v.value),
        contagem: linha.metricValues?.[0]?.value,
      })),
    };
  } catch (erro) {
    return {
      rotulo,
      dimensoes,
      ok: false,
      erro: erro instanceof Error ? erro.message : String(erro),
    };
  }
}

export async function GET(request: Request) {
  const segredo = process.env.GA4_TEST_SECRET;
  const enviado = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  // 404 e não 401: 401 confirmaria a existência da rota para quem sondasse.
  if (!segredo || enviado !== segredo) {
    return new Response("Not Found", { status: 404 });
  }

  const consulta = new URL(request.url).searchParams.get("consulta");

  try {
    // ?consulta=dimensoes prova que os nomes das 5 dimensões personalizadas
    // são os que a Data API aceita. Um nome errado aqui não quebra build nem
    // teste — só devolve coluna vazia no painel, meses depois.
    if (consulta === "dimensoes") {
      return Response.json({
        ok: true,
        etapa: "dimensoes-personalizadas",
        periodo: "ultimos-28-dias",
        resultados: await Promise.all([
          consultar("eventos recebidos", ["eventName"]),
          consultar(
            "whatsapp por posicao e cta",
            [DIMENSAO.posicao, DIMENSAO.ehCta],
            porEvento(EVENTO.whatsapp),
          ),
          consultar(
            "procedimento por nome e tipo",
            [DIMENSAO.nomeItem, DIMENSAO.tipoItem],
            porEvento(EVENTO.procedimento),
          ),
          consultar(
            "whatsapp com nome do procedimento",
            [DIMENSAO.nomeProcedimento],
            porEvento(EVENTO.whatsapp),
          ),
        ]),
      });
    }

    const [relatorio] = await clienteGa4().runReport({
      property: propriedade(),
      dateRanges: PERIODO,
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    });

    const valores = relatorio.rows?.[0]?.metricValues ?? [];

    return Response.json({
      ok: true,
      periodo: "ultimos-28-dias",
      usuariosAtivos: valores[0]?.value ?? null,
      sessoes: valores[1]?.value ?? null,
      linhasRetornadas: relatorio.rowCount ?? 0,
    });
  } catch (erro) {
    // A mensagem de erro só é devolvida porque a rota exige o segredo. Nada
    // disto pode sobreviver numa rota sem autenticação.
    return Response.json(
      {
        ok: false,
        etapa: "autenticacao-ou-consulta",
        erro: erro instanceof Error ? erro.message : String(erro),
      },
      { status: 500 },
    );
  }
}
