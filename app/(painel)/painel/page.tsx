import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Barras from "@/components/painel/Barras";
import Rodape from "@/components/painel/Rodape";
import Tendencia from "@/components/painel/Tendencia";
import { visaoGeral } from "@/lib/painel/consultas";
import { n, pct, variacao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 1 — Visão geral.
// Pergunta que a página responde: o site está trazendo gente e gerando contato?
// Indicadores 10, 2 e 7 de `08-matriz-do-dashboard.md`.

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

  return (
    <>
      <Cabecalho atual="/painel" periodo={periodo} />

      <main className="pnl-largura">
        {/* Regra 4 de `08-matriz-do-dashboard.md`: o aviso de consentimento é
            obrigatório na primeira página. Sem ele, o cliente compara os
            números com o movimento real do consultório e conclui que a medição
            está errada. */}
        <div className="pnl-aviso">
          <b>Estes números representam quem aceitou a medição.</b> O site pergunta
          a cada visitante se ele autoriza a coleta. Quem recusa não aparece em
          nenhum número desta tela. O total real de visitas é maior do que o
          exibido aqui, e isso é exigência da lei, não falha da medição.
        </div>

        <section className="pnl-secao">
          <h2>Alcance no período</h2>
          <p className="pnl-secao-nota">
            Quantas pessoas o site alcançou nos últimos {periodo.dias} dias.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <Cartao
              rotulo="Usuários ativos"
              valor={n(dados.usuariosAtivos)}
              tom="neutro"
              limite="Não é o número de pessoas diferentes. Quem visita do celular e depois do computador conta duas vezes."
            />
            <Cartao
              rotulo="Sessões"
              valor={n(dados.sessoes)}
              tom="neutro"
              comparacao={
                variacaoSessoes ? (
                  <>
                    <b>{variacaoSessoes}</b> em relação aos {periodo.dias} dias
                    anteriores
                  </>
                ) : undefined
              }
              limite="Uma sessão é uma visita. A mesma pessoa pode gerar várias. É o denominador de todas as taxas desta tela."
            >
              <Tendencia serie={dados.serie} />
            </Cartao>
          </div>
        </section>

        <section className="pnl-secao">
          <h2>Contato gerado</h2>
          <p className="pnl-secao-nota">
            A única ação importante desta implantação é o clique que abre o
            WhatsApp.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <Cartao
              rotulo="Cliques no WhatsApp"
              valor={n(dados.cliquesWhatsapp)}
              tom="acao"
              comparacao={
                variacaoWhatsapp ? (
                  <>
                    <b>{variacaoWhatsapp}</b> em relação aos {periodo.dias} dias
                    anteriores
                  </>
                ) : undefined
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
                  sessões
                </>
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
          WhatsApp — de qualquer ponto do site. Cliques no Instagram, no endereço
          e no Grupo VIP são <b>sinais de contexto</b>: dizem que a pessoa se
          interessou, mas não que ela procurou contato. Eles aparecem em verde
          claro nas outras páginas e <b>nunca se somam</b> à ação importante.
        </div>

        <section className="pnl-secao">
          <h2>De onde vem quem chega</h2>
          <p className="pnl-secao-nota">
            Canal de origem das sessões no período.
          </p>
          <div className="pnl-cartao">
            <Barras
              itens={dados.canais.map((c) => ({
                nome: c.canal === "(not set)" ? "Origem não identificada" : c.canal,
                valor: c.sessoes,
              }))}
              tom="acao"
              vazio="Nenhuma sessão registrada no período."
            />
            <p className="pnl-limite">
              É a origem da visita, não da pessoa. Quem chega hoje pela busca e
              volta amanhã pelo Instagram aparece nas duas linhas.
            </p>
          </div>
        </section>
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
