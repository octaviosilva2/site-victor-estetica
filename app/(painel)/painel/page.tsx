import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Rosca from "@/components/painel/Rosca";
import Rodape from "@/components/painel/Rodape";
import Tendencia from "@/components/painel/Tendencia";
import { visaoGeral } from "@/lib/painel/consultas";
import { INSTANCIA, sinaisPorExtenso } from "@/lib/painel/instancia";
import { canal, n, pct, plural, variacao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 1 — Visão geral.
// Pergunta que a página responde: o site está trazendo gente e gerando contato?
// Indicadores 10, 2 e 7 de `08-matriz-do-dashboard.md`.
//
// A ordem da tela responde a pergunta na ordem em que ela importa: o contato
// primeiro, o alcance depois, a origem por último. Uma pilha de cartões de
// igual peso obriga o leitor a descobrir sozinho por onde começar.

export default async function VisaoGeral({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  // Primeira linha, sempre. Nada é consultado antes de saber quem está lendo.
  await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await visaoGeral(periodo);

  const taxa = pct(dados.sessoesComWhatsapp, dados.sessoes);
  const variacaoSessoes = variacao(dados.sessoes, dados.sessoesAnterior);
  const variacaoWhatsapp = variacao(
    dados.cliquesWhatsapp,
    dados.cliquesWhatsappAnterior,
  );

  // Quantas visitas, em média, para cada pedido de contato. É a mesma taxa
  // dita ao contrário — e "a cada 12 visitas, uma conversa" é uma frase que o
  // cliente usa, enquanto "8,3%" é uma que ele precisa converter na cabeça.
  const visitasPorAcao =
    dados.sessoesComWhatsapp > 0
      ? Math.round(dados.sessoes / dados.sessoesComWhatsapp)
      : 0;

  const maiorCanal = dados.canais[0];

  return (
    <>
      <Cabecalho atual="/painel" periodo={periodo} />

      <main className="pnl-largura">
        <div className="pnl-titulo">
          <h1>O site está gerando contato?</h1>
          <p>
            A única ação importante desta implantação é o clique que abre o
            WhatsApp. Tudo nesta tela existe para responder se ele está
            acontecendo, e em que proporção.
          </p>
        </div>

        {/* Regra 4 de `08-matriz-do-dashboard.md`: o aviso de consentimento é
            obrigatório na primeira página. Sem ele, o cliente compara os
            números com o movimento real do consultório e conclui que a medição
            está errada. */}
        <div className="pnl-aviso">
          <b>Estes números representam quem aceitou a medição.</b> O site
          pergunta a cada visitante se ele autoriza a coleta. Quem recusa não
          aparece em nenhum número desta tela. O total real de visitas é maior
          do que o exibido aqui, e isso é exigência da lei, não falha da
          medição.
        </div>

        <section className="pnl-secao">
          <h2>Contato gerado</h2>
          <p className="pnl-secao-nota">
            {INSTANCIA.acaoImportante.oQueE}.
          </p>

          <div className="pnl-grade pnl-grade-destaque">
            <Cartao
              rotulo={INSTANCIA.acaoImportante.nome}
              valor={n(dados.cliquesWhatsapp)}
              tom="acao"
              destaque
              comparacao={
                variacaoWhatsapp ? (
                  <>
                    <b
                      className={
                        variacaoWhatsapp.startsWith("-") ? "pnl-desce" : "pnl-sobe"
                      }
                    >
                      {variacaoWhatsapp}
                    </b>{" "}
                    em relação ao período anterior, que teve{" "}
                    {n(dados.cliquesWhatsappAnterior)}
                  </>
                ) : (
                  <>Ainda não há período anterior com dado para comparar.</>
                )
              }
              leitura={
                dados.cliquesWhatsapp === 0 ? (
                  <>
                    <b>Ninguém saiu do site para o WhatsApp neste período.</b> Se
                    houve movimento no consultório, ele veio por outro caminho —
                    e o site ainda não está participando dessa conversa.
                  </>
                ) : (
                  <>
                    <b>
                      {n(dados.cliquesWhatsapp)}{" "}
                      {plural(dados.cliquesWhatsapp, "pessoa saiu", "vezes alguém saiu")}{" "}
                      do site para o WhatsApp.
                    </b>{" "}
                    A próxima pergunta é <b>de onde</b> esses cliques vieram — a
                    aba Ações comerciais abre por posição na página e mostra qual
                    convite está funcionando.
                  </>
                )
              }
              limite="Clique não é conversa iniciada, nem agendamento confirmado. Mede quantas vezes alguém saiu do site para o WhatsApp."
            />

            <Cartao
              rotulo="Taxa de ações importantes"
              valor={taxa}
              tom="acao"
              comparacao={
                <>
                  <b>{n(dados.sessoesComWhatsapp)}</b> de {n(dados.sessoes)}{" "}
                  {plural(dados.sessoes, "visita", "visitas")}
                </>
              }
              leitura={
                visitasPorAcao > 0 ? (
                  <>
                    Hoje, a cada <b>{n(visitasPorAcao)} visitas</b> ao site, uma
                    termina em pedido de contato.
                  </>
                ) : undefined
              }
              limite="Não é taxa de venda nem de agendamento. Cliques no Instagram, no endereço e no Grupo VIP não entram nesta conta."
            />
          </div>
        </section>

        {/* Bloco de contexto fixo, exigido pela matriz: o que conta como ação
            importante nesta implantação. É texto, não número, e não muda com o
            período. */}
        <div className="pnl-aviso">
          <b>O que conta como ação importante.</b> Só o clique que abre o
          WhatsApp — de qualquer ponto do site. Cliques em {sinaisPorExtenso()}{" "}
          são <b>sinais de contexto</b>: dizem que a pessoa se interessou, mas
          não que ela procurou contato. Eles aparecem marcados em azul-ciano nas
          outras páginas e <b>nunca se somam</b> à ação importante.
        </div>

        <section className="pnl-secao">
          <h2>Quanta gente o site alcançou</h2>
          <p className="pnl-secao-nota">
            É a base de comparação de todas as taxas do painel.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <Cartao
              rotulo="Visitas ao site"
              valor={n(dados.sessoes)}
              comparacao={
                variacaoSessoes ? (
                  <>
                    <b
                      className={
                        variacaoSessoes.startsWith("-") ? "pnl-desce" : "pnl-sobe"
                      }
                    >
                      {variacaoSessoes}
                    </b>{" "}
                    em relação ao período anterior, que teve{" "}
                    {n(dados.sessoesAnterior)}
                  </>
                ) : (
                  <>Ainda não há período anterior com dado para comparar.</>
                )
              }
              limite="Uma visita é uma sessão: a mesma pessoa pode gerar várias em dias diferentes. É o denominador de todas as taxas desta tela."
            >
              <Tendencia serie={dados.serie} />
            </Cartao>

            <Cartao
              rotulo="Usuários ativos"
              valor={n(dados.usuariosAtivos)}
              limite="Não é o número de pessoas diferentes. Quem visita do celular e depois do computador conta duas vezes."
            />
          </div>
        </section>

        <section className="pnl-secao">
          <h2>De onde vem quem chega</h2>
          <p className="pnl-secao-nota">
            Canal de origem das visitas no período.
          </p>
          <div className="pnl-cartao">
            <Rosca
              itens={dados.canais.map((c) => ({
                nome: canal(c.canal),
                valor: c.sessoes,
              }))}
              rotuloCentro="visitas"
              vazio="Nenhuma visita registrada no período."
            />
            {maiorCanal ? (
              <p className="pnl-leitura">
                <b>{canal(maiorCanal.canal)}</b> é hoje o maior caminho até o
                site. Se a intenção for crescer, é onde já existe tração; se for
                reduzir dependência, é o que precisa de alternativa.
              </p>
            ) : null}
            <p className="pnl-limite">
              É a origem da visita, não da pessoa. Quem chega hoje pela busca e
              volta amanhã pelo Instagram aparece nas duas fatias. &ldquo;Acesso
              direto&rdquo; quer dizer que o navegador não informou a origem —
              link salvo, endereço digitado ou aplicativo de mensagem.
            </p>
          </div>
        </section>
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
