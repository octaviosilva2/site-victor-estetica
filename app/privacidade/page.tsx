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
 * Expansão de 2026-08-04 (P3 do plano de implementação). O cliente pediu uma
 * política "de site de autoridade"; copiar texto de terceiro foi recusado —
 * é obra protegida e descreveria coleta que este site não faz. O que foi
 * adotado é a *estrutura* formal desse tipo de documento, com o conteúdo
 * continuando a ser só o que a instrumentação realmente faz. A versão não
 * subiu de 1.1 porque nada aqui mudou o tratamento: mudou o detalhamento, e
 * a 1.1 nunca chegou à produção. Ver a nota em lib/consent.ts.
 *
 * TODO: trocar o canal de contato pelo e-mail do encarregado, quando o
 * cliente definir um. Hoje o único canal confirmado é o WhatsApp.
 *
 * TODO: acrescentar a subseção "Cookies e armazenamento no navegador" com os
 * cookies do Google nomeados e sua duração, depois de observá-los no
 * navegador durante o Bloco 2 dos testes. Não escrever de memória — a regra
 * de 13-evidencias.md vale para o que a política afirma.
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

          <h2 className="detail-section-title">Definições usadas aqui</h2>
          <ul className="benefit-list">
            <li>
              <strong>Titular</strong> — você, a pessoa a quem os dados se referem.
            </li>
            <li>
              <strong>Controlador</strong> — quem decide por que e como os dados são
              tratados. Aqui, {siteConfig.name}.
            </li>
            <li>
              <strong>Operador</strong> — quem trata os dados por conta do controlador.
              Aqui, o Google, que fornece as ferramentas de medição.
            </li>
            <li>
              <strong>Dados de navegação</strong> — informações sobre como o site foi usado:
              páginas abertas, botões clicados, aparelho e origem do acesso. Não incluem seu
              nome nem qualquer forma de identificá-lo.
            </li>
          </ul>

          <h2 className="detail-section-title">Quem é responsável pelos dados</h2>
          <ul className="benefit-list">
            <li>
              {siteConfig.name} — {siteConfig.role}, {siteConfig.credentials}. É o
              controlador dos dados descritos nesta política.
            </li>
            <li>{fullAddress}.</li>
            <li>
              Canal de contato para assuntos de privacidade: WhatsApp{" "}
              {siteConfig.phone.display}. É por ele que os pedidos previstos na LGPD são
              recebidos e respondidos, pelo próprio controlador.
            </li>
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
              Se você veio de um anúncio do Google, o identificador daquele clique — um código
              que liga a sua visita ao anúncio que a trouxe, sem dizer quem você é.
            </li>
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
            <li>
              Perfil de interesses para publicidade. Você não passa a ver anúncios deste
              consultório por ter visitado o site.
            </li>
          </ul>
          <p className="detail-desc">
            A medição registra que <em>alguém</em> clicou em um botão, não <em>quem</em> clicou.
          </p>

          <h2 className="detail-section-title">Para que serve</h2>
          <p className="detail-desc">
            Para entender quais assuntos interessam a quem visita o site, melhorar as páginas e
            o atendimento, e medir o resultado dos anúncios que trazem visitantes até aqui. Os
            relatórios usados são agregados, em números totais. Não há decisão automatizada
            sobre você e não há venda de dados.
          </p>
          <p className="detail-desc">
            Estes dados <strong>não</strong> são usados para exibir anúncios para você depois.
            Este site não monta listas de público para republicidade, nem mesmo quando você
            aceita — a permissão de personalização de anúncios permanece desativada.
          </p>
          <p className="detail-desc">Cada finalidade, com os dados que usa:</p>
          <ul className="benefit-list">
            <li>
              <strong>Entender como as páginas são usadas e melhorá-las</strong> — páginas
              abertas, botões e cards clicados, exibição da seção de resultados, tipo de
              aparelho e navegador.
            </li>
            <li>
              <strong>Saber de onde vêm as visitas</strong> — origem do acesso e, quando a
              visita chega por um anúncio do Google, o identificador daquele clique.
            </li>
            <li>
              <strong>Entender em que regiões e horários o site é procurado</strong> — região
              aproximada derivada do endereço de rede, data e hora do acesso.
            </li>
          </ul>
          <p className="detail-desc">
            As três se apoiam na mesma base legal: o seu consentimento.
          </p>

          <h2 className="detail-section-title">Base legal</h2>
          <p className="detail-desc">
            Seu consentimento, nos termos do artigo 7º, inciso I, da Lei Geral de Proteção de
            Dados (Lei 13.709/2018). É por isso que o aviso aparece antes de qualquer coleta,
            e é por isso que recusar não tira nenhuma funcionalidade do site.
          </p>
          <p className="detail-desc">
            O consentimento é livre: aceitar e recusar são apresentados com o mesmo destaque,
            o mesmo tamanho e a mesma facilidade de clique, e a recusa não abre nenhum pedido
            adicional. Revogar é tão simples quanto conceder, pelo botão da seção
            &ldquo;Como mudar ou revogar sua escolha&rdquo;.
          </p>

          <h2 className="detail-section-title">
            Com quem os dados são compartilhados e transferência internacional
          </h2>
          <p className="detail-desc">
            Com o Google LLC e suas afiliadas, que fornecem as ferramentas usadas aqui —
            Google Analytics, Google Tag Manager e Google Ads. O Google atua como operador
            desses dados, tratando-os conforme as instruções desta implantação. Nenhum outro
            terceiro recebe dados deste site, e não há venda de dados em nenhuma hipótese.
          </p>
          <p className="detail-desc">
            Esse processamento ocorre em servidores fora do Brasil, o que caracteriza
            transferência internacional nos termos dos artigos 33 a 36 da LGPD. Ela se apoia
            no seu consentimento e nas cláusulas de proteção de dados que constam dos termos
            dessas ferramentas, aceitos pelo controlador ao contratá-las.
          </p>

          <h2 className="detail-section-title">Por quanto tempo ficam guardados</h2>
          <p className="detail-desc">
            Os dados de navegação são retidos por 14 meses e depois excluídos automaticamente
            pela ferramenta de medição. Relatórios agregados, que não identificam ninguém,
            podem ser mantidos por mais tempo.
          </p>

          <h2 className="detail-section-title">Segurança da informação</h2>
          <p className="detail-desc">
            O site é servido por conexão criptografada (HTTPS). Os relatórios de medição ficam
            nas contas Google usadas nesta implantação, com acesso restrito ao controlador e
            ao responsável técnico. Como a coleta não registra nome, telefone, e-mail nem
            qualquer identificador pessoal, este site não forma nenhuma base de dados de
            pessoas — o que existe são números agregados.
          </p>

          <h2 className="detail-section-title">Crianças e adolescentes</h2>
          <p className="detail-desc">
            Os serviços apresentados aqui são destinados a maiores de 18 anos. O site não tem
            cadastro, formulário ativo nem área de login, e não coleta dados com a finalidade
            de atingir crianças ou adolescentes.
          </p>

          <h2 className="detail-section-title">Seus direitos</h2>
          <p className="detail-desc">
            O artigo 18 da LGPD garante a você, a qualquer momento:
          </p>
          <ul className="benefit-list">
            <li>Confirmar se existe tratamento de dados seus e acessar esses dados.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>
              Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou
              tratados fora da lei.
            </li>
            <li>Pedir a portabilidade dos dados a outro fornecedor.</li>
            <li>Pedir a eliminação dos dados tratados com base no seu consentimento.</li>
            <li>
              Saber com quais entidades públicas e privadas os dados foram compartilhados.
            </li>
            <li>
              Ser informado sobre a possibilidade de não consentir e sobre as consequências
              disso — que, aqui, são nenhuma: o site funciona igual.
            </li>
            <li>Revogar o consentimento.</li>
          </ul>
          <p className="detail-desc">
            Para exercer qualquer um deles, fale pelo WhatsApp {siteConfig.phone.display}.
            Vale saber: como a coleta não guarda nada que identifique você, na prática não é
            possível localizar &ldquo;os seus dados&rdquo; dentro do conjunto — o que existe são números
            agregados. A forma efetiva de interromper a coleta é revogar o consentimento.
          </p>
          <p className="detail-desc">
            Você também pode peticionar diretamente à Autoridade Nacional de Proteção de Dados
            (ANPD) se entender que seus direitos não foram atendidos.
          </p>

          <h2 className="detail-section-title">Como mudar ou revogar sua escolha</h2>
          <p className="detail-desc">
            Use o botão abaixo para reabrir o aviso e trocar sua resposta. A mudança vale
            imediatamente. Você também pode apagar os dados deste site pelo seu navegador, o
            que faz o aviso aparecer de novo na próxima visita.
          </p>
          <p className="detail-desc">
            Sua resposta fica guardada no seu próprio navegador, junto com a data e a versão
            do texto sobre o qual você decidiu. Ela não é enviada para nós nem para o Google:
            serve para o site saber se deve ou não medir, e para provar que a escolha foi sua.
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
