// Ícones usados em vários pontos do site. Ficam num arquivo só para o path
// do WhatsApp (que é longo) não se repetir em cinco componentes diferentes.

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function WhatsAppIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C22 6.45 17.5 2 12.04 2zm5.79 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.15-4.94-4.35-.15-.2-1.18-1.57-1.18-3s.75-2.12 1.02-2.41c.26-.28.58-.36.77-.36h.55c.18 0 .42-.03.65.5.24.55.82 1.9.9 2.04.08.14.13.3.03.5-.1.2-.15.31-.29.48-.15.17-.31.38-.44.51-.14.14-.29.29-.13.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.11.61-.07.17-.18.71-.83.9-1.11.19-.28.38-.23.63-.14.26.09 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

export function InstagramIcon({ className, style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
