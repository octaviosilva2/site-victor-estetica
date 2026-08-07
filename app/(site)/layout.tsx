import type { Metadata } from "next";

import { businessJsonLd, personJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import TagManager from "@/components/TagManager";
import ConsentBanner from "@/components/ConsentBanner";

// Verificação de propriedade do Google Search Console — NÃO é tag de medição.
// Não coleta nada, não depende de consentimento e não tem relação com o
// container GTM. Serve só para o Search Console confirmar que quem administra a
// propriedade `https://www.victorfolster.com.br` também controla o site.
//
// Fica aqui, e não em `app/layout.tsx`, porque o layout raiz é comum ao site e
// ao painel do cliente (`dados.victorfolster.com.br`, que é noindex). Uma tag
// de verificação de busca no painel não causaria dano, mas não faria sentido
// nenhum. `(site)` cobre a home e todas as páginas públicas, que é o que o
// Search Console precisa enxergar.
//
// O Next gera a `<meta>` a partir deste campo. Não escrever a tag à mão: a
// metadata de um layout de route group é mesclada com a do layout raiz, sem
// sobrescrever título, descrição nem Open Graph.
//
// O valor não é segredo — fica visível no HTML de todas as páginas públicas.
// Acrescentado em 2026-08-07.
export const metadata: Metadata = {
  verification: { google: "wUCfhjJgTcMkrm544HJ_MipeFpCRHIfBt-6Dm2tT3qU" },
};

// Layout do SITE PÚBLICO. Existe para que a camada de medição e o banner de
// consentimento parem no site e não alcancem o painel do cliente, que vive em
// `(painel)` e não pode carregar o container de tags do próprio cliente.
//
// Estes três componentes moraram no layout raiz até 2026-08-05. Vieram para cá
// sem nenhuma alteração de conteúdo e na mesma ordem: o sinal de consentimento
// e o container primeiro, o banner por último. `(site)` é um route group — não
// altera URL nenhuma, e todas as páginas continuam nos mesmos endereços.
//
// A alternativa seria o layout raiz decidir por hostname, o que exigiria ler os
// cabeçalhos da request e tornaria dinâmicas as 20 rotas hoje pré-renderizadas.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sinal de consentimento e container de tags. O consentimento padrão
          é declarado antes do container carregar — inverter essa ordem faz a
          primeira medição escapar do bloqueio. */}
      <TagManager />

      {children}
      {/* Identidade do negócio e do profissional — vale para o site inteiro */}
      <JsonLd data={[businessJsonLd(), personJsonLd()]} />

      {/* Aviso de privacidade. Nenhuma coleta acontece antes da escolha. */}
      <ConsentBanner />
    </>
  );
}
