import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Rodape from "@/components/painel/Rodape";
import { googleAds } from "@/lib/painel/consultas";
import { brl, n, pct, plural } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 4 — Google Ads.
// Pergunta que a página responde: a campanha está indo bem?
// Indicadores 6, 15, 16, 17, 18 e 19 de `08-matriz-do-dashboard.md`.
//
// Entrou pelo **aditivo A2**, seção 13 de `05-escopo-contratado.md`. Antes
// dele, o Google Ads era um bloco no rodapé da página 2, e o indicador 6 vivia
// lá. O indicador é o mesmo, com o mesmo cálculo, em outro lugar.
//
// **A página aparece mesmo sem veiculação**, com a mensagem de espera. Nunca
// escondida — esconder faria parecer que a integração não existe — e nunca
// preenchida com estimativa. Um zero aqui significaria "anunciou e não deu
// resultado", que não é o caso enquanto nenhuma campanha rodou.

export default async function GoogleAds({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await googleAds(periodo);

  // "Veiculou" é ter trazido visita ou ter custado dinheiro. As duas coisas
  // vêm de fontes diferentes e qualquer uma delas basta para a página ter o
  // que mostrar.
  const veiculou = dados.sessoes > 0 || (dados.investimento ?? 0) > 0;

  const custoPorAcao =
    dados.investimento !== null && dados.acoes > 0
      ? dados.investimento / dados.acoes
      : null;

  const taxaPaga = pct(dados.sessoesComAcao, dados.sessoes);
  const taxaNaoPaga = pct(dados.naoPago.sessoesComAcao, dados.naoPago.sessoes);

  return (
    <>
      <Cabecalho atual="/painel/ads" periodo={periodo} />

      <main className="pnl-largura">
        <div className="pnl-titulo">
          <h1>A campanha está indo bem?</h1>
          <p>
            Tudo o que vem de anúncio pago, separado do resto do site. O que
            entra aqui não some da primeira página — são as mesmas visitas,
            olhadas por origem.
          </p>
        </div>

        {!veiculou ? (
          <>
            <div className="pnl-aviso pnl-aviso-espera">
              <b>Aguardando veiculação.</b> A conta do Google Ads está vinculada
              e a marcação automática está ativa, então tudo o que for investido
              aparecerá aqui sozinho. Até agora nenhuma campanha veiculou no
              período escolhido. Enquanto isso, não há nada a mostrar — e um
              zero nestes cartões significaria &ldquo;anunciou e não deu
              resultado&rdquo;, que não é o caso.
            </div>

            <div className="pnl-aviso">
              <b>O que esta página vai responder quando houver campanha.</b>{" "}
              Quanto foi investido, quantas pessoas o anúncio trouxe, quanto
              custou cada uma delas, quantos pedidos de contato vieram daí e a
              que custo — e se quem chega por anúncio pede contato mais ou menos
              do que quem chega pelo resto do site.
            </div>
          </>
        ) : (
          <>
            <section className="pnl-secao">
              <h2>O que o investimento gerou</h2>
              <p className="pnl-secao-nota">
                A ação importante continua sendo a mesma do resto do painel: o
                clique que abre o WhatsApp.
              </p>

              <div className="pnl-grade pnl-grade-destaque">
                <Cartao
                  rotulo="Ações vindas de anúncio"
                  valor={n(dados.acoes)}
                  tom="acao"
                  destaque
                  comparacao={
                    <>
                      de <b>{n(dados.sessoes)}</b>{" "}
                      {plural(dados.sessoes, "visita paga", "visitas pagas")} no
                      período
                    </>
                  }
                  leitura={
                    custoPorAcao !== null ? (
                      <>
                        Cada pedido de contato vindo de anúncio custou{" "}
                        <b>{brl(custoPorAcao)}</b>. Compare com o que vale uma
                        avaliação no consultório — é essa conta, e não o custo
                        por clique, que diz se a campanha se paga.
                      </>
                    ) : dados.acoes === 0 ? (
                      <>
                        <b>
                          O anúncio trouxe visita, mas nenhuma virou pedido de
                          contato.
                        </b>{" "}
                        O problema não está em atrair — está no que a pessoa
                        encontra depois do clique.
                      </>
                    ) : undefined
                  }
                  limite="Custo por ação não é custo por paciente. Mede o valor investido dividido pelos cliques no WhatsApp, e a atribuição do Google Ads pode levar dias para fechar."
                />

                <Cartao
                  rotulo="Investimento no período"
                  valor={
                    dados.investimento === null ? "—" : brl(dados.investimento)
                  }
                  limite={
                    dados.custoIndisponivel
                      ? "A plataforma não está devolvendo o investimento neste momento. O campo fica vazio em vez de estimado — um zero aqui diria que nada foi gasto."
                      : "Vem do vínculo com o Google Ads. Se o vínculo cair, esta métrica some, inclusive para períodos passados."
                  }
                />
              </div>
            </section>

            <section className="pnl-secao">
              <h2>O anúncio sendo visto e clicado</h2>
              <p className="pnl-secao-nota">
                O caminho antes do site: quantas vezes o anúncio apareceu e
                quantas alguém clicou nele.
              </p>

              <div className="pnl-grade pnl-grade-3">
                <Cartao
                  rotulo="Cliques no anúncio"
                  valor={
                    dados.cliquesNoAnuncio === null
                      ? "—"
                      : n(dados.cliquesNoAnuncio)
                  }
                  limite="Clique no anúncio não é visita ao site. Quem clica e fecha antes de a página carregar conta aqui e não conta lá — a diferença entre os dois números é normal."
                />
                <Cartao
                  rotulo="Impressões"
                  valor={dados.impressoes === null ? "—" : n(dados.impressoes)}
                  limite="Quantas vezes o anúncio apareceu na tela de alguém. Não quer dizer que foi lido."
                />
                <Cartao
                  rotulo="Custo por clique"
                  valor={
                    dados.custoPorClique === null
                      ? "—"
                      : brl(dados.custoPorClique)
                  }
                  limite="É o custo de trazer uma pessoa até o site, e não o de gerar um contato. O que decide investimento é o custo por ação, no cartão acima."
                />
              </div>
            </section>

            <section className="pnl-secao">
              <h2>Anúncio contra o resto do site</h2>
              <p className="pnl-secao-nota">
                A mesma taxa da primeira página, calculada em separado para cada
                origem.
              </p>

              <div className="pnl-grade pnl-grade-2">
                <Cartao
                  rotulo="Taxa de ação — vindo de anúncio"
                  valor={taxaPaga}
                  tom="acao"
                  comparacao={
                    <>
                      <b>{n(dados.sessoesComAcao)}</b> de {n(dados.sessoes)}{" "}
                      {plural(dados.sessoes, "visita", "visitas")}
                    </>
                  }
                  limite="Não é taxa de venda. Em volume baixo, uma ação a mais move esta taxa dezenas de pontos — leia a tendência ao longo de meses, nunca a semana."
                />
                <Cartao
                  rotulo="Taxa de ação — resto do site"
                  valor={taxaNaoPaga}
                  comparacao={
                    <>
                      <b>{n(dados.naoPago.sessoesComAcao)}</b> de{" "}
                      {n(dados.naoPago.sessoes)}{" "}
                      {plural(dados.naoPago.sessoes, "visita", "visitas")}
                    </>
                  }
                  limite="Busca, redes sociais, acesso direto e links de outros sites, somados. Serve de referência para a taxa ao lado, não de meta."
                />
              </div>

              <div className="pnl-aviso pnl-aviso-atencao">
                <b>Como comparar as duas taxas sem se enganar.</b> Elas se
                calculam sobre bases de tamanhos muito diferentes. Uma taxa paga
                alta com dez visitas não é melhor que uma taxa menor com
                trezentas — é menos conhecida. A comparação só começa a
                significar alguma coisa depois de algumas centenas de visitas de
                cada lado.
              </div>
            </section>

            <section className="pnl-secao">
              <h2>Campanha a campanha</h2>
              {dados.campanhas.length === 0 ? (
                <p className="pnl-vazio">
                  Nenhuma campanha identificada no período.
                </p>
              ) : (
                <div className="pnl-cartao">
                  <div className="pnl-rolagem">
                    <table className="pnl-tabela">
                      <thead>
                        <tr>
                          <th scope="col">Campanha</th>
                          <th scope="col" className="num">
                            Visitas
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
                        {dados.campanhas.map((campanha) => (
                          <tr key={campanha.campanha}>
                            <td>{campanha.campanha}</td>
                            <td className="num">{n(campanha.sessoes)}</td>
                            <td className="num">{n(campanha.acoes)}</td>
                            <td className="num">
                              {campanha.custo === null
                                ? "—"
                                : brl(campanha.custo)}
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
                    Campanha nova leva dias para acumular dado suficiente para
                    dizer alguma coisa. Pausar uma campanha na primeira semana
                    de números ruins costuma ser decidir sobre ruído.
                    {dados.custoIndisponivel
                      ? " O investimento não está sendo devolvido pela plataforma neste momento; as colunas de valor aparecem vazias em vez de estimadas."
                      : ""}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
