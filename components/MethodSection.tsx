import { Fragment } from "react";

const flowSteps = [
  { num: "01", label: "Avaliação" },
  { num: "02", label: "Planejamento" },
  { num: "03", label: "Procedimento" },
];

const differentials = [
  {
    title: "Avaliação antes de tudo",
    text: "Nenhum procedimento é indicado sem uma avaliação individual completa do seu caso.",
    path: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
  },
  {
    title: "Resultado sem exagero",
    text: "O objetivo é harmonia, não transformação — resultado que respeita sua identidade.",
    path: <path d="M12 2C9 6 4 9 4 14a8 8 0 0016 0c0-5-5-8-8-12z" />,
  },
  {
    title: "Segurança farmacêutica",
    text: "Protocolos e produtos regulamentados, com responsabilidade técnica de um farmacêutico esteta.",
    path: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />,
  },
  {
    title: "Base científica",
    text: "Técnicas atualizadas com respaldo em literatura científica, não em tendência.",
    path: (
      <>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </>
    ),
  },
  {
    title: "Agenda reservada",
    text: "Atendimento sem volume — cada horário é dedicado inteiramente a um único paciente.",
    path: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18M8 2v4M16 2v4" />
      </>
    ),
  },
  {
    title: "Acompanhamento real",
    text: "Orientação e suporte após o procedimento, do planejamento até a recuperação.",
    path: (
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    ),
  },
];

export default function MethodSection() {
  return (
    <section
      id="metodo"
      style={{ background: "var(--white)", paddingTop: 88, paddingBottom: 88 }}
    >
      <div className="container">
        <p className="eyebrow fade">Método</p>
        <h2 className="section-title fade">Método baseado em ciência, não em tendências</h2>
        <p className="section-sub fade">
          Cada indicação nasce de uma avaliação real — não de uma lista de procedimentos da moda.
          O caminho é sempre o mesmo, na ordem certa:
        </p>

        <div className="flow fade">
          {flowSteps.map((step, index) => (
            <Fragment key={step.num}>
              <div className="flow-step">
                <div className="flow-num">{step.num}</div>
                <div className="flow-label">{step.label}</div>
              </div>
              {/* Linha entre as etapas, exceto depois da última */}
              {index < flowSteps.length - 1 && <div className="flow-line" />}
            </Fragment>
          ))}
        </div>
        <p className="method-punch fade">&ldquo;Naturalidade não é acaso. É planejamento.&rdquo;</p>

        <div className="diff-grid">
          {differentials.map((item) => (
            <div className="diff-card fade" key={item.title}>
              <div className="diff-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {item.path}
                </svg>
              </div>
              <h3 className="diff-title">{item.title}</h3>
              <p className="diff-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
