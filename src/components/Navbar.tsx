import { siteConfig } from "@/lib/siteConfig";
import ScheduleButton from "@/components/ScheduleButton";
import logoVictor from "@/assets/logo-victor.png";

/**
 * Nav fixa no topo, sempre em verde bem escuro — não muda de cor ao rolar.
 * No mobile os links rolam na horizontal em vez de virar menu sanduíche.
 */
const Navbar = () => (
  <nav className="sticky top-0 z-30 border-b border-white/10 bg-background-dark/95 backdrop-blur-md">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
      <a
        href="#top"
        className="flex flex-shrink-0 items-center gap-2 no-underline"
        aria-label={`${siteConfig.professional.name} — início`}
      >
        <img src={logoVictor} alt="" className="h-7 w-auto invert" aria-hidden="true" />
        {/* No mobile o monograma já identifica a marca — o nome sairia
            comprimindo os links de navegação. */}
        <span className="hidden whitespace-nowrap font-serif text-base text-white sm:inline">
          Victor Folster
        </span>
      </a>

      <ul className="no-scrollbar m-0 flex min-w-0 flex-1 list-none gap-5 overflow-x-auto px-1">
        {siteConfig.nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.02em] text-white/70 no-underline transition-colors hover:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <ScheduleButton size="sm" className="flex-shrink-0" />
    </div>
  </nav>
);

export default Navbar;
