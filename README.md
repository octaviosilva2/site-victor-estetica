# Site Victor Estética

Landing page (one-page) para uma clínica de estética avançada, feita sob encomenda para um cliente real e vendida como serviço.

**[Read in English](#english) · [Português](#português)**

---

## Português

### O que é

Site institucional para o Dr. Victor Folster (Instituto Gaya, Jaraguá do Sul – SC), com apresentação do profissional, método de trabalho, lista de procedimentos e um botão de WhatsApp para agendamento — o objetivo do site é gerar contato direto com o consultório, não vender online.

### Contexto

Projeto vendido e entregue a um cliente real. Foi construído no [Lovable](https://lovable.dev) (geração de UI via IA a partir de prompt) e depois ajustado manualmente — não é um projeto de arquitetura complexa, e o SEO ficou abaixo do ideal (meta tags básicas, sem otimização de conteúdo). Está aqui no portfólio como prova de que um projeto de cliente real foi vendido e entregue de ponta a ponta, não como destaque técnico.

### Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router
- Vitest (testes)

### Como rodar localmente

```sh
npm install
npm run dev
```

Build de produção:

```sh
npm run build
```

### Configuração

**Conteúdo.** Textos, contato e links ficam em `src/lib/siteConfig.ts`. Os 12 procedimentos
(descrição, cards de info, benefícios, passo a passo e FAQ) ficam em `src/lib/procedures.ts`.

**Avaliações do Google.** A seção "O que dizem no Google" puxa avaliações reais via
Places API (New). Copie `.env.example` para `.env` e preencha `VITE_GOOGLE_PLACES_API_KEY`
e `VITE_GOOGLE_PLACE_ID` (o passo a passo está no próprio `.env.example`).
Sem essas variáveis a seção **não aparece** no site publicado — de propósito: avaliação de
exemplo assinada por "paciente" fictício seria enganosa para quem lê. Em desenvolvimento
aparece um aviso no lugar, explicando o que falta configurar.

Os termos da Places API não permitem editar nem filtrar avaliações por nota, e exigem exibir
o nome do autor e a data — é o que o componente faz.

**Textura dos botões.** Quando a textura do Canva chegar, salve em `public/button-texture.png`
e descomente o bloco `.btn-texture::before` em `src/index.css`: ela entra em todos os botões
de uma vez.

**E-mail de contato.** `contact.email` está vazio em `siteConfig.ts`. Ao preencher, a linha
de e-mail aparece sozinha no bloco de contato.

### SEO

O site é uma SPA, mas o `npm run build` **pré-renderiza HTML estático** para cada rota
(`scripts/prerender.mjs`, via `react-dom/server`). São 13 páginas: a home e uma por
procedimento, em `/procedimentos/<slug>`. Cada uma sai do build com `title`, `description`,
canonical, Open Graph e JSON-LD já no código-fonte — o que importa porque as prévias de link
do WhatsApp e do Instagram não executam JavaScript.

Etapas do build:

```sh
vite build                  # bundle do cliente
vite build --ssr …          # bundle de renderização (dist-ssr, não é publicado)
node scripts/prerender.mjs  # 13 HTMLs + 404.html + sitemap.xml
```

Se o host servir sempre o `index.html` (fallback de SPA), os arquivos pré-renderizados são
ignorados e o site funciona como antes — a degradação é segura. Para gerar só o bundle sem
pré-renderizar: `npm run build:spa`.

Onde mexer:

- **`src/lib/seo.ts`** — domínio, cidade-alvo, títulos, descrições e todo o JSON-LD
  (`HealthAndBeautyBusiness`, `Person`, `Service`, `FAQPage`, `BreadcrumbList`). É a fonte
  única: o mesmo módulo alimenta o prerender e o componente `<Seo>`, que atualiza o `<head>`
  na navegação entre rotas.
- **`src/lib/procedures.ts`** — adicionar um procedimento aqui cria a página, entra no
  sitemap e ganha dados estruturados automaticamente.

Pendências de SEO que dependem de informação ou de arquivo do cliente:

- **Horário de atendimento** — `contact.openingHours` em `siteConfig.ts` está vazio. O Google
  usa isso no resultado de busca e no mapa ("aberto agora"); ao preencher, entra no JSON-LD
  sozinho.
- **Imagens pesadas** — `logo-victor.png` tem 269 KB para ser exibida com 28 px de altura, e
  o `favicon.ico` tem 262 KB. Reexportar a logo em ~64×80 WebP e o favicon em 32×32 derruba
  isso para poucos KB e melhora o LCP. As três fotos de antes/depois têm ~380 KB cada
  (carregam sob demanda, então o impacto é menor).
- **Imagem de compartilhamento** — hoje o `og:image` usa a foto do perfil. Uma imagem
  dedicada em 1200×630 aproveita melhor o espaço do cartão de link.
- **Google Search Console** — cadastrar o domínio e enviar
  `https://victorfolster.com.br/sitemap.xml`.

### Licença

MIT — ver [LICENSE](LICENSE). O código é genérico (scaffold Lovable/shadcn); nenhum dado de negócio proprietário do cliente está no repositório além do conteúdo já público no site ao vivo (nome, procedimentos, contato).

---

## English

### What is this

Institutional one-page site for Dr. Victor Folster (Instituto Gaya, a Brazilian advanced aesthetics clinic), presenting the professional, his method, a list of procedures, and a floating WhatsApp button — the site's goal is to generate direct contact with the clinic, not to sell online. Note: Victor Folster is a licensed pharmacist specialising in aesthetics ("farmacêutico esteta"), not a physician — the site's copy is deliberately worded to keep that distinction clear.

### Context

A paid project sold to and delivered for a real client. Built with [Lovable](https://lovable.dev) (AI-generated UI from a prompt) and adjusted manually afterward — not an architecturally complex project, and SEO is below ideal (basic meta tags, no content optimization). It's included in this portfolio as evidence of selling and delivering a real client project end-to-end, not as a technical showcase.

### Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router
- Vitest (testing)

### Running locally

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

### Configuration

**Content.** Copy, contact details and links live in `src/lib/siteConfig.ts`. The 12 procedures
(description, info cards, benefits, step-by-step and FAQ) live in `src/lib/procedures.ts`.

**Google reviews.** The reviews section pulls real reviews through the Places API (New).
Copy `.env.example` to `.env` and fill in `VITE_GOOGLE_PLACES_API_KEY` and
`VITE_GOOGLE_PLACE_ID`. Without them the section **does not render** in production — by
design, since sample reviews credited to a fictional patient would mislead readers. A notice
explaining what's missing shows in development instead.

**Button texture.** Drop the texture at `public/button-texture.png` and uncomment the
`.btn-texture::before` block in `src/index.css` to apply it to every button at once.

### SEO

Although this is a SPA, `npm run build` **prerenders static HTML** for every route
(`scripts/prerender.mjs`, using `react-dom/server`): 13 pages — the homepage plus one per
procedure at `/procedimentos/<slug>` — each shipping its own `title`, `description`,
canonical, Open Graph tags and JSON-LD in the source. This matters because WhatsApp and
Instagram link previews don't execute JavaScript.

`src/lib/seo.ts` is the single source of truth for metadata and structured data
(`HealthAndBeautyBusiness`, `Person`, `Service`, `FAQPage`, `BreadcrumbList`); it feeds both
the prerender step and the client-side `<Seo>` component. Adding an entry to
`src/lib/procedures.ts` creates the page, adds it to `sitemap.xml` and generates its
structured data automatically.

If the host always serves `index.html` (SPA fallback), the prerendered files are ignored and
the site behaves as before — the degradation is safe. Use `npm run build:spa` to skip
prerendering.

### License

MIT — see [LICENSE](LICENSE). The code itself is generic (Lovable/shadcn scaffold); no proprietary business data beyond what's already public on the live site (name, procedures, contact info) is included in this repository.
