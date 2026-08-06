import { redirect } from "next/navigation";

import { auth, temAcesso } from "@/auth";

// Trava de acesso do painel. É a segunda das duas — a primeira é o callback
// `signIn` de `auth.ts`, que impede a sessão de nascer para quem não está na
// lista de permissão.
//
// Esta existe porque a primeira roda **uma vez**, no login. A lista pode mudar
// depois, e a sessão em cookie continuaria valendo por dias. Reavaliar a cada
// carregamento é o que faz a troca da variável de ambiente ter efeito imediato.
//
// Critério C15 de `05-escopo-contratado.md`: nenhuma rota do painel, incluindo
// as de dados, responde a quem não está autenticado e autorizado. Por isso o
// painel **não tem** rota de dados separada: toda leitura do Analytics acontece
// dentro da própria página, depois desta chamada. Não há endpoint a proteger
// porque não há endpoint.

/**
 * Interrompe a renderização se quem carregou a página não for o cliente.
 *
 * Chamar como **primeira linha** de toda página do painel, antes de qualquer
 * consulta. `redirect()` lança — nada abaixo dela executa.
 */
export async function exigirAcesso(): Promise<{ email: string }> {
  const sessao = await auth();
  const email = sessao?.user?.email;

  if (!email) {
    redirect("/painel/entrar");
  }

  if (!temAcesso(email)) {
    // Sessão válida, endereço fora da lista. Caso possível quando a variável
    // muda depois do login. Vai para a mesma tela, com o motivo, para não
    // entrar em ciclo de redirecionamento com a tela de entrada.
    redirect("/painel/entrar?motivo=sem-acesso");
  }

  return { email };
}
