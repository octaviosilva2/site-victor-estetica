import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProceduresSection from "@/components/sections/ProceduresSection";
import AboutSection from "@/components/sections/AboutSection";
import MethodSection from "@/components/sections/MethodSection";
import ResultsSection from "@/components/sections/ResultsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FinalSection from "@/components/sections/FinalSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="overflow-x-hidden">
    <Navbar />
    <main>
      <HeroSection />
      <ProceduresSection />
      <AboutSection />
      <MethodSection />
      <ResultsSection />
      <ReviewsSection />
      <FinalSection />
      <ContactSection />
    </main>
    <FooterSection />
    <WhatsAppButton />
  </div>
);

export default Index;
