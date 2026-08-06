import { DIAS_SEMANA, n } from "@/lib/painel/formato";

// Mapa de calor de hora por dia da semana.
//
// A limitação declarada em `08-matriz-do-dashboard.md` vale mais que o gráfico:
// em volume baixo, uma célula isolada não diz nada. O desenho existe para
// mostrar FAIXAS — manhã, fim de tarde, fim de semana — e é assim que o rótulo
// abaixo dele pede para ser lido.
//
// O tom é sempre o azul da ação; o que varia é quanto do fundo aparece. Uma
// escala de matizes diferentes sugeriria categorias, e aqui há só intensidade.

export default function MapaCalor({
  horarios,
}: {
  horarios: { diaSemana: number; hora: number; sessoes: number }[];
}) {
  if (horarios.length === 0) {
    return (
      <p className="vazio">
        Ainda não há acessos suficientes no período para formar um padrão de
        horário.
      </p>
    );
  }

  // Matriz 7 × 24 preenchida com zero, para que as horas sem acesso apareçam
  // como célula vazia em vez de sumirem da grade.
  const grade: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const item of horarios) {
    if (item.diaSemana >= 0 && item.diaSemana < 7 && item.hora >= 0 && item.hora < 24) {
      grade[item.diaSemana][item.hora] = item.sessoes;
    }
  }

  const maior = Math.max(...horarios.map((h) => h.sessoes), 1);

  return (
    <div className="table-wrap">
      <table className="calor">
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
                    className="calor-celula"
                    style={{
                      background:
                        sessoes === 0
                          ? "var(--surface-3)"
                          : `rgb(36 107 253 / ${(0.18 + (sessoes / maior) * 0.82).toFixed(2)})`,
                    }}
                    data-tip={`${DIAS_SEMANA[dia]}, ${hora}h — ${n(sessoes)} ${
                      sessoes === 1 ? "visita" : "visitas"
                    }`}
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
