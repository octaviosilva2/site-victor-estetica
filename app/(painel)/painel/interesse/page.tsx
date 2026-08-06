import Cabecalho from "@/components/painel/Cabecalho";
import Cartao from "@/components/painel/Cartao";
import Barras from "@/components/painel/Barras";
import MapaCalor from "@/components/painel/MapaCalor";
import Rodape from "@/components/painel/Rodape";
import { interesseEPublico } from "@/lib/painel/consultas";
import { n, pct } from "@/lib/painel/formato";
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

  return (
    <>
      <Cabecalho atual="/painel/interesse" periodo={periodo} />

      <main className="pnl-largura">
        <section className="pnl-secao">
          <h2>O que desperta interesse</h2>
          <p className="pnl-secao-nota">
            Cliques nos cards de procedimento e de área, no período.
          </p>

          <div className="pnl-grade pnl-grade-2">
            <div className="pnl-cartao">
              <p className="pnl-cartao-rotulo">Cliques por procedimento</p>
              <Barras
                itens={dados.procedimentos.map((p) => ({
                  nome: p.nome || "Sem nome registrado",
                  valor: p.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique em procedimento no período."
              />
              <p className="pnl-limite">
                São <b>cliques por procedimento</b>, não páginas mais vistas.
                Abrir o card não abre uma página nova — mede quem quis saber
                mais, não quem leu.
              </p>
            </div>

            <div className="pnl-cartao">
              <p className="pnl-cartao-rotulo">Cliques por área</p>
              <Barras
                itens={dados.areas.map((a) => ({
                  nome: a.nome || "Sem nome registrado",
                  valor: a.cliques,
                }))}
                tom="acao"
                vazio="Nenhum clique em área no período."
              />
              <p className="pnl-limite">
                Áreas e procedimentos ficam em listas separadas de propósito:
                &ldquo;Estética Regenerativa&rdquo; existe como área <b>e</b>{" "}
                como procedimento, e juntá-las diria um número que nunca
                aconteceu.
              </p>
            </div>
          </div>
        </section>

        <section className="pnl-secao">
          <h2>Até onde as pessoas chegam</h2>
          <div className="pnl-grade pnl-grade-2">
            <Cartao
              rotulo="Chegada à seção de resultados"
              valor={pct(dados.sessoesComResultados, dados.sessoes)}
              tom="neutro"
              comparacao={
                <>
                  <b>{n(dados.sessoesComResultados)}</b> de {n(dados.sessoes)}{" "}
                  sessões
                </>
              }
              limite="Mede que a seção de antes e depois apareceu na tela. Não mede leitura, atenção nem tempo parado ali."
            />
            <Cartao
              rotulo="Sessões no período"
              valor={n(dados.sessoes)}
              tom="neutro"
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
                    {dados.regioes.map((regiao) => (
                      <tr key={`${regiao.cidade}-${regiao.estado}`}>
                        <td>
                          {regiao.cidade === "(not set)"
                            ? "Não identificada"
                            : regiao.cidade}
                        </td>
                        <td>{regiao.estado}</td>
                        <td className="num">{n(regiao.usuarios)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="pnl-limite">
              É a <b>região aproximada</b> do acesso, e não a localização de
              ninguém. Vem da rede usada e pode apontar a cidade vizinha. Regiões
              com pouquíssimos acessos são omitidas pela plataforma, por
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
