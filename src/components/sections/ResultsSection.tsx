import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const ResultsSection = () => {
  return (
    <section id="resultados" className="section-padding bg-background">
      <div className="container-narrow">
        {/* Title */}
        <FadeIn className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Resultados reais. Elegância sem exageros.
          </h2>
          <p className="text-foreground-muted max-w-xl mx-auto mb-6">
            A prioridade não é transformar, é harmonizar.
            Resultados progressivos, seguros e compatíveis com sua estrutura.
          </p>
          <div className="w-20 h-0.5 bg-primary mx-auto" />
        </FadeIn>
        {/* Photos */}
        <FadeInUp delay={100}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img src="/ANTESEDEPOIS_1.jpg" alt="Resultado 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img src="/ANTESEDEPOIS_2.jpg" alt="Resultado 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img src="/ANTESEDEPOIS_3.jpg" alt="Resultado 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};
export default ResultsSection;
