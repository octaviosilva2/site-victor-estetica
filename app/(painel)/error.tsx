"use client";

// Tela de falha do painel.
//
// A leitura do Analytics acontece em tempo de execução, contra um serviço
// externo: credencial expirada, cota estourada ou instabilidade do Google
// derrubam a página. Sem este arquivo, o cliente veria a tela de erro genérica
// do Next, em inglês.
//
// Nada de número aparece aqui. Um painel que mostra zero quando na verdade não
// conseguiu ler é pior do que um painel que assume a falha.

export default function ErroDoPainel({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="entrada">
      <div className="entrada-caixa">
        <h1>Não foi possível carregar os números</h1>
        <p>
          A leitura dos dados falhou agora. Isso costuma ser temporário —
          tente de novo em alguns minutos. Se continuar, avise o Octavio.
        </p>
        <button type="button" className="botao" onClick={reset}>
          Tentar de novo
        </button>
      </div>
    </div>
  );
}
