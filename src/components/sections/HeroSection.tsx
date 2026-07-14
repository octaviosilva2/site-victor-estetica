import { siteConfig } from "@/lib/siteConfig";
import { Button } from "@/components/ui/button";
import clinicReception from "@/assets/clinic-reception-new.png";
import heroMobile from "@/assets/hero-mobile.jpg";

const HeroSection = () => {
  const handleWhatsApp = () => {
    window.open(siteConfig.links.whatsappUrl, "_blank");
  };
  return (
    <section className="relative min-h-[92vh] sm:min-h-[600px] h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat scale-105 bg-center hidden sm:block"
        style={{ 
          backgroundImage: `url(${clinicReception})`,
          filter: 'blur(2px)'
        }}
      />
      {/* Background Image - Mobile */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat scale-105 bg-[center_30%] sm:hidden"
        style={{ 
          backgroundImage: `url(${heroMobile})`,
          filter: 'blur(2px)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/45" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up max-w-[90vw] sm:max-w-none mx-auto flex flex-col items-center">
        {/* Specialty Badge */}
        <span className="inline-block text-white/90 text-[0.65rem] sm:text-sm md:text-base font-semibold tracking-[0.25em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6 md:mb-8">
          {siteConfig.professional.specialty}
        </span>
        {/* Name */}
        <h1 className="font-luxerie text-[2rem] xs:text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-normal mb-4 sm:mb-4 md:mb-6 leading-[1.15] tracking-[0.12em] sm:tracking-widest whitespace-nowrap">
          {siteConfig.professional.name}
        </h1>
        {/* Support Text */}
        <p className="text-white/60 text-[0.8rem] sm:text-sm md:text-base max-w-[280px] sm:max-w-xl mx-auto mb-6 md:mb-8 leading-relaxed">
          Protocolos personalizados que unem ciência, precisão e naturalidade para resultados elegantes e progressivos.
        </p>
        {/* CTA Button */}
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-[min(300px,88%)] sm:w-auto px-10 md:px-16 py-5 sm:py-7 md:py-8 text-sm md:text-lg font-medium tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
        >
          {siteConfig.cta.heroButton}
        </Button>
      </div>
    </section>
  );
};
export default HeroSection;
