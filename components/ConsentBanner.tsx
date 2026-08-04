"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  CONSENT_GRANTED_DATALAYER_EVENT,
  CONSENT_OPEN_EVENT,
  CONSENT_VERSION,
  readConsentChoice,
  writeConsentChoice,
} from "@/lib/consent";

/**
 * Atualiza o consentimento no gerenciador de tags.
 *
 * Usa a função `gtag` que o sinal de consentimento padrão registra no window.
 * Empurrar o comando direto no dataLayer como array comum não funciona: o
 * Consent Mode espera o objeto `arguments`, e um array é ignorado em
 * silêncio — falha das mais difíceis de enxergar nessa configuração.
 *
 * Só a categoria analytics muda. As de anúncio continuam negadas — não há
 * conta de anúncios conectada nesta versão, e oferecê-las no banner sem
 * usá-las seria pedir permissão para algo que não acontece.
 */
function updateConsent(analytics: boolean) {
  // Sem container instalado (ambiente local sem a variável de ambiente) não
  // há gtag. A escolha continua sendo gravada; só não há o que atualizar.
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
  });

  if (analytics) {
    // Gatilho da configuração de analytics no container. Quem demora para
    // decidir já perdeu a janela de 500ms do sinal padrão — este evento é o
    // que recupera a visualização de página dessa pessoa.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: CONSENT_GRANTED_DATALAYER_EVENT });
  }
}

/**
 * Banner de consentimento.
 *
 * Aceitar e recusar têm o mesmo peso visual — é exigência do protocolo de
 * privacidade, não preferência de design. Recusar não bloqueia nada: a
 * pessoa continua navegando igual, só não é medida.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = readConsentChoice();

    // Sem escolha, ou escolha feita sobre um texto antigo: pergunta de novo.
    if (!saved || saved.version !== CONSENT_VERSION) {
      setVisible(true);
    }
  }, []);

  // O link de preferências no rodapé reabre o banner por este evento.
  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    writeConsentChoice(analytics);
    updateConsent(analytics);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="consent-banner" role="region" aria-label="Aviso de privacidade">
      <div className="consent-banner-inner">
        <p className="consent-banner-text">
          Este site usa medição para entender como as páginas são usadas e melhorar o
          atendimento. Nada é coletado antes da sua escolha. Você pode mudar de ideia
          quando quiser.{" "}
          <Link href="/privacidade" className="consent-banner-link">
            Política de Privacidade
          </Link>
        </p>
        <div className="consent-banner-actions">
          <button type="button" className="consent-btn" onClick={() => decide(false)}>
            Recusar
          </button>
          <button type="button" className="consent-btn" onClick={() => decide(true)}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
