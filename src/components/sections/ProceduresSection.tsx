import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProceduresSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Use fewer procedures for cleaner look
  const mainProcedures = siteConfig.procedures;

  // Split into 2 columns
  const midpoint = Math.ceil(mainProcedures.length / 2);
  const leftColumn = mainProcedures.slice(0, midpoint);
  const rightColumn = mainProcedures.slice(midpoint);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleWhatsApp = (procedure: string) => {
    window.open(
      `https://wa.me/${siteConfig.contact.whatsapp}?text=Olá! Gostaria de saber mais sobre ${procedure}.`,
      "_blank"
    );
  };

  const ProcedureItem = ({ procedure, index }: { procedure: string; index: number }) => {
    const isExpanded = expandedIndex === index;

    return (
      <div className="border-b border-border/50 last:border-b-0">
        <button
          onClick={() => handleToggle(index)}
          className="w-full flex items-center justify-between py-4 text-left group"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
            <span className="text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {procedure}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-primary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-4 pl-6 animate-fade-in">
            <p className="text-foreground-muted text-sm mb-3 whitespace-pre-line">
              {siteConfig.procedureDetails?.[procedure] || "Procedimento realizado com técnicas modernas e seguras, garantindo resultados naturais e harmoniosos."}
            </p>
            <Button
              onClick={() => handleWhatsApp(procedure)}
              variant="outline"
              size="sm"
              className="rounded-full text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Saiba mais sobre o procedimento
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="procedimentos" className="section-padding bg-background-subtle">
      <div className="container-narrow">
        {/* Title */}
        <FadeIn className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Procedimentos
          </h2>
          <p className="text-foreground-muted max-w-xl mx-auto mb-6">
            Cada procedimento é indicado após avaliação criteriosa, respeitando a fisiologia da pele e a identidade facial.
          </p>
          <div className="w-20 h-0.5 bg-primary mx-auto" />
        </FadeIn>

        {/* Procedures Grid - 2 columns */}
        <FadeInUp delay={200} className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20">
          <div>
            {leftColumn.map((procedure, index) => (
              <ProcedureItem key={index} procedure={procedure} index={index} />
            ))}
          </div>
          <div>
            {rightColumn.map((procedure, index) => (
              <ProcedureItem
                key={midpoint + index}
                procedure={procedure}
                index={midpoint + index}
              />
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default ProceduresSection;
