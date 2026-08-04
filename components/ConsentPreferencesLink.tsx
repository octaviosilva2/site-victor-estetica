"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/**
 * Link permanente para rever a escolha de privacidade.
 *
 * Exigência da camada de consentimento: quem aceitou precisa conseguir
 * recusar depois, sem ter que limpar o navegador. Reabre o banner por evento
 * de janela, para não acoplar rodapé e banner num componente só.
 */
export default function ConsentPreferencesLink() {
  return (
    <button
      type="button"
      className="consent-prefs-link"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Preferências de privacidade
    </button>
  );
}
