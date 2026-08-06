import { NextResponse, type NextRequest } from "next/server";

// Roteamento por hostname. Um único projeto responde por dois endereços:
//
//   www.victorfolster.com.br    → o site institucional, público e indexável
//   dados.victorfolster.com.br  → o painel do cliente, autenticado e oculto
//
// O registro DNS do subdomínio aponta o servidor; ele não escolhe a página.
// Sem este arquivo, `dados.victorfolster.com.br` serve o site institucional
// inteiro — foi exatamente o estado registrado em E0.9 de `13-evidencias.md`.
//
// Nada aqui é decisão de segurança. Quem barra o acesso ao dado é
// `exigirAcesso()` em `lib/painel/sessao.ts`, executado dentro de cada página.
// Este arquivo decide QUAL página responde, não QUEM pode vê-la.

/** Hostname do painel. Sem porta — a comparação já remove a porta. */
const HOST_PAINEL = "dados.victorfolster.com.br";

/** Hostnames do site em produção. */
const HOSTS_SITE = ["victorfolster.com.br", "www.victorfolster.com.br"];

/**
 * Rota que produz um 404 **do site**, com menu, rodapé e banner.
 *
 * Usada para esconder o painel do domínio do site. Ela existe de verdade e
 * chama `notFound()`; não basta reescrever para um caminho inventado.
 *
 * Medido em produção em 2026-08-06: reescrever `/painel` para `/404`, que não
 * é rota nenhuma, devolvia o corpo certo com **status 200**. Em
 * desenvolvimento o mesmo código devolvia 404 — a hospedagem resolve o caminho
 * reescrito como página pré-renderizada e responde 200. O resultado é um "soft
 * 404": o buscador lê a página de erro como página válida, e o `robots.txt` do
 * site permite rastrear tudo.
 */
const CAMINHO_404_DO_SITE = "/nao-encontrado";

/**
 * Rota do painel que só existe para produzir um 404 **dentro do layout do
 * painel**, sem o container de tags.
 *
 * O `app/not-found.tsx` da raiz monta o layout do site inteiro, incluindo a
 * medição e o banner de consentimento. Servi-lo no subdomínio faria o painel
 * carregar o container de tags do próprio cliente — o erro que a separação em
 * route groups existe para impedir.
 */
const CAMINHO_404_DO_PAINEL = "/painel/nao-encontrado";

/**
 * O endereço que o visitante digitou.
 *
 * **Não** usar `req.nextUrl.hostname`: ele descreve a URL de dentro do
 * servidor, não a que chegou. Em desenvolvimento responde `localhost` para
 * qualquer requisição, e todo o roteamento por hostname passa a não fazer nada
 * — silenciosamente, porque o site continua respondendo normal. Medido em
 * 2026-08-06: com aquele campo, `dados.victorfolster.com.br` servia o site.
 *
 * `x-forwarded-host` vem primeiro porque, atrás do balanceador da hospedagem,
 * é ele que carrega o domínio público; `host` traz o endereço interno.
 */
function hostnameDaRequisicao(req: NextRequest): string {
  const bruto =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  // Fora a porta, e em minúsculas: o cabeçalho pode chegar de qualquer jeito.
  return bruto.split(":")[0].trim().toLowerCase();
}

/** O que o subdomínio do painel pode responder. Todo o resto é 404. */
function ehCaminhoDoPainel(pathname: string): boolean {
  return (
    pathname === "/painel" ||
    pathname.startsWith("/painel/") ||
    // As rotas de login e de retorno do Google. Sem elas não há como entrar.
    pathname.startsWith("/api/auth/")
  );
}

export function middleware(req: NextRequest) {
  const host = hostnameDaRequisicao(req);
  const { pathname } = req.nextUrl;

  // --- Subdomínio do painel ---
  if (host === HOST_PAINEL) {
    // Robôs: o painel inteiro fica fora de qualquer índice.
    //
    // `app/robots.ts` responde a mesma coisa em qualquer hostname e não sabe
    // distinguir os dois endereços; por isso a diretiva do subdomínio é
    // servida aqui, antes de chegar à rota. O arquivo do site não é tocado.
    if (pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nDisallow: /\n", {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          // Sem cache: se o subdomínio mudar de natureza, a diretiva antiga
          // não pode continuar viva em cache de intermediário.
          "cache-control": "no-store",
        },
      });
    }

    // A raiz do subdomínio leva ao painel. Redirecionamento, e não reescrita,
    // para que o endereço na barra e os links internos sejam sempre os mesmos
    // em produção, em pré-visualização e em desenvolvimento.
    //
    // O destino sai de uma cópia da própria URL da requisição, com o caminho
    // trocado — e não de uma URL montada à mão. Assim o endereço, a porta e o
    // protocolo continuam sendo os que chegaram, e o visitante não é mandado
    // para outro host. Devolver aqui um `Location` relativo faz o Next recusar
    // com "Invalid URL"; foi o que aconteceu na primeira tentativa.
    if (pathname === "/") {
      const destino = req.nextUrl.clone();
      destino.pathname = "/painel";
      return NextResponse.redirect(destino);
    }

    if (ehCaminhoDoPainel(pathname)) {
      return NextResponse.next();
    }

    // O site institucional não existe neste endereço. Sem esta linha, cada
    // página do site passaria a ter uma segunda URL, no subdomínio.
    return NextResponse.rewrite(new URL(CAMINHO_404_DO_PAINEL, req.url));
  }

  // --- Domínio do site em produção ---
  if (HOSTS_SITE.includes(host)) {
    // O painel não tem endereço no domínio do site. Não é a trava de acesso —
    // é para que exista um caminho só até ele, e para que o site institucional
    // não passe a ter uma área autenticada visível.
    //
    // A mesma função dos dois lados de propósito: se um caminho novo do painel
    // for acrescentado só aqui ou só lá, um dos dois endereços passa a responder
    // o que não devia, e nada acusa.
    if (ehCaminhoDoPainel(pathname)) {
      return NextResponse.rewrite(new URL(CAMINHO_404_DO_SITE, req.url));
    }
    return NextResponse.next();
  }

  // --- Qualquer outro hostname: localhost e pré-visualizações da hospedagem ---
  //
  // Tudo responde, inclusive `/painel`. É o que permite desenvolver e testar o
  // painel sem apontar DNS. O acesso continua exigindo login e lista de
  // permissão, então a URL de pré-visualização não expõe dado nenhum.
  return NextResponse.next();
}

export const config = {
  // Arquivos estáticos e imagens não passam pelo middleware: são servidos
  // direto, e o painel precisa deles no subdomínio. `/robots.txt` fica **fora**
  // desta exclusão de propósito — é interceptado acima.
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico).*)"],
};
