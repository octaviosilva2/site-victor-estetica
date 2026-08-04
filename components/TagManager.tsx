import Script from "next/script";

import { CONSENT_STORAGE_KEY } from "@/lib/consent";

// Identificador do container, sempre por variável de ambiente.
// Nunca escrever o ID direto no código — ele muda por ambiente e não deve
// viajar no repositório.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Sinal de consentimento padrão.
 *
 * Roda ANTES do container. Se essa ordem inverter, a primeira medição escapa
 * do bloqueio e o site coleta sem consentimento — que é exatamente o que a
 * implantação existe para impedir.
 *
 * Só a categoria analytics é negociada no banner. As categorias de anúncio
 * ficam negadas permanentemente nesta versão: não há conta de anúncios
 * conectada, e ligar marketing exigiria oferecer a escolha no banner antes.
 */
const consentDefaultScript = `
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  // Quem já decidiu numa visita anterior tem a escolha reaplicada aqui,
  // antes do container carregar. Sem isto, a visualização de página de
  // um visitante que já aceitou seria descartada a cada nova visita.
  try {
    var saved = window.localStorage.getItem('${CONSENT_STORAGE_KEY}');
    if (saved) {
      var choice = JSON.parse(saved);
      if (choice && choice.analytics === true) {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      }
    }
  } catch (error) {
    // Armazenamento bloqueado pelo navegador: mantém tudo negado.
  }
})();
`;

/** Snippet oficial do gerenciador de tags. */
const gtmLoaderScript = `
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${GTM_ID}');
`;

/**
 * Instala o gerenciador de tags com o consentimento já declarado.
 *
 * Sem NEXT_PUBLIC_GTM_ID definido, nada é injetado — o site fica idêntico ao
 * que era antes da instrumentação. É o que permite rodar o ambiente local sem
 * mandar dado de teste para a base do cliente.
 *
 * Não existe a versão <noscript> do container aqui, e isso é proposital:
 * sem JavaScript não há como registrar consentimento, e o iframe carregaria
 * a medição sem escolha nenhuma da pessoa.
 */
export default function TagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
      />
      <Script
        id="gtm-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: gtmLoaderScript }}
      />
    </>
  );
}
