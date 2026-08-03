import type { Metadata } from "next";

import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import MethodSection from "@/components/MethodSection";
import ProceduresSection from "@/components/ProceduresSection";
import ResultsSection from "@/components/ResultsSection";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import FinalSection from "@/components/FinalSection";
import ContactSection from "@/components/ContactSection";
import FooterAndFloating from "@/components/FooterAndFloating";
import WelcomeModal from "@/components/WelcomeModal";
import FadeInProvider from "@/components/FadeInProvider";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <MethodSection />
        <ProceduresSection />
        <ResultsSection />
        <AboutSection />
        <ReviewsSection />
        <FinalSection />
        <ContactSection />
      </main>
      <FooterAndFloating />

      <WelcomeModal />
      <FadeInProvider />
    </>
  );
}
