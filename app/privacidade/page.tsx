import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig, fullAddress } from "@/lib/siteConfig";
import { CONSENT_VERSION } from "@/lib/consent";

import Nav from "@/components/Nav";
import FooterAndFloating from "@/components/FooterAndFloating";
import ConsentPreferencesLink from "@/components/ConsentPreferencesLink";

/**
 * Política de Privacidade.
 *
 * ATENÇÃO — esta página descreve tecnicamente o que a instrumentação do site
 * de fato coleta, escrita a partir da matriz de eventos implantada. Ela NÃO
 * substitui revisão jurídica, e o controlador dos dados é o Dr. Victor
 * Folster, não a agência. A publicação em produção depende da aprovação
 * dele (etapa B1 do plano de implementação).
 *
 * Ao alterar qualquer texto abaixo de forma relevante, subir CONSENT_VERSION
 * em lib/consent.ts — o banner precisa reaparecer para quem decidiu sobre a
 * versão antiga.
 *
 * TODO: trocar o canal de contato pelo e-mail do encarregado, quando o
 * cliente definir um. Hoje o único canal confirmado é o WhatsApp.
 */
export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o site do Dr. Victor Folster trata dados de navegação, o que é coletado mediante consentimento e como revogar a autorização.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <main className="detail-page">
        <div className="detail-header detail-header-page">
          <Link className="back-btn" href="/" aria-label="Voltar para a home">
            ←
          </Link>
          <div className="detail-title">Política de Privacidade</div>
        </div>

        <div className="detail-body">
          <p className="eyebrow detail-page-eyebrow">
            Versão {CONSENT_VERSION} · Vigente desde a publicação
          </p>

          <h1 className="proc-page-title">Política de Privacidade</h1>
          <p className="detail-desc">
            Este documento explica, em linguagem direta, quais dados este site coleta, para
            que servem e como você controla essa coleta. Ele descreve o que o site realmente
            faz — não um modelo genérico.
          </p>

          <h2 className="detail-section-title">Quem é responsável pelos dados</h2>
          <ul className="benefit-list">
            <li>
              {siteConfig.name} — {siteConfig.role}, {siteConfig.credentials}.
            </li>
            <li>{fullAddress}.</li>
            <li>Contato: WhatsApp {siteConfig.phone.display}.</li>
          </ul>

          <h2 className="detail-section-title">O que é coletado</h2>
          <p className="detail-desc">
            Nada é coletado antes de você aceitar no aviso que aparece na primeira visita. Se
            você recusar, ou se ainda não tiver decidido, o site funciona igual e nenhuma das
            informações abaixo é registrada.
          </p>
          <p className="detail-desc">Aceitando, são registrados apenas dados de navegação:</p>
          <ul className="benefit-list">
            <li>Páginas abertas e horário de acesso.</li>
            <li>
              Região aproximada do acesso, derivada do endereço de rede — cidade ou estado,
              nunca endereço exato.
            </li>
            <li>Tipo de aparelho, navegador e idioma.</li>
            <li>Como você chegou até aqui: busca, rede social, link direto ou anúncio.</li>
            <li>
              Quais botões e cards você clicou: WhatsApp, Instagram, endereço, procedimentos e
              Grupo VIP; e se a seção de resultados foi exibida na sua tela.
            </li>
          </ul>

          <h2 className="detail-section-title">O que não é coletado</h2>
          <ul className="benefit-list">
            <li>Nome, telefone, e-mail ou qualquer dado que identifique você pessoalmente.</li>
            <li>
              Nenhum dado de saúde. Este site não tem formulário ativo, anamnese, upload de
              foto nem cadastro.
            </li>
            <li>Conteúdo de conversas — o que você escreve no WhatsApp não passa por aqui.</li>
            <li>Gravação de tela, movimento de mouse ou mapa de cliques.</li>
          </ul>
          <p className="detail-desc">
            A medição registra que <em>alguém</em> clicou em um botão, não <em>quem</em> clicou.
          </p>

          <h2 className="detail-section-title">Para que serve</h2>
          <p className="detail-desc">
            Para entender quais assuntos interessam a quem visita o site e melhorar as páginas
            e o atendimento. Os dados são lidos de forma agregada, em números totais. Não há
            perfil individual, não há decisão automatizada sobre você e não há venda de dados.
          </p>

          <h2 className="detail-section-title">Base legal</h2>
          <p className="detail-desc">
            Seu consentimento, nos termos do artigo 7º, inciso I, da Lei Geral de Proteção de
            Dados (Lei 13.709/2018). É por isso que o aviso aparece antes de qualquer coleta,
            e é por isso que recusar não tira nenhuma funcionalidade do site.
          </p>

          <h2 className="detail-section-title">Com quem os dados são compartilhados</h2>
          <p className="detail-desc">
            Com o Google, que fornece as ferramentas de medição usadas aqui — Google Analytics
            e Google Tag Manager. O Google atua como operador desses dados e os processa em
            servidores fora do Brasil, o que caracteriza transferência internacional. Nenhum
            outro terceiro recebe dados deste site.
          </p>

          <h2 className="detail-section-title">Por quanto tempo ficam guardados</h2>
          <p className="detail-desc">
            Os dados de navegação são retidos por 14 meses e depois excluídos automaticamente
            pela ferramenta de medição. Relatórios agregados, que não identificam ninguém,
            podem ser mantidos por mais tempo.
          </p>

          <h2 className="detail-section-title">Seus direitos</h2>
          <p className="detail-desc">
            A LGPD garante a você o direito de confirmar se há tratamento, acessar os dados,
            corrigir dados incompletos ou desatualizados, pedir anonimização ou eliminação,
            saber com quem foram compartilhados e revogar o consentimento a qualquer momento.
          </p>
          <p className="detail-desc">
            Para exercer qualquer um deles, fale pelo WhatsApp {siteConfig.phone.display}.
            Vale saber: como a coleta não guarda nada que identifique você, na prática não é
            possível localizar &ldquo;os seus dados&rdquo; dentro do conjunto — o que existe são números
            agregados. A forma efetiva de interromper a coleta é revogar o consentimento.
          </p>

          <h2 className="detail-section-title">Como mudar ou revogar sua escolha</h2>
          <p className="detail-desc">
            Use o botão abaixo para reabrir o aviso e trocar sua resposta. A mudança vale
            imediatamente. Você também pode apagar os cookies deste site pelo seu navegador,
            o que faz o aviso aparecer de novo na próxima visita.
          </p>
          <p className="detail-desc">
            <ConsentPreferencesLink />
          </p>

          <h2 className="detail-section-title">Alterações nesta política</h2>
          <p className="detail-desc">
            Se o texto mudar de forma relevante, o aviso reaparece para você decidir de novo
            sobre a versão nova. A versão atual está indicada no topo desta página.
          </p>
        </div>
      </main>

      <FooterAndFloating />
    </>
  );
}
