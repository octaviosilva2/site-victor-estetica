import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";
import { Separator } from "@/components/ui/separator";

const MethodSection = () => {
  return (
    <>
      <Separator className="bg-border/30" />
      <section className="section-padding relative" style={{ background: "linear-gradient(180deg, hsl(var(--background-subtle)) 0%, hsl(var(--background)) 100%)" }}>
        <div className="container-narrow">
          <FadeIn className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Método baseado em ciência, não em tendências
            </h2>
            <div className="w-20 h-0.5 bg-primary mx-auto" />
          </FadeIn>

          <FadeInUp delay={100} className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-foreground-muted text-lg leading-relaxed">
              A estética deve respeitar anatomia, proporção e biologia.
              Íntegro conhecimento clínico, farmacológico e estético para avaliar cada paciente de forma global, garantindo maior segurança, previsibilidade e resultados naturais.
            </p>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Cada protocolo é estruturado de forma personalizada, considerando estrutura facial, qualidade de pele, histórico clínico e objetivos individuais.
            </p>

            {/* Premium Quote Box */}
            <div className="mt-10 mx-auto max-w-lg">
              <blockquote className="border-l-2 border-primary bg-background-subtle/60 rounded-r-xl pl-6 pr-6 py-5">
                <p className="font-playfair text-xl md:text-2xl text-foreground italic">
                  "Naturalidade não é acaso. É planejamento."
                </p>
              </blockquote>
            </div>
          </FadeInUp>
        </div>
      </section>
      <Separator className="bg-border/30" />
    </>
  );
};

export default MethodSection;
