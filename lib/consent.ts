// Fonte única de verdade da camada de consentimento.
//
// Tudo que o banner, o sinal de consentimento e o link de revisão precisam
// compartilhar mora aqui — chave de armazenamento, versão do texto e o nome
// do evento que reabre as preferências. Duplicar essas strings pelos
// componentes é o jeito mais fácil de quebrar a persistência sem perceber.

// O gerenciador de tags cria estes dois globais em tempo de execução.
// Sem a declaração, o TypeScript reprova qualquer uso deles.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Chave no localStorage onde a escolha do visitante fica guardada. */
export const CONSENT_STORAGE_KEY = "vf-consent";

/**
 * Versão do texto de consentimento.
 *
 * Subir esta versão faz o banner reaparecer para todo mundo, inclusive para
 * quem já tinha decidido. É o comportamento correto quando o texto da
 * política muda de forma relevante — a escolha anterior foi feita sobre
 * outro texto e não vale para o novo.
 *
 * 1.1 — decisão DT-2: aceitar passou a liberar também as categorias de
 * anúncio. Quem decidiu sobre a versão 1.0 concordou com um texto que
 * prometia medição e só medição, então essa escolha não vale aqui.
 */
export const CONSENT_VERSION = "1.1";

/**
 * Categorias do Consent Mode liberadas quando o visitante aceita.
 *
 * As três de anúncio entram por causa da conta Google Ads conectada: com
 * `ad_storage` negado, o identificador de clique do anúncio é redigido e a
 * origem paga chega ao relatório por estimativa, não por identificação. O
 * indicador 6 do escopo depende dessa leitura.
 *
 * Este objeto é a fonte única das categorias. O sinal de consentimento e o
 * banner leem daqui — declarar a lista duas vezes é como as duas pontas
 * saem de sincronia sem ninguém perceber.
 */
export const GRANTED_CONSENT = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
} as const;

/** As mesmas categorias, negadas. Usado ao recusar e ao revogar. */
export const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

/** Evento de janela que reabre o banner a partir do link de preferências. */
export const CONSENT_OPEN_EVENT = "vf:consent-open";

/**
 * Evento empurrado no dataLayer quando o visitante aceita a medição.
 *
 * O gerenciador de tags usa este evento como gatilho da configuração de
 * analytics. Sem ele, quem demora para decidir perde a visualização de
 * página inicial: o sinal de consentimento só espera 500ms pela resposta.
 */
export const CONSENT_GRANTED_DATALAYER_EVENT = "vf_consent_granted";

/** O que fica guardado no navegador. Registra data, versão e escolha. */
export type ConsentChoice = {
  /** Versão do texto que estava no ar quando a pessoa decidiu. */
  version: string;
  /**
   * Escolha única do banner: true libera todas as categorias de
   * `GRANTED_CONSENT`, false nega todas. O banner é aceitar ou recusar, sem
   * escolha por categoria — guardar um booleano por categoria seria registrar
   * uma granularidade que a interface não oferece.
   */
  granted: boolean;
  /** Momento da decisão, em ISO 8601. */
  decidedAt: string;
};

/**
 * Lê a escolha guardada.
 *
 * Devolve null quando não há escolha, quando o dado está corrompido ou
 * quando o navegador bloqueia o armazenamento (modo restrito, iframe de
 * terceiro). Em todos esses casos o certo é perguntar de novo, nunca
 * presumir consentimento.
 */
export function readConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (typeof parsed?.granted !== "boolean") return null;

    return {
      version: typeof parsed.version === "string" ? parsed.version : "",
      granted: parsed.granted,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
    };
  } catch {
    return null;
  }
}

/** Grava a escolha. Falha em silêncio se o navegador não deixar escrever. */
export function writeConsentChoice(granted: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    version: CONSENT_VERSION,
    granted,
    decidedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Sem armazenamento a escolha vale só para esta navegação. O banner
    // volta na próxima visita, que é o comportamento seguro.
  }

  return choice;
}
