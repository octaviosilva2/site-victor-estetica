import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/siteConfig";

interface ScheduleButtonProps {
  /** Texto do botão. Por padrão, "Agendar Avaliação". */
  children?: ReactNode;
  /** Mensagem pré-preenchida no WhatsApp (ex.: nome do procedimento). */
  message?: string;
  variant?: "solid" | "outline" | "light";
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: "px-4 py-2.5 text-[11px]",
  md: "px-6 py-3.5 text-[12.5px]",
};

const variants = {
  solid: "bg-primary text-primary-foreground hover:opacity-85",
  outline: "border border-primary text-primary hover:bg-primary/10",
  light: "bg-white text-primary hover:opacity-85",
};

/**
 * Botão de agendamento. Todo agendamento vai para o WhatsApp — o site
 * não tem formulário nem checkout.
 *
 * A classe `btn-texture` é o gancho para a textura do Canva (ver index.css).
 */
const ScheduleButton = ({
  children,
  message,
  variant = "solid",
  size = "md",
  className,
}: ScheduleButtonProps) => (
  <a
    href={whatsappLink(message)}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "btn-texture inline-flex items-center justify-center gap-2 rounded-[2px]",
      "font-semibold uppercase tracking-[0.05em] no-underline",
      "transition-opacity duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      sizes[size],
      variants[variant],
      className,
    )}
  >
    {children ?? siteConfig.cta.heroButton}
  </a>
);

export default ScheduleButton;
