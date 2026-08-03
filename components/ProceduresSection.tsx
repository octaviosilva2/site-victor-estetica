import CategoryExplorer from "@/components/CategoryExplorer";

export default function ProceduresSection() {
  return (
    <section id="procedimentos">
      <div className="container">
        <p className="eyebrow fade">Áreas de Atuação</p>
        <h2 className="section-title fade">Onde o cuidado é concentrado</h2>
        <p className="section-sub fade">
          Cada área reúne um conjunto de procedimentos com objetivo em comum. A indicação exata é
          sempre definida na avaliação — clique em um procedimento pra entender mais, mas o
          próximo passo real é conversar comigo.
        </p>

        <CategoryExplorer />
      </div>
    </section>
  );
}
