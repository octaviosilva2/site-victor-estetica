# CLAUDE.md — Site Dr. Victor Folster

> **Leia este arquivo inteiro antes de alterar qualquer coisa neste repositório.**
>
> Este site tem uma camada de medição instalada e validada, em produção desde
> 2026-08-05. Ela alimenta um painel que o cliente pagou para receber.
>
> O ponto que torna este arquivo necessário: **quebrar a medição não gera erro.**
> O build passa, o TypeScript passa, a página abre igual, ninguém vê nada
> estranho. O indicador simplesmente para de existir no relatório, e a
> descoberta acontece semanas depois, quando alguém pergunta por que o gráfico
> está vazio. Não há teste automatizado que pegue isso.
>
> Se a sua alteração encostar em qualquer coisa descrita aqui, **pare e pergunte
> ao Octavio antes**.

---

## 1. Regra de ouro

| Situação | O que fazer |
|---|---|
| Vou mexer em um arquivo da seção 3 | **Parar.** Consultar o kit de implantação e o Octavio |
| Vou remover, renomear ou mover um atributo `data-track*` | **Parar.** Ver seção 5 |
| Vou adicionar, renomear ou remover procedimento ou área | Seguir a receita da seção 6, **inteira** |
| Vou trocar o destino de um link externo | Ver seção 10 — provavelmente quebra uma tag |
| Vou mexer no texto do banner ou da política | Ver seção 8 antes de decidir sobre `CONSENT_VERSION` |
| Estou fazendo qualquer outra coisa no site | Segue normalmente |

Nada aqui proíbe evoluir o site. Proíbe evoluir o site **sem saber o que se
está desligando**.

---

## 2. O que este site é

- **Next.js 15 (App Router) + React 19 + TypeScript.** Sem framework de CSS,
  sem biblioteca de estado, sem dependência de analytics no `package.json`.
  O banner de consentimento é React puro, escrito à mão.
- **Nome do pacote:** `site-victor-folster`. Existem outras pastas do site do
  Victor na máquina do Octavio que **não** são este repositório — confira o
  `package.json` antes de trabalhar.
- **Produção:** https://www.victorfolster.com.br, hospedado na Vercel.
- **Conteúdo:** 13 procedimentos e 5 áreas de atuação, todos em
  `lib/siteData.ts`. Links, telefone e endereço em `lib/siteConfig.ts`, que é
  fonte única — não duplique esses valores em componente nenhum.
- **Painel do cliente:** `dados.victorfolster.com.br`. Desde 2026-08-06 é uma
  **aplicação própria dentro deste mesmo repositório** — não é ferramenta de
  terceiro embutida. Lê o Google Analytics 4 `G-KG4DXCRNNS`, alimentado pelo
  container Google Tag Manager `GTM-TM72FQ3X`. Ver a seção 12.

---

## 3. Os quatro arquivos que não se toca sem consultar o kit

Estes arquivos não são código de produto. São a implementação de uma decisão
jurídica e contratual, com testes registrados e aprovação do cliente por trás
de cada linha.

| Arquivo | O que é |
|---|---|
| `components/TagManager.tsx` | Sinal de consentimento padrão + instalação do container. A **ordem** importa: o sinal roda `beforeInteractive`, o container `afterInteractive`. Inverter faz a primeira medição escapar do bloqueio |
| `components/ConsentBanner.tsx` | O banner. Aceitar e recusar têm mesma altura, mesma fonte e mesma área de clique **de propósito** — assimetria entre as opções compromete a validade do consentimento perante a LGPD. Já foi pedido pelo cliente e recusado com justificativa registrada |
| `lib/consent.ts` | Chave de armazenamento, versão do texto, categorias liberadas e negadas. `ad_personalization` fica **negada mesmo no aceite**, e isso é decisão, não esquecimento |
| `app/privacidade/page.tsx` | A política, com 14 seções, aprovada pelo cliente em 2026-08-05. Descreve exatamente o que a instrumentação coleta. Mudar a coleta sem mudar esta página cria divergência entre o que é feito e o que é declarado |

Também não mexer sem consultar: `app/(site)/layout.tsx` nas linhas que montam
`<TagManager />` e `<ConsentBanner />`, e o bloco de CSS do banner no fim de
`app/site.css`.

> **Atenção a uma mudança de lugar.** Até 2026-08-05 esses dois componentes
> moravam em `app/layout.tsx`. Eles foram para `app/(site)/layout.tsx` para que
> a medição pare no site e não alcance o painel do cliente, que nasce debaixo do
> layout raiz. **Não os devolva para a raiz** — ver a seção 12.

---

## 4. Os quatro atributos de rastreio

São atributos HTML sem nenhum efeito visual ou de comportamento. O container
GTM os lê no momento do clique para preencher os parâmetros do evento.

| Atributo | Vira o parâmetro | Para que serve |
|---|---|---|
| `data-track` | `click_position` | Saber **de onde** no site veio o clique |
| `data-track-cta` | `is_cta` | Separar os 4 botões "Agendar Avaliação" dos outros pontos de WhatsApp |
| `data-track-item` | `item_name` **ou** `procedure_name` | Nome do procedimento ou da área |
| `data-track-item-type` | `item_type` | Distinguir área de procedimento |

Duas particularidades que já causaram problema e vão causar de novo:

**`data-track-cta="agendar"` — o valor não importa, a presença importa.** O
container converte presença em `sim` e ausência em `nao`. Não troque o valor
achando que ele aparece no relatório; ele não aparece.

**`data-track-item` alimenta dois parâmetros diferentes conforme o evento.**
Nos cards de área e procedimento vira `item_name`. No botão "Agendar Avaliação"
dentro do detalhe de um procedimento vira `procedure_name`. É o mesmo atributo
lido por duas tags distintas.

### Os 16 pontos, em 10 componentes

| Componente | Elemento | Atributos |
|---|---|---|
| `Nav.tsx` | Botão "Agendar Avaliação" do menu | `data-track="menu_superior"` · `data-track-cta="agendar"` |
| `Nav.tsx` | Ícone WhatsApp do menu lateral | `data-track="menu_lateral"` |
| `Nav.tsx` | Ícone Instagram do menu lateral | `data-track="menu_lateral"` |
| `HeroSection.tsx` | Botão "Agendar Avaliação" do topo | `data-track="topo"` · `data-track-cta="agendar"` |
| `FinalSection.tsx` | Botão "Agendar Avaliação" de fechamento | `data-track="fechamento"` · `data-track-cta="agendar"` |
| `ContactSection.tsx` | Número de telefone (link WhatsApp) | `data-track="contato"` |
| `ContactSection.tsx` | Link do Instagram | `data-track="contato"` |
| `ContactSection.tsx` | Link "Ver endereço no Google Maps" | `data-track="contato"` |
| `FooterAndFloating.tsx` | Botão flutuante de WhatsApp | `data-track="flutuante"` |
| `FooterAndFloating.tsx` | Botão flutuante de Instagram | `data-track="flutuante"` |
| `ResultsSection.tsx` | "Ver mais casos reais no Instagram" | `data-track="resultados"` |
| `ResultsSection.tsx` | Botão "Grupo VIP" | `data-track="resultados"` |
| `ReviewsSection.tsx` | "Ver todas as avaliações no perfil do Google" | `data-track="avaliacoes"` |
| `ProcedureDetailBody.tsx` | Botão "Agendar Avaliação" do detalhe | `data-track="detalhe_procedimento"` · `data-track-cta="agendar"` · `data-track-item={procedure.title}` |
| `CategoryExplorer.tsx` | Cards das 5 áreas | `data-track-item={item.name}` · `data-track-item-type="area"` |
| `CategoryDetailBody.tsx` | Cards dos 13 procedimentos | `data-track-item={title}` · `data-track-item-type="procedimento"` |

Cada um desses pontos tem um comentário no código explicando que é medição.
**Se você está prestes a apagar um comentário desses, está prestes a apagar o
atributo junto.**

Os 7 valores válidos de `data-track` para WhatsApp são `menu_superior`, `topo`,
`fechamento`, `detalhe_procedimento`, `menu_lateral`, `contato` e `flutuante`.
Os 4 primeiros são CTA. Inventar um valor novo cria uma linha nova no relatório
que ninguém sabe ler.

---

## 5. Por que a quebra é silenciosa

Este é o motivo de este arquivo existir. Percorra o cenário:

1. Alguém refatora `Nav.tsx` e, no meio do caminho, o `data-track="menu_superior"`
   se perde.
2. `npm run build` passa. `tsc` passa. Nenhum lint reclama — é um atributo HTML
   válido, e removê-lo é tão legítimo quanto adicioná-lo.
3. A página abre idêntica. O botão continua funcionando. O WhatsApp continua
   abrindo.
4. O evento `whatsapp_click` **continua disparando** — o gatilho é a URL conter
   `wa.me`, e ela continua contendo.
5. Só que agora ele chega sem `click_position`. No relatório, aquele clique vira
   `(not set)`.
6. O indicador 1 do contrato — "qual dos 4 botões de agendamento funciona
   melhor" — passa a ter uma linha a menos e uma linha de lixo a mais.
7. Ninguém percebe até o cliente perguntar.

O mesmo vale para `data-track-item-type`: sem ele, área e procedimento de mesmo
nome viram uma linha só, e o número fica **errado** — não vazio, errado, que é
pior.

Foi exatamente assim que o achado E0.5 aconteceu: um segundo link para o Google
Maps existia sem `data-track`, disparava o evento normalmente, e chegava sem
posição. Só apareceu porque alguém foi conferir clique por clique.

---

## 6. Adicionar, renomear ou remover procedimento ou área

Tudo mora em `lib/siteData.ts`: `procedures` (13 itens, campo `title`) e
`categories` (5 itens, campo `name`). O slug da URL é **derivado do título** por
`slugify()` em `lib/content.ts` — ninguém escreve slug à mão.

### Adicionar

1. Acrescente o objeto em `procedures` ou `categories`.
2. Se for procedimento, referencie o `title` no array `procedures` da área
   correspondente.
3. **Nada mais é necessário para a medição.** Os atributos são aplicados no
   `.map()` dos cards, então o item novo já nasce instrumentado.
4. Confirme que ele aparece com o nome certo — o nome vai para o relatório
   exatamente como está escrito, acento incluído.

### Renomear — leia antes de fazer

Renomear tem **dois efeitos colaterais**, e os dois são permanentes:

**1. Parte o histórico do relatório.** `item_name` é o texto que aparece no
painel. Se "Preenchimento Labial" virar "Preenchimento de Lábios", o relatório
passa a ter **duas linhas**: a antiga com os cliques até a data da mudança, a
nova com os cliques depois. Elas não se somam, e não há como uni-las
retroativamente. Comparar os últimos 6 meses fica impossível para aquele item.

**2. Muda a URL.** O slug vem do título, então `/procedimentos/preenchimento-labial`
vira `/procedimentos/preenchimento-de-labios`. O link antigo passa a dar 404, e
qualquer indexação ou link compartilhado quebra junto.

Se ainda assim for necessário renomear: avise o Octavio para que ele registre a
data da troca. O painel precisa de uma nota explicando por que existem duas
linhas para a mesma coisa — sem isso, parece erro de medição.

### Remover

O item some do site e o relatório mantém o histórico até onde ele existiu. Isso
é correto e não precisa de nada. Só avise, para que o painel não pareça ter
perdido dado.

### A armadilha "Estética Regenerativa"

**"Estética Regenerativa" é o nome de uma área E de um procedimento.** Os dois
existem, os dois são clicáveis, e os dois geram o mesmo `item_name`.

O que os separa é `data-track-item-type`, com valor `area` ou `procedimento`.
**Ele não é opcional e não é redundante.** Sem ele, os cliques nos dois se
somam numa linha só e o relatório afirma um número que nunca aconteceu.

Se você for criar qualquer estrutura nova de card clicável que aponte para
`/areas/` ou `/procedimentos/`, ela precisa dos dois atributos. Um sem o outro
não serve.

---

## 7. O container lê o site — o que quebra sem quebrar o código

O GTM não conhece o seu código. Ele observa o HTML no momento do clique e
decide por condições de URL e por seletor CSS. Mudar qualquer uma das coisas
abaixo desliga uma tag **sem nenhum erro em lugar nenhum**.

| O que o container espera | Onde vive hoje | O que acontece se mudar |
|---|---|---|
| URL contendo `wa.me` | `whatsappUrl()` em `lib/siteConfig.ts` | Trocar por encurtador ou por outro domínio de WhatsApp mata o indicador principal do contrato |
| URL contendo `instagram.com` | `siteConfig.links.instagram` | Encurtador mata `instagram_click` |
| URL contendo `google.com/maps` | `siteConfig.links.googleBusiness` | Um link `maps.app.goo.gl` **não bate na condição**. Mata `endereco_click` nos dois pontos de uma vez |
| URL contendo `whatsapp.com/channel` | `siteConfig.links.whatsappChannel` | Se virar um `wa.me`, o Grupo VIP passa a contar como **ação importante** e infla o indicador principal. É o pior desfecho da lista |
| Caminho contendo `/procedimentos/` ou `/areas/` | `routes` em `lib/content.ts` | Renomear as rotas mata `procedimento_click` inteiro |
| Elemento com `id="resultados"` | `<section id="resultados">` em `ResultsSection.tsx` | Renomear o id mata `resultados_view` |

**Caso especial que merece atenção redobrada:** os cards de área e procedimento
são `<Link href="/areas/...">` com `event.preventDefault()` — o clique abre um
painel sobreposto em vez de navegar. O container depende do `href` estar lá para
ler a URL do clique.

Se alguém trocar esses `<Link>` por `<button>` — o que parece uma limpeza
razoável, já que a navegação é interceptada de qualquer jeito — **o `href`
desaparece, a condição de URL nunca bate, e `procedimento_click` para de existir
por completo.** O site continua funcionando perfeitamente.

---

## 8. `CONSENT_VERSION` — quando sobe e quando não

Fica em `lib/consent.ts`. Hoje: `1.1`.

Subir a versão faz o banner **reaparecer para todo visitante que já decidiu**,
inclusive quem já tinha aceitado. O consentimento antigo deixa de ser aplicado
até a pessoa responder de novo.

**Sobe quando o tratamento muda** — quando a pessoa que decidiu sobre o texto
antigo teria decidido sobre coisa diferente:

- entra uma categoria nova de consentimento;
- passa a ser coletado algo que antes não era;
- entra uma ferramenta nova de terceiro;
- o dado passa a ter finalidade nova.

**Não sobe quando só o detalhamento muda:**

- a política ganha seções, exemplos ou linguagem mais clara sobre o mesmo
  tratamento;
- correção de texto, de acentuação ou de layout do banner;
- refatoração que não altera o que é coletado.

Precedente registrado: em 2026-08-05 a política passou de 13 para 14 seções com
a subseção de cookies, e a versão **não** subiu — a subseção descreve cookies
que já eram gravados e já estavam declarados. Subir teria pedido reconsentimento
por uma mudança que não existiu.

Precedente inverso: a versão subiu de 1.0 para 1.1 quando o aceite passou a
liberar as categorias de anúncio. Aí sim o tratamento mudou.

Na dúvida, a pergunta é uma só: **alguém que aceitou o texto anterior aceitaria
este?** Se a resposta não for um sim óbvio, sobe.

---

## 9. Como o site é publicado

```
push na main  →  deploy automático na Vercel  →  produção
```

Não existe etapa de aprovação. **Push na `main` publica.**

A variável `NEXT_PUBLIC_GTM_ID` está cadastrada **apenas no ambiente
Production** da Vercel. Isso é proposital e tem consequências que confundem:

- Em `localhost` e em deploys de preview a variável não existe, então
  `TagManager.tsx` retorna `null` e **nada é injetado**. O site roda idêntico ao
  que era antes da instrumentação. Isso não é bug.
- Consequência prática: **você não consegue testar a medição localmente** sem
  colocar o ID real em `.env.local`. E se colocar, os seus cliques de teste vão
  para a base do cliente, onde **não podem ser apagados**. Não faça isso sem
  falar com o Octavio.
- Se a medição sumir de produção, a primeira coisa a conferir é se a variável
  continua cadastrada — não o código.

Há uma segunda trava, dentro do container: uma variável `vAmbientePermitido` só
libera as tags quando o hostname é o de produção **ou** o modo de depuração do
GTM está ligado.

---

## 10. A armadilha dos 15 minutos

Se você publicar uma alteração no container GTM e for verificar em seguida no
navegador, vai ver **zero requisições** e concluir que a publicação falhou.

Ela não falhou. O `gtm.js` é servido com `cache-control: private, max-age=900`,
e o navegador continua usando a cópia baixada **antes** da publicação. O sintoma
é idêntico ao de uma publicação quebrada.

**Como verificar de verdade:** desabilite o cache no DevTools (aba Network,
"Disable cache") e recarregue. Ou leia o arquivo direto de
`googletagmanager.com/gtm.js?id=GTM-TM72FQ3X` e procure pelos nomes dos eventos.

Custou uma rodada inteira de diagnóstico em 2026-08-05.

---

## 11. Outras coisas que não podem mudar

- **A flag `welcomeModal` continua `false`.** Ligar o modal de captura de lead
  exige definir destino do lead e tratar dado pessoal — muda a natureza do
  projeto e está fora do escopo contratado.
- **`robots.ts` e `sitemap.ts`** do site principal não foram tocados pela
  instrumentação e não devem ser.
- **Nenhuma dependência nova** foi adicionada por causa da medição, e nenhuma
  deve ser. Se uma alteração sua parecer precisar de uma biblioteca de analytics,
  a alteração está errada.
- **O canal de contato de privacidade na política é o WhatsApp**, porque o
  cliente ainda não definiu e-mail de encarregado. Trocar quando ele definir.
- **Os 5 casos de antes e depois ficam com o rótulo genérico "Antes e depois".**
  O campo `label` em `ResultsSection.tsx` está vazio **por decisão do cliente**,
  registrada em 2026-08-05 (decisão D6 do escopo contratado). Chegou a existir a
  pendência de o Victor informar qual procedimento é cada caso; ele optou por
  não identificar. Preencher o `label` por conta própria, achando que é lacuna
  esquecida, desfaz uma escolha dele sobre a própria imagem de pacientes.

---

## 12. O painel do cliente vive aqui dentro

Desde 2026-08-06 este repositório serve **dois produtos**. O mesmo build, o
mesmo deploy, dois endereços:

```
www.victorfolster.com.br    →  o site. Público, estático, indexável, medido
dados.victorfolster.com.br  →  o painel. Autenticado, dinâmico, oculto, sem medição
```

Quem escolhe é `middleware.ts`, por hostname. **O DNS aponta o servidor; ele não
escolhe a página.** Sem o middleware, o subdomínio serve o site institucional
inteiro — foi o estado real entre 05 e 06 de agosto.

### A regra que explica todo o resto

**A medição para no site. O painel não carrega tag nenhuma.**

Se o container de tags subir junto com o painel, cada vez que o Victor abrir o
relatório o Analytics dele registra uma visita. Os números do painel passam a
incluir quem os lê, e a distorção é maior justamente quando ele acompanha de
perto. Por isso:

| Arquivo | O que monta |
|---|---|
| `app/layout.tsx` | Só `<html>`, `<body>`, fontes e metadados. Comum aos dois |
| `app/(site)/layout.tsx` | `TagManager`, `JsonLd`, `ConsentBanner`. **Só o site** |
| `app/(painel)/layout.tsx` | O casco do painel e o `noindex`. **Nenhuma tag** |

`(site)` e `(painel)` são route groups: não aparecem em URL nenhuma, e nenhum
endereço do site mudou por causa deles.

### O painel é produto da Escale IA, não uma página a mais do consultório

Decisão **D7** de `05-escopo-contratado.md`, de 2026-08-06: o código do painel é
ativo da agência e se reaproveita nos próximos clientes; o que é do Victor é a
instância — o endereço, o acesso e **o dado**, que nunca sai da propriedade
dele. Três consequências para quem mexer aqui:

| | Onde | Regra |
|---|---|---|
| **Identidade** | `app/painel.css` | A paleta é a da **Escale IA**, dos tokens canônicos em `empresas-arquivos/ESCALE-IA/4-Marca/tokens/` (v1.2.0), onde cada par texto/fundo já foi medido em WCAG. **Não invente cor**: se faltar uma, ela existe lá. O painel deixou de herdar a paleta do site do cliente em 06/08 |
| **O que é do cliente** | `lib/painel/instancia.ts` | Nome, subtítulo, como se chama a ação importante e quais são os sinais de contexto. **Nada além disso.** Se você precisou editar um componente para atender a um cliente, o componente está errado ou falta uma chave nesse arquivo |
| **Cor não é tema de cliente** | — | Índigo e ciano carregam significado (abaixo). Trocá-los por cor de cliente destrói a regra que eles tornam visível |

**O ciano nunca pinta algarismo.** Ele mede 2.07:1 sobre branco e os próprios
tokens da marca proíbem usá-lo como texto ou borda de controle em fundo claro.
A família de contexto se marca por **área** — faixa do cartão, preenchimento de
barra, ponto do rótulo — e o número fica em tinta. Está escrito no cabeçalho de
`app/painel.css`, e o motivo é contraste, não gosto.

### Os seis pontos que quebram o painel sem erro nenhum

| O que | Onde | O que acontece se mexer |
|---|---|---|
| Ler o hostname pelo cabeçalho da requisição | `hostnameDaRequisicao()` em `middleware.ts` | `req.nextUrl.hostname` responde `localhost` em desenvolvimento **e todo o roteamento vira letra morta, em silêncio**. Já aconteceu em 06/08 |
| Reescrever para uma rota que **existe** e chama `notFound()` | `/nao-encontrado` e `/painel/nao-encontrado` | Reescrever para um caminho inventado devolve 404 em desenvolvimento e **200 em produção**. O corpo diz "Página não encontrada" e o cabeçalho diz que a página existe — soft 404, e o `robots.txt` do site permite rastrear tudo. Achado E0.10, em 06/08 |
| `getVercelOidcToken()` **sem argumento** | `lib/ga4.ts` | Informar `{ audience }` troca o token, e o provedor do Google recusa. Custou um dia inteiro em 05/08 |
| Os nomes das 5 dimensões | `DIMENSAO` em `lib/ga4.ts` | Nome errado não dá erro: a consulta responde com sucesso e a coluna vem **vazia**. Descoberto meses depois |
| O `overrides` de `google-auth-library` | `package.json` | Sem ele há duas cópias da biblioteca, com tipos diferentes para a mesma classe, e o build quebra |
| `exigirAcesso()` como primeira linha da página | `lib/painel/sessao.ts` | É a trava real de acesso. Página nova do painel sem essa chamada expõe dado do cliente |
| Ler a coluna `dateRange`, e **não** a ordem das linhas | `duasJanelas()` em `lib/painel/consultas.ts` | Com dois intervalos, a API devolve uma linha por intervalo **em ordem não garantida**. Tratar a linha 0 como período atual mostra o período anterior com o rótulo do atual, sem erro nenhum. Achado E0.12, 06/08 |
| `dateRange` **se lê, não se pede** | o mesmo lugar | Listá-la em `dimensions` devolve `INVALID_ARGUMENT: Field dateRange is not a dimension` e derruba a página. Ela entra sozinha no cabeçalho da resposta. Foi a correção errada do problema da linha acima, e tirou a visão geral do ar por dois commits |

### Regras do painel que vêm de contrato, não de gosto

Estão em `08-matriz-do-dashboard.md` e `06-plano-de-medicao.md`. Mudar qualquer
uma é mudança de escopo:

1. **Ação importante e sinal de contexto nunca se somam.** WhatsApp é a ação.
   Instagram, endereço e Grupo VIP são contexto. A cor codifica isso: índigo
   `#4F46E5` para ação, ciano `#00C2FF` para contexto — as duas famílias da
   marca da Escale IA, e não uma escolha estética.
2. **Todo cartão que pode ser mal lido carrega uma linha dizendo o que ele NÃO
   significa.** Por isso a propriedade `limite` de `Cartao` é obrigatória —
   esquecer virou erro de compilação.
3. **Vocabulário travado.** "Cliques para o Grupo VIP", nunca "entradas no
   grupo". "Cliques por procedimento", nunca "páginas mais vistas". "Região
   aproximada", nunca "localização". "Ação importante", nunca "conversão".
4. **Aviso de consentimento na primeira página** e **aviso de frescor no
   rodapé** de todas.
5. **A página do Google Ads aparece mesmo sem dado**, com "aguardando
   veiculação". Nunca esconder, nunca preencher com estimativa.
6. **17 indicadores em 4 páginas**, desde o aditivo A2 de 2026-08-06. Um
   indicador a mais é aditivo de escopo.
7. **Quando a soma das partes não bater com o total, o painel diz isso na
   tela**, com a diferença explícita. É a propriedade `total` de `Barras`. A
   plataforma omite linhas por limiar de privacidade, e o silêncio sobre a
   diferença foi o que derrubou a confiança no painel em 06/08.
8. **Enquanto a série for curta, o painel declara desde quando existe
   medição.** `INICIO_DA_MEDICAO` em `lib/painel/periodo.ts`. Sem isso, trocar
   "esta semana" por "este ano" e ver o mesmo número parece painel travado.

**Nada em inglês chega ao cliente.** A Data API responde `Unassigned`,
`Organic Social`, `State of Santa Catarina`. As traduções ficam em
`lib/painel/formato.ts` — `canal()`, `regiao()`, `cidade()`, `posicao()`. Valor
que não estiver no mapa aparece como veio, de propósito: é a pista de que
surgiu algo novo, e um rótulo genérico a apagaria.

### Um erro no painel derruba o site

É a consequência mais séria do aditivo A1, e foi aceita por escrito. Site e
painel compartilham build e deploy: **`npm run build` antes de todo push**, sem
exceção.

---

## 13. Checklist antes de dar push

- [ ] `npm run build` passa
- [ ] Se toquei em algum dos 10 componentes da seção 4: os atributos continuam
      lá? Conferir com o comando abaixo
- [ ] Se toquei em link externo: a URL ainda bate com a condição da seção 7?
- [ ] Se adicionei procedimento ou área: o nome está escrito como deve aparecer
      no relatório do cliente?
- [ ] Se mexi em banner, política ou consentimento: decidi sobre
      `CONSENT_VERSION` conscientemente? (seção 8)
- [ ] Se mexi em qualquer arquivo da seção 3: **falei com o Octavio?**
- [ ] Se criei página nova no painel: ela chama `exigirAcesso()` na primeira
      linha? (seção 12)
- [ ] Se mexi no painel: nenhum rótulo usa termo vedado, e todo cartão novo tem
      a linha do que ele não significa?
- [ ] Se escrevi texto do painel: nenhum nome de cliente ficou dentro de
      componente — o que é do cliente vem de `lib/painel/instancia.ts`
- [ ] Se acrescentei cor: ela existe nos tokens da Escale IA, ou eu inventei?

### Comando de conferência

```bash
grep -rc 'data-track[a-z-]*=[{"]' components/ | grep -v ':0'
```

Resultado esperado, **23 linhas de atributo em 10 componentes** — são mais
linhas que os 16 pontos da seção 4 porque um mesmo elemento pode levar até três
atributos:

```
components/CategoryDetailBody.tsx:2
components/CategoryExplorer.tsx:2
components/ContactSection.tsx:3
components/FinalSection.tsx:2
components/FooterAndFloating.tsx:2
components/HeroSection.tsx:2
components/Nav.tsx:4
components/ProcedureDetailBody.tsx:3
components/ResultsSection.tsx:2
components/ReviewsSection.tsx:1
```

Se algum número baixar, ou se um arquivo sumir da lista, alguma coisa foi
embora. Se você **adicionou** um ponto de rastreio novo de propósito, atualize
esta tabela junto — um número desatualizado aqui é pior que número nenhum,
porque a próxima pessoa vai achar que quebrou algo e sair procurando.

---

## 14. Onde fica o resto

O kit de implantação completo está em
`Desktop/CLAUDE/projetos/implantaçãodadosvictor/implantacao/`, documentos 00 a
13 mais `A9-especificacao-container.md`.

Os que importam para quem mexe no site:

| Documento | Quando consultar |
|---|---|
| `05-escopo-contratado.md` | **Fonte de verdade do escopo.** Item que não está lá não se implementa; vira aditivo. A seção 12 é o aditivo A1, que trouxe o painel para cá |
| `08-matriz-do-dashboard.md` | Os 12 indicadores, com o cálculo e a limitação declarada de cada um |
| `07-matriz-de-eventos.md` | O que cada evento significa e quais parâmetros carrega |
| `A9-especificacao-container.md` | Como o container está configurado, tag por tag |
| `11-plano-de-implementacao.md` | O que foi alterado no site e por quê |
| `13-evidencias.md` | O que foi testado e como. Nenhum teste vale por leitura de código — só por dado observado |

**Regra do kit que vale aqui dentro também:** nenhum agente ou pessoa está
autorizado a implementar item que não conste no escopo contratado. Pedido novo
vira aditivo formal, nunca execução direta.

---

**Última atualização:** 2026-08-06 · Instrumentação em produção desde
2026-08-05, container GTM versão 2. **Painel publicado em 2026-08-06** em
`dados.victorfolster.com.br`, e **redesenhado no mesmo dia** com a identidade
da Escale IA, período em linguagem de negócio e a página de Google Ads do
aditivo A2 — 17 indicadores em 4 páginas. 31 testes aprovados, 1 parcial (T33),
1 reprovado (T28). Falta entrar no painel e conferir os indicadores (T31),
o vocabulário (T38) e o desempenho (T36).

> **Como conferir, em 10 segundos, que a separação continua de pé.** Abra o
> console em `www.victorfolster.com.br` e digite `typeof window.dataLayer` —
> tem que responder `"object"`. Faça o mesmo em
> `dados.victorfolster.com.br/painel/entrar` — tem que responder `"undefined"`.
> Se os dois responderem igual, alguma coisa saiu do lugar.
>
> **Não confira isso com `grep` no HTML.** O código do container aparece no
> payload da página do painel como texto serializado e **nunca executa** —
> concluir pelo arquivo dá a resposta exatamente oposta à verdade. Foi medido
> em 06/08.
