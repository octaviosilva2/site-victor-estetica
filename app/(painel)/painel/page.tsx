import Barras from "@/components/painel/Barras";
import Cartao from "@/components/painel/Cartao";
import Estrutura from "@/components/painel/Estrutura";
import FilaKpi, { type ItemKpi } from "@/components/painel/Kpi";
import Rodape from "@/components/painel/Rodape";
import Rosca from "@/components/painel/Rosca";
import Tendencia from "@/components/painel/Tendencia";
import TituloDaPagina from "@/components/painel/TituloDaPagina";
import { visaoGeral } from "@/lib/painel/consultas";
import { INSTANCIA, sinaisPorExtenso } from "@/lib/painel/instancia";
import { explicarOrigem, n, pct, plural, variacao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 1 — Visão geral.
// Pergunta que a página responde: o site está trazendo gente e gerando contato?
// Indicadores 10, 2 e 7 de `08-matriz-do-dashboard.md`, mais a reapresentação
// dos indicadores 8, 9 e 11 na forma de destaques.
//
// **Reapresentar não cria indicador.** Os três primeiros procedimentos e as
// três primeiras áreas que aparecem aqui são o mesmo indicador 8 da página 3,
// recortado. A nota está registrada na matriz para que a contagem de 17 não
// pareça ter mudado — quem contar cartões nesta tela vai encontrar mais de 17,
// e a explicação precisa existir escrita em algum lugar.

export default async function VisaoGeral({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  // Primeira linha, sempre. Nada é consultado antes de saber quem está lendo.
  const { email } = await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await visaoGeral(periodo);

  // Quantas visitas, em média, para cada pedido de contato. É a mesma taxa dita
  // ao contrário — e "a cada 12 visitas, uma conversa" é uma frase que o cliente
  // usa, enquanto "8,3%" é uma que ele precisa converter na cabeça.
  const visitasPorAcao =
    dados.sessoesComWhatsapp > 0
      ? Math.round(dados.sessoes / dados.sessoesComWhatsapp)
      : 0;

  const maiorOrigem = dados.origens[0];
  const serieVisitas = dados.serie.map((p) => p.sessoes);

  const kpis: ItemKpi[] = [
    {
      rotulo: "Visitas ao site",
      valor: n(dados.sessoes),
      variacao: variacao(dados.sessoes, dados.sessoesAnterior),
      nota: `${n(dados.sessoesAnterior)} no período anterior`,
      serie: serieVisitas,
      limite:
        "Uma visita é uma sessão, não uma pessoa: quem entra hoje e volta amanhã conta duas vezes. É o denominador de todas as taxas do painel.",
    },
    {
      rotulo: "Usuários ativos",
      valor: n(dados.usuariosAtivos),
      variacao: variacao(dados.usuariosAtivos, dados.usuariosAtivosAnterior),
      nota: `${n(dados.usuariosAtivosAnterior)} no período anterior`,
      serie: dados.serie.map((p) => p.usuarios),
      limite:
        "Não é o número de pessoas diferentes. Quem visita do celular e depois do computador conta duas vezes. Nunca chame de visitantes únicos.",
    },
    {
      rotulo: INSTANCIA.acaoImportante.nome,
      valor: n(dados.cliquesWhatsapp),
      tom: "acao",
      variacao: variacao(dados.cliquesWhatsapp, dados.cliquesWhatsappAnterior),
      nota: `${n(dados.cliquesWhatsappAnterior)} no período anterior`,
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
        "Não é taxa de venda nem de agendamento. Cliques no Instagram, no endereço e no Grupo VIP não entram nesta conta — são sinais de contexto.",
    },
    {
      rotulo: "Chegada aos resultados",
      valor: pct(dados.sessoesComResultados, dados.sessoes),
      nota: `${n(dados.sessoesComResultados)} ${plural(
        dados.sessoesComResultados,
        "visita chegou",
        "visitas chegaram",
      )}`,
      limite:
        "Mede que a seção de antes e depois apareceu na tela. Não mede leitura, atenção nem tempo parado ali.",
    },
    {
      rotulo: "Cliques em cards",
      valor: n(dados.cliquesEmCards),
      nota: "procedimentos e áreas somados",
      limite:
        "São cliques por procedimento e por área, não páginas mais vistas. Abrir o card não abre página nova — mede quem quis saber mais, não quem leu.",
    },
  ];

  return (
    <Estrutura usuario={email} periodo={periodo}>
      <TituloDaPagina
        secao="Visão geral"
        titulo="O site está gerando contato?"
        descricao={`A única ação importante desta implantação é o clique que abre o WhatsApp. Tudo nesta tela existe para responder se ele está acontecendo, e em que proporção.`}
        periodo={periodo}
        geradoEm={dados.geradoEm}
      />

      {/* Regra 4 de `08-matriz-do-dashboard.md`: o aviso de consentimento é
          obrigatório na primeira página. Sem ele, o cliente compara os números
          com o movimento real do consultório e conclui que a medição está
          errada. */}
      <div className="aviso">
        <p>
          <b>Estes números representam quem aceitou a medição.</b> O site pergunta
          a cada visitante se ele autoriza a coleta. Quem recusa não aparece em
          nenhum número desta tela. O total real de visitas é maior do que o
          exibido aqui, e isso é exigência da lei, não falha da medição.
        </p>
      </div>

      <FilaKpi itens={kpis} colunas={6} />

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Visitas ao longo do período"
          nota="Cada dia do período, comparado com a janela anterior"
          largura={2}
          etiqueta={
            variacao(dados.sessoes, dados.sessoesAnterior) ? (
              <span
                className={`chip ${
                  dados.sessoes >= dados.sessoesAnterior ? "good" : "warn"
                }`}
              >
                {variacao(dados.sessoes, dados.sessoesAnterior)}
              </span>
            ) : null
          }
          limite="A linha tracejada é o mesmo número na janela imediatamente anterior, de igual duração. Com poucos dias medidos, as duas linhas dizem pouco: dois pontos sempre formam uma reta, e reta parece tendência."
        >
          <Tendencia serie={dados.serie} serieAnterior={dados.serieAnterior} />
        </Cartao>

        <Cartao
          titulo="De onde vêm as visitas"
          nota="Origem desdobrada por rede e por buscador"
          leitura={
            maiorOrigem ? (
              <>
                <b>{maiorOrigem.origem}</b> é hoje o maior caminho até o site
                {explicarOrigem(maiorOrigem.origem)
                  ? ` — ${explicarOrigem(maiorOrigem.origem)?.toLowerCase()}`
                  : "."}{" "}
                Se a intenção for crescer, é onde já existe tração; se for reduzir
                dependência, é o que precisa de alternativa.
              </>
            ) : undefined
          }
          limite="É a origem da visita, não da pessoa. Quem chega hoje pela busca e volta amanhã pelo Instagram aparece nas duas fatias. A lista completa, com o que cada rótulo quer dizer, está em Interesse e público."
        >
          <Rosca
            itens={dados.origens.map((o) => ({ nome: o.origem, valor: o.sessoes }))}
            rotuloCentro="visitas"
            vazio="Nenhuma visita registrada no período."
          />
        </Cartao>
      </div>

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Procedimentos que mais despertam interesse"
          nota="Os três primeiros. A lista com os 13 está em Interesse e público"
          etiqueta={<span className="chip">Top 3</span>}
          limite="São cliques nos cards de procedimento, não páginas mais vistas. Abrir o card não abre página nova."
        >
          <Barras
            itens={dados.topProcedimentos.slice(0, 3).map((p) => ({
              nome: p.nome || "Sem nome registrado",
              valor: p.cliques,
            }))}
            vazio="Nenhum clique em procedimento no período."
          />
        </Cartao>

        <Cartao
          titulo="Áreas que mais atraem"
          nota="As três primeiras. As cinco estão em Interesse e público"
          etiqueta={<span className="chip">Top 3</span>}
          limite="Área e procedimento ficam em listas separadas de propósito: “Estética Regenerativa” existe como área e como procedimento, e juntá-las diria um número que nunca aconteceu."
        >
          <Barras
            itens={dados.topAreas.slice(0, 3).map((a) => ({
              nome: a.nome || "Sem nome registrado",
              valor: a.cliques,
            }))}
            vazio="Nenhum clique em área no período."
          />
        </Cartao>

        {/* A ação importante e os sinais de contexto no mesmo cartão, mas
            visualmente separados e sem nenhum total somando os dois. É a regra
            1 da matriz aplicada ao desenho. */}
        <Cartao
          titulo="Ação importante e sinais de contexto"
          nota="Duas famílias que nunca se somam"
          tom="acao"
          limite={`Não existe total combinando as duas colunas. ${INSTANCIA.acaoImportante.nome} é a única ação importante; ${sinaisPorExtenso()} dizem que a pessoa se interessou, não que procurou contato.`}
        >
          <dl className="metric-list">
            <div className="metric">
              <span>
                {INSTANCIA.acaoImportante.nome}
                <span className="explica" data-tip="A única ação importante desta implantação.">
                  ?
                </span>
              </span>
              <strong>{n(dados.cliquesWhatsapp)}</strong>
              <small>
                {visitasPorAcao > 0
                  ? `A cada ${n(visitasPorAcao)} visitas, uma termina em pedido de contato.`
                  : "Nenhum pedido de contato pelo site no período."}
              </small>
            </div>
          </dl>

          <p
            className="card-note"
            style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}
          >
            Sinais de contexto — não entram na conta acima
          </p>

          <ul className="metric-list" style={{ marginTop: 10 }}>
            <li className="metric">
              <span>Cliques no Instagram</span>
              <strong>{n(dados.instagram)}</strong>
            </li>
            <li className="metric">
              <span>Cliques no endereço</span>
              <strong>{n(dados.endereco)}</strong>
            </li>
            <li className="metric">
              <span>Cliques para o Grupo VIP</span>
              <strong>{n(dados.grupoVip)}</strong>
            </li>
          </ul>
        </Cartao>
      </div>

      {/* Bloco de contexto fixo, exigido pela matriz: o que conta como ação
          importante nesta implantação. É texto, não número, e não muda com o
          período. */}
      <div className="aviso contexto section-gap">
        <p>
          <b>O que conta como ação importante.</b> Só o clique que abre o
          WhatsApp — de qualquer ponto do site. Cliques em {sinaisPorExtenso()} são{" "}
          <b>sinais de contexto</b>: dizem que a pessoa se interessou, mas não que
          ela procurou contato.
        </p>
        <p>
          Eles aparecem em <b>violeta</b> no painel inteiro, e a ação importante em{" "}
          <b>azul</b>. As duas cores existem para lembrar de uma coisa só:{" "}
          <b>elas nunca se somam</b>. Um total de “interações” juntando as duas
          famílias seria um número que não corresponde a nada.
        </p>
      </div>

      <Rodape geradoEm={dados.geradoEm} />
    </Estrutura>
  );
}
