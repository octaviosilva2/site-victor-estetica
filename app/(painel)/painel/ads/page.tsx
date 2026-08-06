import Cartao from "@/components/painel/Cartao";
import Estrutura from "@/components/painel/Estrutura";
import FilaKpi, { type ItemKpi } from "@/components/painel/Kpi";
import Rodape from "@/components/painel/Rodape";
import TituloDaPagina from "@/components/painel/TituloDaPagina";
import { googleAds } from "@/lib/painel/consultas";
import { brl, n, pct, pctCurto, plural } from "@/lib/painel/formato";
import { lerPeriodo } from "@/lib/painel/periodo";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA 4 — Google Ads.
// Pergunta que a página responde: a campanha está indo bem?
// Indicadores 6, 15, 16, 17, 18 e 19 de `08-matriz-do-dashboard.md`.
//
// Entrou pelo **aditivo A2**, seção 13 de `05-escopo-contratado.md`. Antes dele,
// o Google Ads era um bloco no rodapé da página 2, e o indicador 6 vivia lá. O
// indicador é o mesmo, com o mesmo cálculo, em outro lugar.
//
// ============================================================================
// A ESTRUTURA DA PÁGINA É FIXA. O CONTEÚDO É QUE VARIA
// ============================================================================
//
// Os seis cartões, o cabeçalho da tabela de campanhas e o confronto entre pago
// e não pago estão **sempre** na tela, veiculando ou não. É decisão do Octavio
// em 06/08: o cliente precisa ver que a página existe, o que ela vai mostrar e
// do que ela depende — uma tela que só aparece depois que há dado parece
// integração quebrada até o dia em que aparece.
//
// O que muda é o preenchimento. Métrica que a plataforma não devolveu vira
// **travessão com a razão escrita**, nunca zero: zero significaria "anunciou e
// não gastou", que é uma afirmação, e nós não temos como fazê-la.
//
// **O limite que não dá para contornar, e por que o A3 foi arquivado.** O
// Analytics só conhece campanha que trouxe sessão. Campanha pausada, ou
// veiculando sem nenhum clique, **não volta como linha zerada — não volta
// linha**. Listar as campanhas paradas exigiria a API do Google Ads, que é
// fonte de dado nova: aditivo A3, escrito e arquivado no mesmo dia
// (`A3-prompt-credenciais-google-ads.md`). Enquanto ele não for retomado, a
// tabela mostra a linha de espera, e as campanhas entram sozinhas assim que
// houver a primeira sessão vinda de anúncio — sem tocar em código.

/** Formata, ou devolve travessão. Nunca zero para ausência de dado. */
function ou(valor: number | null, formatar: (v: number) => string): string {
  return valor === null ? "—" : formatar(valor);
}

export default async function GoogleAds({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { email } = await exigirAcesso();

  const periodo = lerPeriodo((await searchParams).periodo);
  const dados = await googleAds(periodo);

  // "Veiculou" é ter trazido visita ou ter custado dinheiro. As duas coisas vêm
  // de fontes diferentes e qualquer uma delas basta para a página ter o que
  // mostrar.
  const veiculou = dados.sessoes > 0 || (dados.investimento ?? 0) > 0;

  const custoPorAcao =
    dados.investimento !== null && dados.acoes > 0
      ? dados.investimento / dados.acoes
      : null;

  const taxaPaga = pct(dados.sessoesComAcao, dados.sessoes);
  const taxaNaoPaga = pct(dados.naoPago.sessoesComAcao, dados.naoPago.sessoes);

  // A razão que acompanha cada travessão. Existem dois motivos diferentes para
  // um número faltar aqui, e confundi-los levaria a conclusões opostas.
  const razaoSemNumero = dados.custoIndisponivel
    ? "O vínculo com o Google Ads não está devolvendo esta métrica."
    : "Nenhuma campanha veiculou no período escolhido.";

  const kpis: ItemKpi[] = [
    {
      rotulo: "Investimento no período",
      valor: ou(dados.investimento, brl),
      nota: dados.investimento === null ? razaoSemNumero : "valor cobrado pelo Google",
      limite:
        "Depende do vínculo entre o Google Ads e o Analytics estar ativo. Se ele cair, a métrica some inclusive para trás — não é gasto que desapareceu, é leitura que parou.",
    },
    {
      rotulo: "Cliques no anúncio",
      valor: ou(dados.cliquesNoAnuncio, n),
      nota: dados.cliquesNoAnuncio === null ? razaoSemNumero : "cliques cobrados",
      limite:
        "Clique no anúncio não é visita no site. Quem clica e fecha antes de a página abrir conta aqui e não conta como visita. A diferença entre os dois números é normal.",
    },
    {
      rotulo: "Impressões",
      valor: ou(dados.impressoes, n),
      nota: dados.impressoes === null ? razaoSemNumero : "vezes que o anúncio apareceu",
      limite:
        "Mede exibição do anúncio, não pessoas alcançadas. A mesma pessoa que vê o anúncio cinco vezes gera cinco impressões.",
    },
    {
      rotulo: "Custo por clique",
      valor: ou(dados.custoPorClique, brl),
      nota: dados.custoPorClique === null ? razaoSemNumero : "investimento ÷ cliques",
      limite:
        "É o custo de trazer alguém até o site, não o de gerar contato nem o de conquistar um paciente.",
    },
    {
      rotulo: "Visitas vindas de anúncio",
      valor: n(dados.sessoes),
      tom: "acao",
      nota: veiculou
        ? `${pctCurto(dados.sessoes, dados.sessoes + dados.naoPago.sessoes)} de todas as visitas`
        : "nenhuma no período",
      limite:
        "São as visitas classificadas como origem paga pela plataforma. Elas também estão contadas no total da visão geral — esta página as olha por origem, não as separa do site.",
    },
    {
      rotulo: "Pedidos de contato do anúncio",
      valor: n(dados.acoes),
      tom: "acao",
      nota:
        custoPorAcao !== null
          ? `${brl(custoPorAcao)} por pedido de contato`
          : "cliques no WhatsApp em visita paga",
      limite:
        "Custo por pedido de contato não é custo por paciente. Entre o clique no WhatsApp e a cadeira do consultório há a conversa, o orçamento e a agenda — nada disso é medido aqui.",
    },
  ];

  return (
    <Estrutura usuario={email} periodo={periodo}>
      <TituloDaPagina
        secao="Google Ads"
        titulo="A campanha está indo bem?"
        descricao="Tudo o que vem de anúncio pago, separado do resto do site. O que entra aqui não some da primeira página — são as mesmas visitas, olhadas por origem."
        periodo={periodo}
        geradoEm={dados.geradoEm}
      />

      {!veiculou ? (
        <div className="aviso">
          <p>
            <b>Aguardando veiculação.</b> A conta do Google Ads está vinculada e a
            marcação automática está ativa, então tudo o que for investido aparece
            aqui sozinho, sem nenhum ajuste. Até agora nenhuma campanha veiculou no
            período escolhido.
          </p>
          <p>
            Os cartões abaixo mostram <b>travessão</b>, e não zero, de propósito:
            zero afirmaria &ldquo;anunciou e não gastou&rdquo;, e não foi isso que
            aconteceu. A estrutura da página fica à mostra para que se saiba o que
            ela vai responder no dia em que a primeira campanha rodar.
          </p>
        </div>
      ) : null}

      <FilaKpi itens={kpis} colunas={6} />

      <div className="grid grid-3 section-gap">
        <Cartao
          titulo="Campanha por campanha"
          nota="Visitas, pedidos de contato e investimento de cada uma"
          largura={2}
          etiqueta={
            <span className={`chip ${dados.campanhas.length > 0 ? "acao" : ""}`}>
              {dados.campanhas.length > 0
                ? `${n(dados.campanhas.length)} ${plural(
                    dados.campanhas.length,
                    "campanha",
                    "campanhas",
                  )}`
                : "Aguardando veiculação"}
            </span>
          }
          limite="Só aparece aqui a campanha que trouxe ao menos uma visita no período. Campanha pausada, ou no ar sem nenhum clique, não vem como linha zerada — não vem linha nenhuma, porque o Analytics só conhece campanha que gerou sessão. Campanha nova também leva dias para dizer qualquer coisa."
        >
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Campanha</th>
                  <th scope="col" className="num">
                    Visitas
                  </th>
                  <th scope="col" className="num">
                    Pedidos de contato
                  </th>
                  <th scope="col" className="num">
                    Taxa
                  </th>
                  <th scope="col" className="num">
                    Investimento
                  </th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {dados.campanhas.length === 0 ? (
                  <tr>
                    <td>Nenhuma campanha veiculou no período</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td>
                      <span className="status warn">Aguardando</span>
                    </td>
                  </tr>
                ) : (
                  dados.campanhas.map((c) => (
                    <tr key={c.campanha}>
                      <td>{c.campanha || "Campanha sem nome registrado"}</td>
                      <td className="num">{n(c.sessoes)}</td>
                      <td className="num">{n(c.acoes)}</td>
                      <td className="num">{pct(c.acoes, c.sessoes)}</td>
                      <td className="num">{ou(c.custo, brl)}</td>
                      <td>
                        <span className={`status ${c.acoes > 0 ? "good" : ""}`}>
                          {c.acoes > 0 ? "Gerando contato" : "Trazendo visita"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Cartao>

        <Cartao
          titulo="Pago contra não pago"
          nota="A mesma taxa de ação, calculada em cada origem"
          tom="acao"
          limite="As duas bases têm tamanhos muito diferentes. Em volume baixo, uma ação a mais no lado pago move a taxa em dezenas de pontos — leia tendência de meses, nunca a semana."
        >
          <ul className="progress-list">
            <li>
              <div className="progress-top">
                <span>Visitas vindas de anúncio</span>
                <strong>{taxaPaga}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    ["--w" as string]: `${
                      dados.sessoes > 0
                        ? Math.min((dados.sessoesComAcao / dados.sessoes) * 100, 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </li>
            <li>
              <div className="progress-top">
                <span>Visitas de todo o resto</span>
                <strong>{taxaNaoPaga}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill contexto"
                  style={{
                    ["--w" as string]: `${
                      dados.naoPago.sessoes > 0
                        ? Math.min(
                            (dados.naoPago.sessoesComAcao / dados.naoPago.sessoes) * 100,
                            100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </li>
          </ul>

          <ul className="metric-list" style={{ marginTop: 18 }}>
            <li className="metric">
              <span>Visitas pagas</span>
              <strong>{n(dados.sessoes)}</strong>
            </li>
            <li className="metric">
              <span>Visitas não pagas</span>
              <strong>{n(dados.naoPago.sessoes)}</strong>
            </li>
            <li className="metric">
              <span>Custo por pedido de contato</span>
              <strong>{ou(custoPorAcao, brl)}</strong>
              <small>
                {custoPorAcao === null
                  ? razaoSemNumero
                  : "Investimento dividido pelos cliques no WhatsApp em visita paga."}
              </small>
            </li>
          </ul>
        </Cartao>
      </div>

      <div className="aviso section-gap">
        <p>
          <b>O que esta página consegue e o que não consegue dizer.</b> Ela lê o
          Google Analytics, que enxerga o anúncio pelo caminho que ele traz até o
          site. Por isso responde bem &ldquo;o anúncio trouxe gente e essa gente
          pediu contato?&rdquo;.
        </p>
        <p>
          O que ela <b>não</b> faz é listar as campanhas da conta do Google Ads —
          nem as pausadas, nem as que estão no ar sem nenhum clique. Para isso
          seria preciso ler a plataforma de anúncios diretamente, que é fonte de
          dado nova e exige aditivo próprio. A decisão de 06/08 foi não fazer
          agora: o painel entrega hoje o que o Analytics já autoriza, e a lista
          completa de campanhas fica registrada como pendência conhecida, e não
          como esquecimento.
        </p>
      </div>

      <Rodape geradoEm={dados.geradoEm} />
    </Estrutura>
  );
}
