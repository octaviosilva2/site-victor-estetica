import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MethodSection from "@/components/sections/MethodSection";
import ProceduresSection from "@/components/sections/ProceduresSection";
import ResultsSection from "@/components/sections/ResultsSection";
import FinalSection from "@/components/sections/FinalSection";
import FooterSection from "@/components/sections/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import logoVictor from "@/assets/logo-victor.png";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <img src={logoVictor} alt="Dr. Victor Folster" className="h-8 sm:h-10 w-auto invert opacity-90" />
      </div>
      <HeroSection />
      <AboutSection />
      <MethodSection />
      <ProceduresSection />
      <ResultsSection />
      <FinalSection />
      <FooterSection />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
