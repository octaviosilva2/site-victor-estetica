import { plural, quando } from "@/lib/painel/formato";
import { INICIO_DA_MEDICAO, dataCurta, type Periodo } from "@/lib/painel/periodo";

// O `.page-head` da demonstração: sobrancelha em maiúsculas, título grande,
// subtítulo e, à direita, o carimbo de atualização com a bolinha verde.
//
// Logo abaixo vem a linha que diz o que o período escolhido cobre de verdade.
// Ela não é decoração: é a **regra 8 de `08-matriz-do-dashboard.md`**, vinda do
// achado E0.11. A medição começou numa data, e um período que começa antes dela
// não tem menos movimento — tem menos medição. Sem esta linha, "este ano" e
// "esta semana" mostram o mesmo número e o cliente conclui que o painel travou.

export default function TituloDaPagina({
  secao,
  titulo,
  descricao,
  periodo,
  geradoEm,
}: {
  /** A sobrancelha. O nome da página, em maiúsculas. */
  secao: string;
  titulo: string;
  descricao: string;
  periodo: Periodo;
  /** Quando a leitura do Analytics foi feita. */
  geradoEm: string;
}) {
  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">{secao}</p>
          <h1>{titulo}</h1>
          <p className="page-sub">{descricao}</p>
        </div>
        <span className="updated">
          <i />
          Atualizado em {quando(geradoEm)}
        </span>
      </div>

      <AlcanceDoPeriodo periodo={periodo} />
    </>
  );
}

function AlcanceDoPeriodo({ periodo }: { periodo: Periodo }) {
  const parcial = periodo.diasMedidos < periodo.dias;

  return (
    <div className="aviso">
      <p>
        <b>{periodo.rotulo}</b> — {periodo.descricao}.{" "}
        {periodo.diasMedidos === 0 ? (
          <>
            Este período é <b>inteiro anterior ao início da medição</b>, em{" "}
            {dataCurta(INICIO_DA_MEDICAO)}. Não há o que mostrar aqui — e isso
            não quer dizer que ninguém visitou o site.
          </>
        ) : parcial ? (
          <>
            A medição começou em <b>{dataCurta(INICIO_DA_MEDICAO)}</b>, então
            destes {periodo.dias} dias há dado de{" "}
            <b>
              {periodo.diasMedidos} {plural(periodo.diasMedidos, "dia", "dias")}
            </b>
            . Períodos maiores ainda mostram os mesmos números — não é o painel
            travado, é o histórico que ainda está sendo formado.
          </>
        ) : (
          <>
            {periodo.dias} {plural(periodo.dias, "dia", "dias")} de medição
            {periodo.incluiHoje ? ", incluindo hoje, que ainda é preliminar" : ""}.
          </>
        )}
      </p>
    </div>
  );
}
