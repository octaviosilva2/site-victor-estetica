import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Barras from "@/components/painel/Barras";
import MapaCalor from "@/components/painel/MapaCalor";
import Rodape from "@/components/painel/Rodape";
import { interesseEPublico } from "@/lib/painel/consultas";
import { cidade, n, pct, plural, regiao } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 3 — Interesse e público.
// Pergunta que a página responde: o que interessa, e para quem?
// Indicadores 8, 9, 12 e 13 de `08-matriz-do-dashboard.md`.

export default async function InteresseEPublico({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await interesseEPublico(periodo);

  const somaProcedimentos = dados.procedimentos.reduce((s, p) => s + p.cliques, 0);
  const somaAreas = dados.areas.reduce((s, a) => s + a.cliques, 0);
  // As duas listas juntas cobrem o mesmo evento: o que sobrar do total é o que
  // a plataforma não liberou. Regra 7 de `08-matriz-do-dashboard.md`.
  const naoDetalhado =
    dados.totalProcedimentoClick - somaProcedimentos - somaAreas;

  const maisClicado = dados.procedimentos[0];
  const areaMaisClicada = dados.areas[0];
  const maiorRegiao = dados.regioes[0];

  return (
    <>
      <Cabecalho atual="/painel/interesse" periodo={periodo} />

      <main className="pnl-largura">
        <div className="pnl-titulo">
          <h1>O que interessa, e para quem</h1>
          <p>
            Cada card de procedimento ou de área que alguém abre no site é um
            sinal de assunto. Serve para decidir sobre o que falar — em
            conteúdo, em anúncio e na própria conversa.
          </p>
        </div>

        <section className="pnl-secao">
          <h2>O que desperta interesse</h2>
          <p className="pnl-secao-nota">
            Cliques nos cards de procedimento e de área, no período.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <div className="pnl-cartao pnl-cartao-acao">
              <p className="pnl-cartao-rotulo">Cliques por procedimento</p>
              <Barras
                itens={dados.procedimentos.map((p) => ({
                  nome: p.nome || "Sem nome registrado",
                  valor: p.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique em procedimento no período."
              />
              {maisClicado ? (
                <p className="pnl-leitura">
                  <b>{maisClicado.nome}</b> é o procedimento que mais desperta
                  interesse no período. É o assunto que já tem público — o mais
                  barato de usar em conteúdo, porque a demanda por ele já
                  existe.
                </p>
              ) : null}
              <p className="pnl-limite">
                São <b>cliques por procedimento</b>, não páginas mais vistas.
                Abrir o card não abre uma página nova — mede quem quis saber
                mais, não quem leu.
              </p>
            </div>

            <div className="pnl-cartao pnl-cartao-acao">
              <p className="pnl-cartao-rotulo">Cliques por área</p>
              <Barras
                itens={dados.areas.map((a) => ({
                  nome: a.nome || "Sem nome registrado",
                  valor: a.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique em área no período."
              />
              {areaMaisClicada ? (
                <p className="pnl-leitura">
                  <b>{areaMaisClicada.nome}</b> lidera entre as áreas. Área é
                  uma porta mais larga que procedimento: quem clica aqui ainda
                  está descobrindo o que quer.
                </p>
              ) : null}
              <p className="pnl-limite">
                Áreas e procedimentos ficam em listas separadas de propósito:
                &ldquo;Estética Regenerativa&rdquo; existe como área <b>e</b>{" "}
                como procedimento, e juntá-las diria um número que nunca
                aconteceu.
              </p>
            </div>
          </div>

          {naoDetalhado > 0 ? (
            <p className="pnl-diferenca">
              <b>
                {n(naoDetalhado)}{" "}
                {plural(naoDetalhado, "clique não aparece", "cliques não aparecem")}{" "}
                nas duas listas acima.
              </b>{" "}
              O total de cliques em cards no período é{" "}
              {n(dados.totalProcedimentoClick)}, e as listas somam{" "}
              {n(somaProcedimentos + somaAreas)}. A plataforma omite recortes
              com pouquíssimos acessos, por privacidade.
            </p>
          ) : null}
        </section>

        <section className="pnl-secao">
          <h2>Até onde as pessoas chegam</h2>
          <p className="pnl-secao-nota">
            A seção de antes e depois é o argumento mais forte da página. Esta
            é a proporção de visitas que chegou a vê-la.
          </p>
          <div className="pnl-grade pnl-grade-2">
            <Cartao
              rotulo="Chegada à seção de resultados"
              valor={pct(dados.sessoesComResultados, dados.sessoes)}
              comparacao={
                <>
                  <b>{n(dados.sessoesComResultados)}</b> de {n(dados.sessoes)}{" "}
                  {plural(dados.sessoes, "visita", "visitas")}
                </>
              }
              leitura={
                dados.sessoes > 0 ? (
                  dados.sessoesComResultados * 2 < dados.sessoes ? (
                    <>
                      <b>Menos da metade das visitas chega aos resultados.</b> A
                      maioria decide antes de ver os casos — o que está acima
                      deles na página é o que está sendo lido.
                    </>
                  ) : (
                    <>
                      <b>A maior parte das visitas chega aos resultados.</b> O
                      argumento visual está sendo visto; o que decide agora é o
                      convite que vem depois dele.
                    </>
                  )
                ) : undefined
              }
              limite="Mede que a seção de antes e depois apareceu na tela. Não mede leitura, atenção nem tempo parado ali."
            />
            <Cartao
              rotulo="Visitas no período"
              valor={n(dados.sessoes)}
              limite="Repetido desta tela para servir de base de comparação ao percentual ao lado."
            />
          </div>
        </section>

        <section className="pnl-secao">
          <h2>De onde vêm os acessos</h2>
          <div className="pnl-cartao">
            <p className="pnl-cartao-rotulo">Região aproximada</p>
            {dados.regioes.length === 0 ? (
              <p className="pnl-vazio">
                Nenhuma região com volume suficiente no período.
              </p>
            ) : (
              <div className="pnl-rolagem">
                <table className="pnl-tabela">
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
            {maiorRegiao ? (
              <p className="pnl-leitura">
                O maior volume vem de <b>{cidade(maiorRegiao.cidade)}</b>. Se
                houver investimento em anúncio, é o raio que já responde — e o
                que estiver muito fora dele custa mais para converter.
              </p>
            ) : null}
            <p className="pnl-limite">
              É a <b>região aproximada</b> do acesso, e não a localização de
              ninguém. Vem da rede usada e pode apontar a cidade vizinha.
              Regiões com pouquíssimos acessos são omitidas pela plataforma, por
              privacidade.
            </p>
          </div>
        </section>

        <section className="pnl-secao">
          <h2>Quando procuram o site</h2>
          <div className="pnl-cartao">
            <p className="pnl-cartao-rotulo">Hora e dia da semana</p>
            <MapaCalor horarios={dados.horarios} />
            <p className="pnl-limite">
              Em volume baixo, uma casa isolada diz pouco. Leia as faixas —
              manhã, fim de tarde, fim de semana —, não a hora exata.
            </p>
          </div>
        </section>
      </main>

      <Rodape geradoEm={dados.geradoEm} />
    </>
  );
}
