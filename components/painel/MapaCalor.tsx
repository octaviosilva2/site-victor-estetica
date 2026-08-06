import { DIAS_SEMANA, n } from "@/lib/painel/formato";

// Mapa de calor de hora por dia da semana.
//
// A limitação declarada em `08-matriz-do-dashboard.md` vale mais que o gráfico:
// em volume baixo, uma célula isolada não diz nada. O desenho existe para
// mostrar FAIXAS — manhã, fim de tarde, fim de semana — e é assim que o rótulo
// abaixo dele pede para ser lido.

export default function MapaCalor({
  horarios,
}: {
  horarios: { diaSemana: number; hora: number; sessoes: number }[];
}) {
  if (horarios.length === 0) {
    return (
      <p className="pnl-vazio">
        Ainda não há acessos suficientes no período para formar um padrão de
        horário.
      </p>
    );
  }

  // Matriz 7 x 24 preenchida com zero, para que as horas sem acesso apareçam
  // como célula vazia em vez de sumirem da grade.
  const grade: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const item of horarios) {
    if (item.diaSemana >= 0 && item.diaSemana < 7 && item.hora >= 0 && item.hora < 24) {
      grade[item.diaSemana][item.hora] = item.sessoes;
    }
  }

  const maior = Math.max(...horarios.map((h) => h.sessoes), 1);

  return (
    <div className="pnl-rolagem">
      <table className="pnl-calor">
        <caption className="pnl-vazio" style={{ captionSide: "bottom", textAlign: "left" }}>
          Cada quadrado é uma hora. Quanto mais escuro, mais sessões.
        </caption>
        <thead>
          <tr>
            <th scope="col" />
            {Array.from({ length: 24 }, (_, hora) => (
              <th key={hora} scope="col">
                {hora % 6 === 0 ? `${hora}h` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grade.map((linha, dia) => (
            <tr key={dia}>
              <th scope="row">{DIAS_SEMANA[dia]}</th>
              {linha.map((sessoes, hora) => (
                <td key={hora}>
                  <span
                    className="pnl-calor-celula"
                    style={{
                      // Transparência proporcional. O tom é sempre o verde da
                      // marca; o que varia é quanto do fundo aparece.
                      background:
                        sessoes === 0
                          ? "var(--bg-alt)"
                          : `rgba(75, 90, 69, ${(0.15 + (sessoes / maior) * 0.85).toFixed(2)})`,
                    }}
                    title={`${DIAS_SEMANA[dia]}, ${hora}h — ${n(sessoes)} ${sessoes === 1 ? "sessão" : "sessões"}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
