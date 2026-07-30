// ============================================
// Pré-renderização estática + sitemap.xml
//
// Roda depois do `vite build`. Para cada rota indexável, renderiza o app com
// react-dom/server e grava um HTML completo — com <title>, description,
// canonical, Open Graph e JSON-LD já no código-fonte.
//
// Motivo: o site era uma SPA pura. O Google executa JavaScript, mas depender
// disso é desvantagem competitiva, e prévias de link no WhatsApp e no
// Instagram não executam JS nenhum — justamente por onde vêm os pacientes.
//
// Se o host servir sempre o index.html (fallback de SPA), estes arquivos são
// ignorados e o site continua funcionando como antes: a degradação é segura.
// ============================================

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const ssrEntry = join(root, "dist-ssr", "entry-server.js");

const { render, indexableRoutes, SITE_URL } = await import(ssrEntry);

const template = await readFile(join(distDir, "index.html"), "utf-8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html não contém <div id="root"></div> — o prerender não sabe onde injetar.');
}

/** Remove do template as tags que o prerender gera por rota, para não duplicar. */
function stripManagedTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");
}

const baseTemplate = stripManagedTags(template);

const routeToFile = (route) => (route === "/" ? "index.html" : join(route.slice(1), "index.html"));

const written = [];

for (const route of indexableRoutes) {
  const { html, head } = render(route);

  const page = baseTemplate
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outFile = join(distDir, routeToFile(route));
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, page, "utf-8");
  written.push(route);
}

// ---- 404.html ----
// Hosts estáticos (Netlify, Cloudflare Pages, GitHub Pages) servem este
// arquivo para rotas inexistentes. Sem ele o host devolve o HTML da home e o
// cliente troca para a tela de 404, gerando divergência na hidratação.
{
  const { html, head } = render("/404");
  const page = baseTemplate
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  await writeFile(join(distDir, "404.html"), page, "utf-8");
}

// ---- sitemap.xml ----
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexableRoutes.map((route) => {
    const loc = `${SITE_URL}${route === "/" ? "/" : route}`;
    // A home é o alvo principal; as páginas de procedimento vêm logo atrás.
    const priority = route === "/" ? "1.0" : "0.8";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }),
  "</urlset>",
].join("\n");

await writeFile(join(distDir, "sitemap.xml"), `${sitemap}\n`, "utf-8");

console.log(`prerender: ${written.length} páginas estáticas + sitemap.xml`);
for (const route of written) console.log(`  ${route}`);
