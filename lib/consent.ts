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
 */
export const CONSENT_VERSION = "1.0";

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

/** O que fica guardado no navegador. Registra data, versão e categoria. */
export type ConsentChoice = {
  /** Versão do texto que estava no ar quando a pessoa decidiu. */
  version: string;
  /** Categoria analytics: true = aceita, false = recusada. */
  analytics: boolean;
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
    if (typeof parsed?.analytics !== "boolean") return null;

    return {
      version: typeof parsed.version === "string" ? parsed.version : "",
      analytics: parsed.analytics,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
    };
  } catch {
    return null;
  }
}

/** Grava a escolha. Falha em silêncio se o navegador não deixar escrever. */
export function writeConsentChoice(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    version: CONSENT_VERSION,
    analytics,
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
