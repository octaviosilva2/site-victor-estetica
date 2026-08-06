// Filtro global de período do painel, em linguagem de negócio.
//
// **Por que não é mais "7 / 28 / 90 dias".** Ninguém administra um consultório
// pensando em janelas de 28 dias. Pensa em "este mês", "mês passado", "este
// ano". O recorte de N dias é como a plataforma conta, não como o cliente
// decide — e um painel que fala a língua da ferramenta obriga o leitor a fazer
// a tradução na cabeça toda vez.
//
// **A regra que este arquivo carrega junto.** Achado E0.11 de
// `13-evidencias.md`: a propriedade tem série curta, e uma janela grande não
// contém mais dado do que uma pequena. Trocar "esta semana" por "este ano" e
// ver o mesmo número é o sintoma clássico de painel quebrado. Por isso todo
// período sabe dizer **quantos dias dele são realmente medidos** — é o que a
// regra 8 de `08-matriz-do-dashboard.md` exige declarar na tela.

/**
 * Primeiro dia com medição em produção.
 *
 * O container foi publicado em 2026-08-05 (EV-26 e EV-27). Antes disso não há
 * ausência de visita: há ausência de medição, que é outra coisa e não pode ser
 * mostrada como se fosse queda.
 */
export const INICIO_DA_MEDICAO = "2026-08-05";

/** Fuso do cliente. Toda data do painel é o dia como ele o viveu. */
const FUSO = "America/Sao_Paulo";

export type Periodo = {
  /** Identificador que viaja na URL. */
  chave: string;
  /** Como o período se chama para o cliente. */
  rotulo: string;
  /** Frase que descreve o recorte por extenso, para o cabeçalho da página. */
  descricao: string;
  /** Início da janela, AAAA-MM-DD. */
  inicio: string;
  /** Fim da janela, AAAA-MM-DD. */
  fim: string;
  /** Início da janela anterior de mesma duração. */
  inicioAnterior: string;
  /** Fim da janela anterior. */
  fimAnterior: string;
  /** Dias corridos que a janela abrange. */
  dias: number;
  /** Dias da janela que estão dentro do período medido. */
  diasMedidos: number;
  /** O período inclui o dia de hoje, cujos números ainda são preliminares. */
  incluiHoje: boolean;
};

// ---------------------------------------------------------------------------
// Aritmética de datas no fuso do cliente
// ---------------------------------------------------------------------------
//
// Tudo aqui trabalha com a string AAAA-MM-DD e com datas em UTC ao meio-dia.
// O meio-dia é deliberado: somar ou subtrair dias a partir da meia-noite cai
// em cima de mudança de horário e produz o dia anterior de vez em quando.

function hojeNoFuso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function paraData(iso: string): Date {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia, 12));
}

function paraIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function somarDias(iso: string, dias: number): string {
  const data = paraData(iso);
  data.setUTCDate(data.getUTCDate() + dias);
  return paraIso(data);
}

/** Dias corridos de `de` até `ate`, incluindo os dois extremos. */
function contarDias(de: string, ate: string): number {
  const diff = (paraData(ate).getTime() - paraData(de).getTime()) / 86400000;
  return Math.max(Math.round(diff) + 1, 0);
}

/** O maior de dois dias. */
function maisTarde(a: string, b: string): string {
  return a > b ? a : b;
}

// ---------------------------------------------------------------------------
// Os períodos oferecidos
// ---------------------------------------------------------------------------

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** `2026-08` → `agosto de 2026`. */
export function nomeDoMes(anoMes: string): string {
  const [ano, mes] = anoMes.split("-").map(Number);
  return `${MESES[mes - 1]} de ${ano}`;
}

/** `2026-08-05` → `05/08/2026`. */
export function dataCurta(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Segunda-feira da semana de `iso`.
 *
 * Segunda, e não domingo: a semana comercial do consultório começa na segunda,
 * e um recorte que começa no domingo joga o fim de semana no início da semana
 * seguinte, onde ele não pertence para quem lê.
 */
function segundaDaSemana(iso: string): string {
  const data = paraData(iso);
  // getUTCDay: 0 é domingo. Domingo recua 6 dias, não 0.
  const diaDaSemana = data.getUTCDay();
  return somarDias(iso, diaDaSemana === 0 ? -6 : 1 - diaDaSemana);
}

export type OpcaoPeriodo = { chave: string; rotulo: string };

/** As opções fixas do seletor, na ordem em que aparecem. */
export const PERIODOS: OpcaoPeriodo[] = [
  { chave: "semana", rotulo: "Esta semana" },
  { chave: "mes", rotulo: "Este mês" },
  { chave: "mes-passado", rotulo: "Mês passado" },
  { chave: "ano", rotulo: "Este ano" },
];

export const PERIODO_PADRAO = "mes";

/**
 * Meses que já existem para escolher, do mais recente para o mais antigo.
 *
 * A lista começa no mês em que a medição começou — oferecer meses anteriores
 * seria oferecer telas garantidamente vazias, que o cliente leria como queda.
 */
export function mesesDisponiveis(): { chave: string; rotulo: string }[] {
  const hoje = hojeNoFuso();
  const meses: { chave: string; rotulo: string }[] = [];

  let cursor = hoje.slice(0, 7);
  const primeiro = INICIO_DA_MEDICAO.slice(0, 7);

  while (cursor >= primeiro && meses.length < 36) {
    meses.push({ chave: cursor, rotulo: nomeDoMes(cursor) });
    const [ano, mes] = cursor.split("-").map(Number);
    cursor =
      mes === 1
        ? `${ano - 1}-12`
        : `${ano}-${String(mes - 1).padStart(2, "0")}`;
  }

  return meses;
}

function montar(
  chave: string,
  rotulo: string,
  descricao: string,
  inicio: string,
  fim: string,
): Periodo {
  const dias = contarDias(inicio, fim);
  // A janela anterior tem a mesma duração e termina na véspera do início.
  const fimAnterior = somarDias(inicio, -1);
  const inicioAnterior = somarDias(fimAnterior, -(dias - 1));

  // Quantos dias desta janela a medição realmente cobre. É o número que
  // sustenta o aviso da regra 8 — sem ele, "este ano" parece um ano de dado.
  const primeiroMedido = maisTarde(inicio, INICIO_DA_MEDICAO);
  const diasMedidos = primeiroMedido > fim ? 0 : contarDias(primeiroMedido, fim);

  return {
    chave,
    rotulo,
    descricao,
    inicio,
    fim,
    inicioAnterior,
    fimAnterior,
    dias,
    diasMedidos,
    incluiHoje: fim === hojeNoFuso(),
  };
}

/**
 * Lê o período do endereço.
 *
 * Aceita as chaves fixas e também `AAAA-MM` para um mês escolhido. Valor
 * desconhecido cai no padrão em vez de dar erro: o parâmetro vem da URL e
 * qualquer pessoa pode digitar o que quiser nele.
 */
export function lerPeriodo(valor: string | undefined): Periodo {
  const hoje = hojeNoFuso();

  // Um mês específico, escolhido na lista.
  if (valor && /^\d{4}-(0[1-9]|1[0-2])$/.test(valor)) {
    const inicio = `${valor}-01`;
    const [ano, mes] = valor.split("-").map(Number);
    // Dia 0 do mês seguinte é o último dia deste mês, inclusive em fevereiro.
    const ultimo = paraIso(new Date(Date.UTC(ano, mes, 0, 12)));
    // Mês corrente não vai até o fim do mês: o futuro não tem dado, e uma
    // janela que termina daqui a três semanas faz a comparação com o período
    // anterior comparar um mês inteiro com um pedaço de mês.
    const fim = ultimo > hoje ? hoje : ultimo;
    return montar(valor, nomeDoMes(valor), `${dataCurta(inicio)} a ${dataCurta(fim)}`, inicio, fim);
  }

  switch (valor) {
    case "semana": {
      const inicio = segundaDaSemana(hoje);
      return montar(
        "semana",
        "Esta semana",
        `de segunda, ${dataCurta(inicio)}, até hoje`,
        inicio,
        hoje,
      );
    }

    case "mes-passado": {
      const [ano, mes] = hoje.split("-").map(Number);
      const anoAnterior = mes === 1 ? ano - 1 : ano;
      const mesAnterior = mes === 1 ? 12 : mes - 1;
      const chave = `${anoAnterior}-${String(mesAnterior).padStart(2, "0")}`;
      const inicio = `${chave}-01`;
      const fim = paraIso(new Date(Date.UTC(anoAnterior, mesAnterior, 0, 12)));
      return montar(
        "mes-passado",
        "Mês passado",
        `${nomeDoMes(chave)}, fechado`,
        inicio,
        fim,
      );
    }

    case "ano": {
      const inicio = `${hoje.slice(0, 4)}-01-01`;
      return montar("ano", "Este ano", `de 1º de janeiro até hoje`, inicio, hoje);
    }

    case "mes":
    default: {
      const inicio = `${hoje.slice(0, 7)}-01`;
      return montar(
        "mes",
        "Este mês",
        `${nomeDoMes(hoje.slice(0, 7))}, do dia 1 até hoje`,
        inicio,
        hoje,
      );
    }
  }
}
