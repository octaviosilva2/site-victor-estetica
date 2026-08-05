import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient, GoogleAuth } from "google-auth-library";

// ENDPOINT TEMPORÁRIO DE DIAGNÓSTICO — APAGAR APÓS O TESTE.
//
// Existe só para provar a corrente de autenticação de ponta a ponta:
//   OIDC da Vercel → Security Token Service → Workload Identity Federation
//   → representação da conta de serviço → Google Analytics Data API
//
// Enquanto ele existir, há uma rota no domínio do cliente capaz de devolver
// métricas da propriedade dele. Por isso exige segredo e devolve 404 sem ele.

// Sem isto o Next pode pré-renderizar a rota durante o build. No build não
// existe request, e o token OIDC das funções chega no cabeçalho da request —
// a rota precisa ser dinâmica ou falha por token ausente.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const segredo = process.env.GA4_TEST_SECRET;
  const enviado = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  // 404 e não 401: 401 confirmaria a existência da rota para quem sondasse.
  if (!segredo || enviado !== segredo) {
    return new Response("Not Found", { status: 404 });
  }

  const projectNumber = process.env.GCP_PROJECT_NUMBER;
  const serviceAccount = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
  const poolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
  const providerId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const propertyId = process.env.GA4_PROPERTY_ID;

  const faltando = Object.entries({
    GCP_PROJECT_NUMBER: projectNumber,
    GCP_SERVICE_ACCOUNT_EMAIL: serviceAccount,
    GCP_WORKLOAD_IDENTITY_POOL_ID: poolId,
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: providerId,
    GA4_PROPERTY_ID: propertyId,
  })
    .filter(([, valor]) => !valor)
    .map(([nome]) => nome);

  if (faltando.length > 0) {
    return Response.json(
      { ok: false, etapa: "variaveis-de-ambiente", faltando },
      { status: 500 },
    );
  }

  try {
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      // Este `audience` é o nome do recurso do provedor no Google, e NÃO o
      // `aud` do token OIDC da Vercel. O `aud` do token é
      // https://vercel.com/octaviosilva2s-projects e está declarado do lado do
      // Google, em "Allowed audiences" — ele não aparece neste arquivo.
      // Trocar um pelo outro é o erro clássico desta integração.
      audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
      subject_token_supplier: {
        // Em função da Vercel o token vem no cabeçalho x-vercel-oidc-token da
        // request; em build, na variável VERCEL_OIDC_TOKEN. A biblioteca
        // resolve os dois casos.
        getSubjectToken: getVercelOidcToken,
      },
    });

    if (!authClient) {
      throw new Error(
        "ExternalAccountClient.fromJSON devolveu null — configuração de conta externa inválida.",
      );
    }

    // O cliente pede cloud-platform por padrão. A Data API exige o escopo de
    // leitura do Analytics; sem ele a chamada volta 403 sem dizer o motivo.
    authClient.scopes = ["https://www.googleapis.com/auth/analytics.readonly"];

    // Envelopado em GoogleAuth de propósito. `fromJSON` devolve a classe base
    // abstrata, e o cliente do GA4 exige um dos clientes concretos — passar o
    // objeto direto não compila. GoogleAuth aceita a base e é o caminho sem
    // conversão forçada de tipo.
    const analytics = new BetaAnalyticsDataClient({
      auth: new GoogleAuth({ authClient }),
    });

    const [relatorio] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    });

    const valores = relatorio.rows?.[0]?.metricValues ?? [];

    return Response.json({
      ok: true,
      propriedade: propertyId,
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
