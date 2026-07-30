import { siteConfig } from "@/lib/siteConfig";

/**
 * Rodapé em fundo claro — o degradê de saída do Contato termina aqui.
 */
const FooterSection = () => (
  <footer className="bg-background px-6 py-9 text-center">
    <div className="mx-auto max-w-3xl">
      <p className="m-0 font-serif italic text-[12.5px] text-primary">{siteConfig.footer.brandLine}</p>
      <p className="mt-2 text-[11.5px] text-foreground-muted">
        {siteConfig.contact.clinicName} · {siteConfig.professional.credentials}
      </p>
      <p className="mt-1 text-[11px] text-foreground-muted/70">
        © {new Date().getFullYear()} {siteConfig.professional.name}. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default FooterSection;
