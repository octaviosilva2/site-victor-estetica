import Barras from "@/components/painel/Barras";
import Cartao from "@/components/painel/Cartao";
import Estrutura from "@/components/painel/Estrutura";
import FilaKpi, { type ItemKpi } from "@/components/painel/Kpi";
import Funil from "@/components/painel/Funil";
import Rodape from "@/components/painel/Rodape";
import TituloDaPagina from "@/components/painel/TituloDaPagina";
import { acoesComerciais } from "@/lib/painel/consultas";
import { INSTANCIA, sinaisPorExtenso } from "@/lib/painel/instancia";
import { n, pct, pctCurto, plural, posicao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 2 — Ações comerciais.
// Pergunta que a página responde: onde e como as pessoas entram em contato?
// Indicadores 1, 2, 4, 5 e 14 de `08-matriz-do-dashboard.md`.
//
// A separação entre a primeira metade e a segunda é a regra 1 daquele documento
// aplicada ao desenho: ação importante em cima, marcada em azul; sinais de
// contexto embaixo, marcados em violeta, sob um título que diz o que eles são.
// Não existe nenhum total somando os dois grupos, e não deve existir.
//
// O indicador 6 — Google Ads — saiu desta página para a página 4 pelo aditivo
// A2. Não o traga de volta: são dois documentos que passariam a discordar.

export default async function AcoesComerciais({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { email } = await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await acoesComerciais(periodo);

  const melhorBotao = dados.agendarPorPosicao[0];
  const foraDosBotoes = dados.cliquesWhatsapp - dados.totalAgendar;
  const maiorOrigem = dados.acoesPorOrigem[0];

  const kpis: ItemKpi[] = [
    {
      rotulo: INSTANCIA.acaoImportante.nome,
      valor: n(dados.cliquesWhatsapp),
      tom: "acao",
      nota: "todos os sete pontos do site",
      limite: `Clique não é ${INSTANCIA.acaoImportante.oQueNaoE}. Mede quantas vezes alguém saiu do site para o WhatsApp.`,
    },
    {
      rotulo: "Taxa de ação importante",
      valor: pct(dados.sessoesComWhatsapp, dados.sessoes),
      tom: "acao",
      nota: `${n(dados.sessoesComWhatsapp)} de ${n(dados.sessoes)} ${plural(
        dados.sessoes,
        "visita",
        "visitas",
      )}`,
      limite:
        "Conta visitas em que houve ao menos um clique, e não cliques. Uma pessoa que clica três vezes na mesma visita conta uma vez aqui e três no cartão ao lado.",
    },
    {
      rotulo: "Botões “Agendar Avaliação”",
      valor: n(dados.totalAgendar),
      tom: "acao",
      nota: `${pctCurto(dados.totalAgendar, dados.cliquesWhatsapp)} de todos os cliques`,
      limite:
        "São só os quatro botões escritos “Agendar Avaliação”. Serve para comparar em que ponto da página o convite funciona — não para somar com o total, que já os inclui.",
    },
    {
      rotulo: "Contato fora dos botões",
      valor: n(Math.max(foraDosBotoes, 0)),
      tom: "acao",
      nota: `${pctCurto(Math.max(foraDosBotoes, 0), dados.cliquesWhatsapp)} de todos os cliques`,
      limite:
        "Cliques no menu, no rodapé e no botão flutuante. Quem chega por ali já tinha decidido falar antes de encontrar um convite escrito.",
    },
  ];

  return (
    <Estrutura usuario={email} periodo={periodo}>
      <TituloDaPagina
        secao="Ações comerciais"
        titulo="Onde as pessoas pedem contato"
        descricao="O site tem sete pontos que abrem o WhatsApp, e quatro deles são os botões escritos “Agendar Avaliação”. Esta tela mostra quais estão funcionando."
        periodo={periodo}
        geradoEm={dados.geradoEm}
      />

      <FilaKpi itens={kpis} colunas={4} />

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Botões “Agendar Avaliação”, por posição na página"
          nota="Os quatro convites escritos, comparados entre si"
          tom="acao"
          leitura={
            melhorBotao ? (
              <>
                <b>{posicao(melhorBotao.posicao)}</b> é o botão que mais converte
                convite em clique. Se for para reforçar o argumento em um lugar só
                do site, é ali que ele já está sendo lido.
              </>
            ) : undefined
          }
          limite="São só os quatro botões de agendamento. Não some esta lista com a de todos os pontos: aquela já inclui estes quatro."
        >
          <Barras
            itens={dados.agendarPorPosicao.map((i) => ({
              nome: posicao(i.posicao),
              valor: i.cliques,
            }))}
            tom="acao"
            total={dados.totalAgendar}
            vazio="Nenhum clique nos botões de agendamento no período."
          />
        </Cartao>

        <Cartao
          titulo="Todos os pontos de WhatsApp"
          nota="Os sete lugares do site que abrem uma conversa"
          tom="acao"
          leitura={
            dados.cliquesWhatsapp > 0 ? (
              <>
                <b>
                  {pctCurto(Math.max(foraDosBotoes, 0), dados.cliquesWhatsapp)} dos
                  pedidos de contato vêm de fora dos botões de agendamento
                </b>{" "}
                — do menu, do rodapé, do botão flutuante.
              </>
            ) : undefined
          }
          limite="O botão flutuante costuma concentrar volume por estar sempre visível na tela. Isso não quer dizer que o argumento daquele ponto convence mais."
        >
          <Barras
            itens={dados.whatsappPorPosicao.map((i) => ({
              nome: posicao(i.posicao),
              valor: i.cliques,
            }))}
            tom="acao"
            total={dados.cliquesWhatsapp}
            vazio="Nenhum clique no WhatsApp no período."
          />
        </Cartao>

        <Cartao
          titulo="De onde vem quem pede contato"
          nota="Origem da visita que terminou em clique no WhatsApp"
          tom="acao"
          leitura={
            maiorOrigem ? (
              <>
                <b>{maiorOrigem.origem}</b> é a origem que mais gera pedido de
                contato. É onde o investimento já está se pagando.
              </>
            ) : undefined
          }
          limite="É a origem da visita, não a origem da pessoa. Quem descobre o site pelo Instagram e volta pela busca aparece na busca."
        >
          <Barras
            itens={dados.acoesPorOrigem.map((o) => ({
              nome: o.origem,
              valor: o.cliques,
            }))}
            tom="acao"
            total={dados.cliquesWhatsapp}
            vazio="Nenhum clique no WhatsApp no período."
          />
        </Cartao>
      </div>

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Do primeiro acesso ao pedido de contato"
          nota="Quatro recortes do mesmo período, do mais amplo ao mais próximo do contato"
          largura={2}
          tom="acao"
          etiqueta={
            <span className="chip acao">
              Taxa de ação · {pct(dados.sessoesComWhatsapp, dados.sessoes)}
            </span>
          }
          limite="Não é um caminho obrigatório. Ninguém precisa clicar num card para depois abrir o WhatsApp, e muita gente vai direto. São quatro recortes independentes do mesmo período, ordenados por proximidade do contato — nenhum deles é um passo que a pessoa tenha de dar antes do seguinte."
        >
          <Funil
            etapas={[
              {
                nome: "Visitas",
                descricao: "entraram no site",
                valor: dados.sessoes,
              },
              {
                nome: "Clicaram em algum card",
                descricao: "procedimento ou área",
                valor: dados.cliquesEmCards,
              },
              {
                nome: "Chegaram aos resultados",
                descricao: "viram a seção de antes e depois",
                valor: dados.sessoesComResultados,
              },
              {
                nome: "Pediram contato",
                descricao: "visitas com clique no WhatsApp",
                valor: dados.sessoesComWhatsapp,
              },
            ]}
          />
        </Cartao>

        <Cartao
          titulo="Sinais de contexto"
          nota="Mostram interesse. Não são pedido de contato"
          tom="contexto"
          limite={`Nenhum destes números entra na taxa de ação importante, e nenhum se soma ao outro. ${sinaisPorExtenso()} dizem que a pessoa se interessou — o contato só o WhatsApp mostra.`}
        >
          <ul className="metric-list">
            <li className="metric">
              <span>Cliques no Instagram</span>
              <strong>{n(dados.instagram)}</strong>
              <small>Saída do site para o perfil. Não diz se passou a seguir.</small>
            </li>
            <li className="metric">
              <span>Cliques no endereço</span>
              <strong>{n(dados.endereco)}</strong>
              <small>Quem abriu o mapa. Não prova visita ao consultório.</small>
            </li>
            <li className="metric">
              <span>Cliques para o Grupo VIP</span>
              <strong>{n(dados.grupoVip)}</strong>
              <small>
                Cliques para o Grupo VIP, e não entradas no grupo. Quem entrou de
                fato, só o WhatsApp mostra.
              </small>
            </li>
          </ul>
        </Cartao>
      </div>

      <div className="grid grid-2 section-gap">
        <Cartao
          titulo="Instagram, por posição na página"
          nota="De que ponto do site saem as pessoas que vão ver o perfil"
          tom="contexto"
          limite={`Continua sendo sinal de contexto, em qualquer posição. Somar estes cliques aos de ${sinaisPorExtenso()} e ao WhatsApp produziria um número que não corresponde a nada.`}
        >
          <Barras
            itens={dados.instagramPorPosicao.map((i) => ({
              nome: posicao(i.posicao),
              valor: i.cliques,
            }))}
            tom="contexto"
            total={dados.instagram}
            vazio="Nenhum clique para o Instagram no período."
          />
        </Cartao>

        <Cartao
          titulo="O que cada posição quer dizer"
          nota="Os sete pontos do site que abrem uma conversa"
          limite="Um valor que apareça aqui fora desta lista é sinal de que alguém criou um ponto de rastreio novo no site. Não é erro do painel — é aviso."
        >
          <dl className="glossario">
            <div>
              <dt>Menu do topo</dt>
              <dd>O botão “Agendar Avaliação” da barra de navegação.</dd>
            </div>
            <div>
              <dt>Primeira tela</dt>
              <dd>O botão que aparece sem rolar a página, logo na abertura.</dd>
            </div>
            <div>
              <dt>Fim da página</dt>
              <dd>O convite de fechamento, para quem leu tudo.</dd>
            </div>
            <div>
              <dt>Dentro de um procedimento</dt>
              <dd>O botão que aparece no detalhe de um procedimento específico.</dd>
            </div>
            <div>
              <dt>Menu lateral</dt>
              <dd>O ícone de WhatsApp do menu que abre no celular.</dd>
            </div>
            <div>
              <dt>Seção de contato</dt>
              <dd>O número de telefone escrito na seção de contato.</dd>
            </div>
            <div>
              <dt>Botão flutuante</dt>
              <dd>
                O botão verde fixo no canto da tela, visível o tempo todo. Por
                estar sempre à vista, tende a concentrar volume.
              </dd>
            </div>
          </dl>
        </Cartao>
      </div>

      <Rodape geradoEm={dados.geradoEm} />
    </Estrutura>
  );
}
