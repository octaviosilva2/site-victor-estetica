import Barras from "@/components/painel/Barras";
import Cartao from "@/components/painel/Cartao";
import Estrutura from "@/components/painel/Estrutura";
import FilaKpi, { type ItemKpi } from "@/components/painel/Kpi";
import HorasDoDia from "@/components/painel/HorasDoDia";
import MapaCalor from "@/components/painel/MapaCalor";
import Rodape from "@/components/painel/Rodape";
import TituloDaPagina from "@/components/painel/TituloDaPagina";
import { interesseEPublico } from "@/lib/painel/consultas";
import {
  cidade,
  explicarOrigem,
  n,
  pct,
  pctCurto,
  plural,
  regiao,
} from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 3 — Interesse e público.
// Pergunta que a página responde: o que interessa, e para quem?
// Indicadores 8, 9, 12 e 13 de `08-matriz-do-dashboard.md`, mais o indicador 7
// com a lista completa de origens.
//
// **É aqui que moram as listas inteiras.** A visão geral mostra os três
// primeiros de cada lista; esta página mostra os 13 procedimentos e as 5 áreas,
// em tabela, com a fatia de cada um. Quem quer o resumo abre a primeira tela;
// quem quer conferir item por item vem para esta.

export default async function InteresseEPublico({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { email } = await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await interesseEPublico(periodo);

  const somaProcedimentos = dados.procedimentos.reduce((s, p) => s + p.cliques, 0);
  const somaAreas = dados.areas.reduce((s, a) => s + a.cliques, 0);
  // As duas listas juntas cobrem o mesmo evento: o que sobrar do total é o que a
  // plataforma não liberou. Regra 7 de `08-matriz-do-dashboard.md`.
  const naoDetalhado =
    dados.totalProcedimentoClick - somaProcedimentos - somaAreas;

  const maisClicado = dados.procedimentos[0];
  const areaMaisClicada = dados.areas[0];
  const maiorRegiao = dados.regioes[0];
  const totalOrigens = dados.origens.reduce((s, o) => s + o.sessoes, 0);

  // Só as origens que o cliente pode não reconhecer entram no glossário da
  // página. Explicar "Instagram" seria ruído; explicar "acesso direto" foi
  // pedido pelo nome.
  const origensComExplicacao = dados.origens.filter((o) => explicarOrigem(o.origem));

  const kpis: ItemKpi[] = [
    {
      rotulo: "Cliques em cards",
      valor: n(dados.totalProcedimentoClick),
      nota: "procedimentos e áreas somados",
      limite:
        "São cliques por procedimento e por área, não páginas mais vistas. Abrir o card não abre página nova — mede quem quis saber mais, não quem leu.",
    },
    {
      rotulo: "Chegada aos resultados",
      valor: pct(dados.sessoesComResultados, dados.sessoes),
      nota: `${n(dados.sessoesComResultados)} de ${n(dados.sessoes)} ${plural(
        dados.sessoes,
        "visita",
        "visitas",
      )}`,
      limite:
        "Mede que a seção de antes e depois apareceu na tela. Não mede leitura, atenção nem tempo parado ali.",
    },
    {
      rotulo: "Visitas no período",
      valor: n(dados.sessoes),
      nota: "base de comparação desta tela",
      limite:
        "Repetido desta tela para servir de base aos percentuais ao lado. É o mesmo número da visão geral.",
    },
    {
      rotulo: "Origens diferentes",
      valor: n(dados.origens.length),
      nota: `${n(totalOrigens)} ${plural(totalOrigens, "visita", "visitas")} classificadas`,
      limite:
        "Quantos caminhos diferentes trouxeram gente ao site no período. Um número baixo não é problema — quer dizer concentração, que é boa quando o canal é seu e arriscada quando não é.",
    },
  ];

  return (
    <Estrutura usuario={email} periodo={periodo}>
      <TituloDaPagina
        secao="Interesse e público"
        titulo="O que interessa, e para quem"
        descricao="Cada card de procedimento ou de área que alguém abre no site é um sinal de assunto. Serve para decidir sobre o que falar — em conteúdo, em anúncio e na própria conversa."
        periodo={periodo}
        geradoEm={dados.geradoEm}
      />

      <FilaKpi itens={kpis} colunas={4} />

      <div className="grid grid-2 section-gap">
        <Cartao
          titulo="Todos os procedimentos"
          nota="Lista completa, do mais clicado ao menos clicado"
          etiqueta={
            <span className="chip">
              {n(dados.procedimentos.length)}{" "}
              {plural(dados.procedimentos.length, "item", "itens")}
            </span>
          }
          leitura={
            maisClicado ? (
              <>
                <b>{maisClicado.nome}</b> é o procedimento que mais desperta
                interesse no período. É o assunto que já tem público — o mais
                barato de usar em conteúdo, porque a demanda por ele já existe.
              </>
            ) : undefined
          }
          limite="São cliques por procedimento, não páginas mais vistas. Procedimento que não aparece nesta lista teve zero clique no período, ou pouquíssimos e foi omitido pela plataforma."
        >
          {dados.procedimentos.length === 0 ? (
            <p className="vazio">Nenhum clique em procedimento no período.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Procedimento</th>
                    <th scope="col" className="num">
                      Cliques
                    </th>
                    <th scope="col" className="num">
                      Fatia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dados.procedimentos.map((p) => (
                    <tr key={p.nome}>
                      <td>{p.nome || "Sem nome registrado"}</td>
                      <td className="num">{n(p.cliques)}</td>
                      <td className="num">{pctCurto(p.cliques, somaProcedimentos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Cartao>

        <Cartao
          titulo="Todas as áreas de atuação"
          nota="As cinco áreas, do maior interesse ao menor"
          etiqueta={
            <span className="chip">
              {n(dados.areas.length)} {plural(dados.areas.length, "item", "itens")}
            </span>
          }
          leitura={
            areaMaisClicada ? (
              <>
                <b>{areaMaisClicada.nome}</b> lidera entre as áreas. Área é uma
                porta mais larga que procedimento: quem clica aqui ainda está
                descobrindo o que quer.
              </>
            ) : undefined
          }
          limite="Áreas e procedimentos ficam em listas separadas de propósito: “Estética Regenerativa” existe como área e como procedimento, e juntá-las diria um número que nunca aconteceu."
        >
          {dados.areas.length === 0 ? (
            <p className="vazio">Nenhum clique em área no período.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Área</th>
                    <th scope="col" className="num">
                      Cliques
                    </th>
                    <th scope="col" className="num">
                      Fatia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dados.areas.map((a) => (
                    <tr key={a.nome}>
                      <td>{a.nome || "Sem nome registrado"}</td>
                      <td className="num">{n(a.cliques)}</td>
                      <td className="num">{pctCurto(a.cliques, somaAreas)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Cartao>
      </div>

      {naoDetalhado > 0 ? (
        <p className="diferenca">
          <b>
            {n(naoDetalhado)}{" "}
            {plural(naoDetalhado, "clique não aparece", "cliques não aparecem")} nas
            duas listas acima.
          </b>{" "}
          O total de cliques em cards no período é {n(dados.totalProcedimentoClick)},
          e as listas somam {n(somaProcedimentos + somaAreas)}. A plataforma omite
          recortes com pouquíssimos acessos, por privacidade. O total é o número
          certo; as listas mostram a parte que ela liberou.
        </p>
      ) : null}

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="De onde vêm as visitas"
          nota="Lista completa, desdobrada por rede e por buscador"
          largura={2}
          limite="É a origem da visita, não da pessoa. Quem chega hoje pela busca e volta amanhã pelo Instagram aparece nas duas linhas. Uma origem escrita como “algumacoisa / referral” é uma origem nova que ainda não tem nome de negócio — não é erro."
        >
          {dados.origens.length === 0 ? (
            <p className="vazio">Nenhuma visita registrada no período.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Origem</th>
                    <th scope="col" className="num">
                      Visitas
                    </th>
                    <th scope="col" className="num">
                      Fatia
                    </th>
                    <th scope="col">O que quer dizer</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.origens.map((o) => (
                    <tr key={o.origem}>
                      <td>{o.origem}</td>
                      <td className="num">{n(o.sessoes)}</td>
                      <td className="num">{pctCurto(o.sessoes, totalOrigens)}</td>
                      <td style={{ whiteSpace: "normal", maxWidth: 360 }}>
                        {explicarOrigem(o.origem) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Cartao>

        <Cartao
          titulo="Em que aparelho as pessoas leem"
          nota="Participação das visitas por tipo de aparelho"
          limite="Diz em que tela o site é lido, não quem é a pessoa. Um mesmo paciente que pesquisa no celular e volta no computador aparece nos dois."
        >
          <Barras
            itens={dados.dispositivos.map((d) => ({
              nome: d.nome,
              valor: d.sessoes,
            }))}
            vazio="Nenhuma visita registrada no período."
          />
        </Cartao>
      </div>

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Região aproximada dos acessos"
          nota="As dez cidades com mais usuários ativos"
          largura={2}
          leitura={
            maiorRegiao ? (
              <>
                O maior volume vem de <b>{cidade(maiorRegiao.cidade)}</b>. Se houver
                investimento em anúncio, é o raio que já responde — e o que estiver
                muito fora dele custa mais para converter.
              </>
            ) : undefined
          }
          limite="É a região aproximada do acesso, e não a localização de ninguém. Vem da rede usada e pode apontar a cidade vizinha. Regiões com pouquíssimos acessos são omitidas pela plataforma, por privacidade."
        >
          {dados.regioes.length === 0 ? (
            <p className="vazio">Nenhuma região com volume suficiente no período.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cidade</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="num">
                      Usuários ativos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dados.regioes.map((r) => (
                    <tr key={`${r.cidade}-${r.estado}`}>
                      <td>{cidade(r.cidade)}</td>
                      <td>{regiao(r.estado)}</td>
                      <td className="num">{n(r.usuarios)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Cartao>

        <Cartao
          titulo="Horário de maior movimento"
          nota="Visitas somadas por hora do dia"
          limite="Em volume baixo, uma hora isolada diz pouco. Leia a faixa — manhã, tarde, noite —, não o horário exato."
        >
          <HorasDoDia horarios={dados.horarios} />
        </Cartao>
      </div>

      <div className="grid section-gap">
        <Cartao
          titulo="Quando procuram o site"
          nota="Hora e dia da semana. Quanto mais escuro, mais visitas"
          limite="Em volume baixo, uma casa isolada diz pouco. Leia as faixas — manhã, fim de tarde, fim de semana —, não a hora exata."
        >
          <MapaCalor horarios={dados.horarios} />
        </Cartao>
      </div>

      {origensComExplicacao.length > 0 ? (
        <div className="aviso section-gap">
          <p>
            <b>Sobre os rótulos de origem.</b> Alguns nomes desta página vêm da
            plataforma e não querem dizer o que parecem. O mais confundido é{" "}
            <b>acesso direto</b>: não significa que a pessoa digitou o endereço —
            significa que o navegador não informou de onde ela veio, o que
            acontece em link salvo, link colado numa conversa e clique dentro de um
            aplicativo. A coluna “o que quer dizer” da tabela acima traz a
            explicação de cada um.
          </p>
        </div>
      ) : null}

      <Rodape geradoEm={dados.geradoEm} />
    </Estrutura>
  );
}
