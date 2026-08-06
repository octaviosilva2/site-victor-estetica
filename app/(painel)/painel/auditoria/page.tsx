import { auditar } from "@/lib/painel/auditoria";
import { exigirAcesso } from "@/lib/painel/sessao";

// PÁGINA TEMPORÁRIA — DIAGNÓSTICO, NÃO É PRODUTO.
//
// Não aparece no menu, não é indicador, não conta para os 12 do contrato. Serve
// para ler a resposta bruta da Data API no ambiente onde ela funciona: a
// identidade federada só autoriza o subject de produção, então nem localhost nem
// pré-visualização conseguem consultar a propriedade.
//
// Sai do repositório junto com `lib/painel/auditoria.ts` assim que a evidência
// estiver registrada em `13-evidencias.md`.

// Sem isto o Next tenta pré-renderizar a página no build, onde não há token
// OIDC — a consulta falharia e o build do SITE cairia junto.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Auditoria({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string }>;
}) {
  // Primeira linha, como em toda página do painel.
  await exigirAcesso();

  const dias = Number((await searchParams).dias) || 28;
  const consultas = await auditar(dias);

  return (
    <main className="pnl-largura">
      <h1 style={{ fontSize: 20, margin: "24px 0 4px" }}>
        Auditoria da Data API — janela de {dias} dias
      </h1>
      <p style={{ fontSize: 13, opacity: 0.7, margin: "0 0 20px" }}>
        Página temporária de diagnóstico. Troque a janela pelo endereço:{" "}
        <code>?dias=7</code>, <code>?dias=28</code>, <code>?dias=90</code>.
      </p>

      {consultas.map((c) => (
        <section key={c.titulo} className="pnl-cartao" style={{ marginBottom: 16 }}>
          <p className="pnl-cartao-rotulo">{c.titulo}</p>
          <p className="pnl-limite" style={{ marginTop: 0 }}>
            {c.proposito}
          </p>

          {c.erro ? (
            <pre style={estilo}>ERRO: {c.erro}</pre>
          ) : (
            <pre style={estilo}>
              {[
                `colunas: ${c.colunas.join(" | ") || "(nenhuma)"}`,
                `linhas devolvidas: ${c.linhas.length}   rowCount: ${c.totalDeLinhas ?? "?"}`,
                `LIMIAR DE PRIVACIDADE APLICADO: ${c.limiar ? "SIM" : "não"}`,
                `soma da 1a métrica: ${c.soma}`,
                "",
                ...c.linhas.map(
                  (l) =>
                    `  ${(l.chaves.join(" | ") || "(sem dimensão)").padEnd(44)} ${l.valores.join(" | ")}`,
                ),
              ].join("\n")}
            </pre>
          )}
        </section>
      ))}
    </main>
  );
}

const estilo: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  overflowX: "auto",
  whiteSpace: "pre",
  margin: 0,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
