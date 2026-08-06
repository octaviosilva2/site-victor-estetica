import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient, GoogleAuth } from "google-auth-library";

// Leitura da propriedade do Google Analytics do cliente.
//
// A corrente inteira, para quem vier depois: a função na Vercel recebe um token
// OIDC assinado pela Vercel; o Security Token Service do Google troca esse token
// por uma credencial federada; a credencial representa uma conta de serviço; e a
// conta de serviço tem papel de Leitor na propriedade. Nenhuma chave privada é
// gerada, guardada ou rotacionada — não existe segredo de longa duração aqui.
//
// Validado em produção em 2026-08-05, com `activeUsers` e `sessions` reais.

// O provedor no Google está em "Allowed audiences" com um único valor,
// https://vercel.com/octaviosilva2s-projects, que é justamente o `aud` que a
// Vercel emite sozinha no modo de equipe. Por isso `getVercelOidcToken()` é
// chamado SEM argumento: informar `{ audience }` faz a biblioteca trocar o
// token por outro, e o provedor recusa o token trocado com
// "The audience in ID Token does not match the expected audience".
// Foi esse o bloqueio de 2026-08-05. Não reintroduza o parâmetro sem antes
// conferir a lista de audiences aceitas do lado do Google.
function credencial() {
  const projectNumber = obrigatoria("GCP_PROJECT_NUMBER");
  const poolId = obrigatoria("GCP_WORKLOAD_IDENTITY_POOL_ID");
  const providerId = obrigatoria("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  const serviceAccount = obrigatoria("GCP_SERVICE_ACCOUNT_EMAIL");

  const authClient = ExternalAccountClient.fromJSON({
    type: "external_account",
    // Nome do recurso do provedor no Google — não confundir com o `aud` do
    // token OIDC. Trocar um pelo outro é o erro clássico desta integração.
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    subject_token_supplier: {
      // Em função da Vercel o token vem no cabeçalho x-vercel-oidc-token da
      // request; em build, na variável VERCEL_OIDC_TOKEN. A biblioteca resolve
      // os dois casos sozinha.
      getSubjectToken: () => getVercelOidcToken(),
    },
  });

  if (!authClient) {
    throw new Error(
      "ExternalAccountClient.fromJSON devolveu null — configuração de conta externa inválida.",
    );
  }

  // O cliente pede `cloud-platform` por padrão. A Data API exige o escopo de
  // leitura do Analytics; sem ele a chamada volta 403 sem dizer o motivo.
  authClient.scopes = ["https://www.googleapis.com/auth/analytics.readonly"];

  // Envelopado em GoogleAuth de propósito: `fromJSON` devolve a classe base
  // abstrata, e o cliente do GA4 exige um dos clientes concretos. Passar o
  // objeto direto não compila. Este é o caminho sem conversão forçada de tipo.
  return new GoogleAuth({ authClient });
}

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável de ambiente ausente: ${nome}`);
  }
  return valor;
}

// Uma instância por instância de função. Recriar o cliente a cada consulta
// refaria a troca de token no Security Token Service em toda chamada.
let clienteMemorizado: BetaAnalyticsDataClient | undefined;

export function clienteGa4(): BetaAnalyticsDataClient {
  clienteMemorizado ??= new BetaAnalyticsDataClient({ auth: credencial() });
  return clienteMemorizado;
}

export function propriedade(): string {
  return `properties/${obrigatoria("GA4_PROPERTY_ID")}`;
}

/**
 * Nomes das 5 dimensões personalizadas na Data API.
 *
 * O prefixo `customEvent:` é como a API se refere a uma dimensão de escopo de
 * evento; o que vem depois é o nome do PARÂMETRO registrado na propriedade, não
 * o nome de exibição da dimensão. Errar aqui não gera erro de compilação — gera
 * um painel de colunas vazias.
 */
export const DIMENSAO = {
  posicao: "customEvent:click_position",
  ehCta: "customEvent:is_cta",
  tipoItem: "customEvent:item_type",
  nomeItem: "customEvent:item_name",
  nomeProcedimento: "customEvent:procedure_name",
} as const;

/** Os 6 eventos personalizados do escopo contratado. */
export const EVENTO = {
  whatsapp: "whatsapp_click",
  instagram: "instagram_click",
  endereco: "endereco_click",
  procedimento: "procedimento_click",
  resultados: "resultados_view",
  grupoVip: "grupo_vip_click",
} as const;
