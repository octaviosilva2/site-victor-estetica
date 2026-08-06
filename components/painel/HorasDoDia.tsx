import { n, plural } from "@/lib/painel/formato";

// Barras verticais por hora do dia — `.hour-chart` da demonstração, com a hora
// de pico destacada e balão por `data-tip`.
//
// A limitação vale mais que o desenho, e está escrita no cartão que envolve
// este componente: em volume baixo, uma hora isolada não diz nada. O gráfico
// existe para mostrar FAIXA — manhã, fim de tarde, noite —, não para apontar
// "às 14h as pessoas procuram".

export default function HorasDoDia({
  horarios,
}: {
  horarios: { hora: number; sessoes: number }[];
}) {
  const porHora = Array(24).fill(0) as number[];
  for (const item of horarios) {
    if (item.hora >= 0 && item.hora < 24) porHora[item.hora] += item.sessoes;
  }

  const maior = Math.max(...porHora, 0);

  if (maior === 0) {
    return (
      <p className="vazio">
        Ainda não há acessos suficientes no período para formar um padrão de
        horário.
      </p>
    );
  }

  return (
    <>
      <div className="hour-chart" role="img" aria-label={descrever(porHora, maior)}>
        {porHora.map((sessoes, hora) => (
          <i
            key={hora}
            className={`hour${sessoes === maior ? " peak" : ""}`}
            // 3% de altura mínima: uma hora com zero acesso continua ocupando
            // seu lugar na fileira, e a lacuna é informação.
            style={{ ["--h" as string]: `${Math.max((sessoes / maior) * 100, 3)}%` }}
            data-tip={`${hora}h — ${n(sessoes)} ${plural(sessoes, "visita", "visitas")}`}
          />
        ))}
      </div>
      <div className="hour-labels">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
    </>
  );
}

function descrever(porHora: number[], maior: number): string {
  const pico = porHora.indexOf(maior);
  return `Visitas por hora do dia. Maior movimento às ${pico}h, com ${n(maior)} ${plural(
    maior,
    "visita",
    "visitas",
  )}.`;
}
