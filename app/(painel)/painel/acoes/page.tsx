import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Barras from "@/components/painel/Barras";
import Rodape from "@/components/painel/Rodape";
import { acoesComerciais } from "@/lib/painel/consultas";
import { sinaisPorExtenso } from "@/lib/painel/instancia";
import { n, pctCurto, plural, posicao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 2 — Ações comerciais.
// Pergunta que a página responde: onde e como as pessoas entram em contato?
// Indicadores 1, 2, 4, 5 e 14 de `08-matriz-do-dashboard.md`.
//
// A separação entre a primeira metade e a segunda é a regra 1 daquele
// documento aplicada ao desenho: ação importante em cima, marcada em índigo;
// sinais de contexto embaixo, marcados em ciano, sob um título que diz o que
// eles são. Não existe nenhum total somando os dois grupos, e não deve existir.
//
// O indicador 6 — Google Ads — saiu desta página para a página 4 pelo aditivo
// A2. Não o traga de volta: são dois documentos que passariam a discordar.

export default async function AcoesComerciais({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await acoesComerciais(periodo);

  const melhorBotao = dados.agendarPorPosicao[0];
  const maiorPonto = dados.whatsappPorPosicao[0];
  const foraDosBotoes = dados.cliquesWhatsapp - dados.totalAgendar;

  return (
    <>
      <Cabecalho atual="/painel/acoes" periodo={periodo} />

      <main className="pnl-largura">
        <div className="pnl-titulo">
          <h1>Onde as pessoas pedem contato</h1>
          <p>
            O site tem sete pontos que abrem o WhatsApp, e quatro deles são os
            botões escritos &ldquo;Agendar Avaliação&rdquo;. Esta tela mostra
            quais estão funcionando.
          </p>
        </div>

        <section className="pnl-secao">
          <h2>Ação importante — WhatsApp</h2>
          <p className="pnl-secao-nota">
            Total de <b>{n(dados.cliquesWhatsapp)}</b>{" "}
            {plural(dados.cliquesWhatsapp, "clique", "cliques")} no período. As
            duas listas abaixo olham o mesmo total por ângulos diferentes —{" "}
            <b>não as some</b>.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <div className="pnl-cartao pnl-cartao-acao">
              <p className="pnl-cartao-rotulo">
                <span className="pnl-ponto pnl-ponto-acao" aria-hidden="true" />
                Botões &ldquo;Agendar Avaliação&rdquo;
              </p>
              <Barras
                itens={dados.agendarPorPosicao.map((i) => ({
                  nome: posicao(i.posicao),
                  valor: i.cliques,
                }))}
                tom="acao"
                total={dados.totalAgendar}
                vazio="Nenhum clique nos botões de agendamento no período."
              />
              {melhorBotao ? (
                <p className="pnl-leitura">
                  <b>{posicao(melhorBotao.posicao)}</b> é o botão que mais
                  converte convite em clique. Se for para reforçar o argumento em
                  um lugar só do site, é ali que ele já está sendo lido.
                </p>
              ) : null}
              <p className="pnl-limite">
                São só os quatro botões escritos &ldquo;Agendar
                Avaliação&rdquo;. Serve para comparar em que ponto da página o
                convite funciona melhor — não para somar com a lista ao lado,
                que já os inclui.
              </p>
            </div>

            <div className="pnl-cartao pnl-cartao-acao">
              <p className="pnl-cartao-rotulo">
                <span className="pnl-ponto pnl-ponto-acao" aria-hidden="true" />
                Todos os pontos de WhatsApp
              </p>
              <Barras
                itens={dados.whatsappPorPosicao.map((i) => ({
                  nome: posicao(i.posicao),
                  valor: i.cliques,
                }))}
                tom="acao"
                total={dados.cliquesWhatsapp}
                vazio="Nenhum clique no WhatsApp no período."
              />
              {maiorPonto && dados.cliquesWhatsapp > 0 ? (
                <p className="pnl-leitura">
                  <b>
                    {pctCurto(foraDosBotoes, dados.cliquesWhatsapp)} dos pedidos
                    de contato vêm de fora dos botões de agendamento
                  </b>{" "}
                  — do menu, do rodapé, do botão flutuante. Quem chega por ali
                  já decidiu falar antes de encontrar o convite.
                </p>
              ) : null}
              <p className="pnl-limite">
                O botão flutuante costuma concentrar volume por estar sempre
                visível na tela. Isso não quer dizer que o argumento daquele
                ponto convence mais.
              </p>
            </div>
          </div>
        </section>

        <section className="pnl-secao">
          <h2>Sinais de contexto</h2>
          <p className="pnl-secao-nota">
            Mostram interesse, mas <b>não</b> são pedido de contato. Estão
            marcados em azul-ciano porque não se somam à ação importante nem
            entram na taxa da primeira página.
          </p>

          <div className="pnl-grade pnl-grade-3">
            <Cartao
              rotulo="Cliques no Instagram"
              valor={n(dados.instagram)}
              tom="contexto"
              limite="Mede a saída do site para o perfil. Não diz se a pessoa passou a seguir o perfil."
            />
            <Cartao
              rotulo="Cliques no endereço"
              valor={n(dados.endereco)}
              tom="contexto"
              limite="Mede quem abriu o mapa. Não prova visita ao consultório."
            />
            <Cartao
              rotulo="Cliques para o Grupo VIP"
              valor={n(dados.grupoVip)}
              tom="contexto"
              limite="Cliques para o Grupo VIP, e não entradas no grupo. Quem entrou de fato só o WhatsApp mostra."
            />
          </div>

          <div className="pnl-cartao pnl-cartao-contexto" style={{ marginTop: 12 }}>
            <p className="pnl-cartao-rotulo">
              <span className="pnl-ponto pnl-ponto-contexto" aria-hidden="true" />
              Instagram, por posição
            </p>
            <Barras
              itens={dados.instagramPorPosicao.map((i) => ({
                nome: posicao(i.posicao),
                valor: i.cliques,
              }))}
              tom="contexto"
              total={dados.instagram}
              vazio="Nenhum clique para o Instagram no período."
            />
            <p className="pnl-limite">
              De que ponto do site saem as pessoas que vão ver o perfil.
              Continua sendo sinal de contexto, em qualquer posição. Somar
              estes cliques aos de {sinaisPorExtenso()} e ao WhatsApp
              produziria um número que não corresponde a nada.
            </p>
          </div>
        </section>
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
