import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./App";
import { getPageSeo, indexableRoutes, renderSeoToHtml, SITE_URL } from "@/lib/seo";

/**
 * Entrada usada apenas no build (ver scripts/prerender.mjs). Gera o HTML
 * estático de cada rota, para que buscadores e prévias de link recebam
 * conteúdo real em vez de uma <div> vazia esperando JavaScript.
 */
export function render(url: string): { html: string; head: string } {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  );

  return { html, head: renderSeoToHtml(getPageSeo(url)) };
}

export { indexableRoutes, SITE_URL };
