import { businessJsonLd, personJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import TagManager from "@/components/TagManager";
import ConsentBanner from "@/components/ConsentBanner";

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
