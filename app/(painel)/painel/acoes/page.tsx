import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Barras from "@/components/painel/Barras";
import Rodape from "@/components/painel/Rodape";
import { acoesComerciais } from "@/lib/painel/consultas";
import { brl, n, posicao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 2 — Ações comerciais.
// Pergunta que a página responde: onde e como as pessoas entram em contato?
// Indicadores 1, 2, 4, 5, 14 e 6 de `08-matriz-do-dashboard.md`.
//
// A separação visual entre a primeira metade e a segunda é a regra 1 daquele
// documento aplicada ao desenho: ação importante em cima, em verde escuro;
// sinais de contexto embaixo, em verde claro, sob um título que diz o que eles
// são. Não existe nenhum total somando os dois grupos, e não deve existir.

export default async function AcoesComerciais({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await acoesComerciais(periodo);

  return (
    <>
      <Cabecalho atual="/painel/acoes" periodo={periodo} />

      <main className="pnl-largura">
        <section className="pnl-secao">
          <h2>Ação importante — WhatsApp</h2>
          <p className="pnl-secao-nota">
            Onde estão os cliques que abrem uma conversa. Total de{" "}
            <b>{n(dados.cliquesWhatsapp)}</b> no período.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <div className="pnl-cartao">
              <p className="pnl-cartao-rotulo">
                Agendar Avaliação, por posição
              </p>
              <Barras
                itens={dados.agendarPorPosicao.map((i) => ({
                  nome: posicao(i.posicao),
                  valor: i.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique nos botões de agendamento no período."
              />
              <p className="pnl-limite">
                São só os quatro botões escritos &ldquo;Agendar Avaliação&rdquo;.
                Serve para comparar em que ponto da página o convite funciona
                melhor — não para somar com a lista ao lado, que já os inclui.
              </p>
            </div>

            <div className="pnl-cartao">
              <p className="pnl-cartao-rotulo">
                Todos os cliques no WhatsApp, por posição
              </p>
              <Barras
                itens={dados.whatsappPorPosicao.map((i) => ({
                  nome: posicao(i.posicao),
                  valor: i.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique no WhatsApp no período."
              />
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
            Mostram interesse, mas <b>não</b> são pedido de contato. Estão em
            verde claro porque não se somam à ação importante nem entram na taxa
            da primeira página.
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

          <div className="pnl-cartao" style={{ marginTop: 12 }}>
            <p className="pnl-cartao-rotulo">Instagram, por posição</p>
            <Barras
              itens={dados.instagramPorPosicao.map((i) => ({
                nome: posicao(i.posicao),
                valor: i.cliques,
              }))}
              tom="contexto"
              vazio="Nenhum clique para o Instagram no período."
            />
            <p className="pnl-limite">
              De que ponto do site saem as pessoas que vão ver o perfil.
              Continua sendo sinal de contexto, em qualquer posição.
            </p>
          </div>
        </section>

        <section className="pnl-secao">
          <h2>Google Ads</h2>
          <p className="pnl-secao-nota">
            Ações que vieram de anúncio pago.
          </p>

          {dados.ads.campanhas.length === 0 ? (
            // O bloco aparece mesmo sem dado, por determinação da matriz:
            // esconder faria parecer que a integração não existe, e preencher
            // com estimativa seria inventar número.
            <div className="pnl-aviso pnl-aviso-espera">
              <b>Aguardando veiculação.</b> A conta do Google Ads está vinculada
              e a marcação automática está ativa, então tudo o que for investido
              aparecerá aqui. Até agora nenhuma campanha veiculou — uma está
              pausada e a outra está com os anúncios reprovados. Enquanto isso,
              não há nada a mostrar, e um zero aqui significaria &ldquo;anunciou
              e não deu resultado&rdquo;, que não é o caso.
            </div>
          ) : (
            <div className="pnl-cartao">
              <div className="pnl-rolagem">
                <table className="pnl-tabela">
                  <thead>
                    <tr>
                      <th scope="col">Campanha</th>
                      <th scope="col" className="num">
                        Sessões
                      </th>
                      <th scope="col" className="num">
                        Ações
                      </th>
                      <th scope="col" className="num">
                        Investimento
                      </th>
                      <th scope="col" className="num">
                        Custo por ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.ads.campanhas.map((campanha) => (
                      <tr key={campanha.campanha}>
                        <td>{campanha.campanha}</td>
                        <td className="num">{n(campanha.sessoes)}</td>
                        <td className="num">{n(campanha.acoes)}</td>
                        <td className="num">
                          {campanha.custo === null ? "—" : brl(campanha.custo)}
                        </td>
                        <td className="num">
                          {campanha.custo === null || campanha.acoes === 0
                            ? "—"
                            : brl(campanha.custo / campanha.acoes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="pnl-limite">
                Custo por ação é o valor investido dividido pelos cliques no
                WhatsApp — <b>não</b> é custo por paciente. A atribuição do
                Google Ads pode levar dias para fechar, então os números mais
                recentes ainda mudam.
                {dados.ads.custoIndisponivel
                  ? " O investimento não está sendo devolvido pela plataforma neste momento; as colunas de valor aparecem vazias em vez de estimadas."
                  : ""}
              </p>
            </div>
          )}
        </section>
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
