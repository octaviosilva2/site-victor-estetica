// O que muda de cliente para cliente.
//
// **Este arquivo é a fronteira do produto.** O painel é ativo da Escale IA
// (decisão D7 de `05-escopo-contratado.md`): os componentes, os tokens de
// design e a camada de consulta são os mesmos em qualquer implantação. O que
// varia é o que está aqui — e só o que está aqui.
//
// A regra prática, para quem for montar o próximo cliente: se você precisou
// editar um componente para atender a um cliente, o componente está errado ou
// falta uma chave neste arquivo. Cor **não** entra: a identidade é da agência,
// não do cliente, e é isso que faz o painel parecer produto e não peça
// avulsa. O que o cliente reconhece como dele é o nome, o vocabulário do
// negócio dele e o dado — que nunca sai da propriedade dele.

export type Instancia = {
  /** Como o cliente se chama no cabeçalho. */
  cliente: string;
  /** Linha de baixo do cabeçalho. */
  subtitulo: string;
  /**
   * A ação que este negócio considera importante, por extenso.
   *
   * Existe como texto porque atravessa o painel inteiro: título de seção,
   * linha de limite, texto do bloco de contexto. Escrita uma vez, muda em
   * todos os lugares ao mesmo tempo.
   */
  acaoImportante: {
    /** Nome curto. Vira rótulo de cartão. */
    nome: string;
    /** O que a pessoa fez, em uma frase. */
    oQueE: string;
    /** O que ela **não** prova. */
    oQueNaoE: string;
  };
  /** Os sinais de contexto, nomeados. Nunca somam com a ação importante. */
  sinaisDeContexto: string[];
};

export const INSTANCIA: Instancia = {
  cliente: "Dr. Victor Folster",
  subtitulo: "Painel de resultados do site",
  acaoImportante: {
    nome: "Cliques no WhatsApp",
    oQueE: "o clique que abre uma conversa no WhatsApp, de qualquer ponto do site",
    oQueNaoE: "conversa iniciada, agendamento confirmado nem paciente atendido",
  },
  sinaisDeContexto: ["Instagram", "endereço", "Grupo VIP"],
};

/**
 * Os sinais de contexto escritos como uma frase em português.
 *
 * `["Instagram", "endereço", "Grupo VIP"]` vira
 * `Instagram, endereço e Grupo VIP`.
 */
export function sinaisPorExtenso(): string {
  const sinais = INSTANCIA.sinaisDeContexto;
  if (sinais.length <= 1) return sinais.join("");
  return `${sinais.slice(0, -1).join(", ")} e ${sinais[sinais.length - 1]}`;
}
