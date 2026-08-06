import { quando } from "@/lib/painel/formato";

// Aviso de frescor. Obrigatório em todas as páginas — regra 5 de
// `08-matriz-do-dashboard.md`.
//
// Duas coisas precisam estar escritas, e as duas costumam ser a explicação de
// uma dúvida futura do cliente:
//
// 1. O dado do dia corrente é preliminar. A plataforma leva de 24 a 48 horas
//    para processar, e o crédito de atribuição pode ser recalculado por até 12
//    dias (`06-plano-de-medicao.md`, seção 3). Números de hoje mudam sozinhos.
// 2. A leitura é guardada por 12 horas. Recarregar a página não traz número
//    novo — e isso é escolha, não lentidão.

export default function Rodape({ geradoEm }: { geradoEm: string }) {
  return (
    <footer className="pnl-largura pnl-rodape">
      <p>
        Dados lidos em <b>{quando(geradoEm)}</b>. A leitura é atualizada a cada
        12 horas — recarregar a página não busca números novos.
      </p>
      <p>
        Os números de <b>hoje são preliminares</b>: o processamento leva de 24 a
        48 horas e a atribuição pode ser recalculada por até 12 dias. Comparações
        justas usam períodos já fechados.
      </p>
      <p>
        Linhas com pouquíssimos acessos podem não aparecer. É proteção de
        privacidade da própria plataforma, não falha da medição.
      </p>
    </footer>
  );
}
