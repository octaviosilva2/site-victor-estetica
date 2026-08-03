# Site Dr. Victor Folster

Site institucional do Dr. Victor Folster — Farmacêutico Esteta, Jaraguá do Sul/SC.
Next.js 15 (App Router) + React 19 + TypeScript, hospedado na Vercel.

**Produção:** https://www.victorfolster.com.br

## Rodar localmente

```bash
npm install
npm run dev
```

## Estrutura

```
app/
  layout.tsx                    metadata base, fontes, JSON-LD do negócio
  page.tsx                      home (one-page)
  areas/[slug]/page.tsx         5 páginas de área de atuação
  procedimentos/[slug]/page.tsx 13 páginas de procedimento
  sitemap.ts · robots.ts        gerados a partir do conteúdo
  site.css                      CSS da prévia aprovada + bloco de ajustes no fim
components/                     seções da home e blocos compartilhados
lib/
  siteConfig.ts                 telefone, endereço, links — trocar SÓ aqui
  siteData.ts                   procedimentos e áreas (conteúdo aprovado)
  content.ts                    slugs e consultas sobre o conteúdo
  seo.ts                        dados estruturados (JSON-LD)
public/images/                  logos e fotos
```

## Como funciona a navegação (híbrido)

Na home, clicar numa área ou procedimento abre um overlay — sem sair da página,
igual à prévia aprovada. Ao mesmo tempo, cada um desses itens tem **URL própria**
(`/areas/arquitetura-facial`, `/procedimentos/rinomodelacao`), renderizada no
servidor com o conteúdo completo.

Os cards são links de verdade (`<a href>`) com o clique interceptado por JS. O
Google segue e indexa as 19 URLs; o visitante continua tendo a experiência fluida.

O conteúdo de cada detalhe vive num componente só — `ProcedureDetailBody` e
`CategoryDetailBody` — usado tanto no overlay quanto na página. Não existe risco
de o que o visitante lê divergir do que o Google indexa.

## Alterações comuns

| O que mudar | Onde |
|---|---|
| Telefone, endereço, Instagram, Google Maps | `lib/siteConfig.ts` |
| Texto de um procedimento ou área | `lib/siteData.ts` |
| Ligar o modal de captura de lead | `lib/siteConfig.ts` → `flags.welcomeModal` |
| Fotos antes/depois | `components/ResultsSection.tsx` + `CompareCard.tsx` |
| Estilo visual | `app/site.css` |

Ao adicionar um procedimento em `siteData.ts`, a página, o slug e a entrada no
sitemap são gerados automaticamente — não há nada a cadastrar manualmente.

## SEO implementado

- Metadata única por página (title, description, canonical, Open Graph)
- JSON-LD: `HealthAndBeautyBusiness`, `Person`, `MedicalProcedure`, `FAQPage`,
  `BreadcrumbList`, `MedicalWebPage`
- `sitemap.xml` e `robots.txt` gerados a partir do conteúdo
- Fontes self-hosted via `next/font` (sem request ao Google Fonts, sem layout shift)
- Imagens em AVIF/WebP via `next/image`
- Hierarquia de headings sem pular nível, `alt` em todas as imagens de conteúdo

## Pendências

- [ ] **Fotos antes/depois** — os 5 cards do carrossel estão com placeholder.
      As 3 fotos do site anterior estão no backup, em formato combinado
      (antes | depois na mesma imagem, com marca d'água).
- [ ] **Avaliações do Google** — a seção usa conteúdo de exemplo. Integração real
      exige Google Places API ou plugin (Elfsight/Trustindex).
- [ ] **Modal de captura de lead** — construído e desligado. Ligar só depois de
      definir para onde o lead vai (ver comentário em `components/WelcomeModal.tsx`).
- [ ] **Google Analytics / Search Console** — não configurados.
