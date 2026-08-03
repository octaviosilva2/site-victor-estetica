"use client";

import { useEffect } from "react";

/**
 * Ativa a entrada suave dos elementos com a classe "fade".
 *
 * O CSS deixa esses elementos visíveis por padrão — a classe "pre" (que os
 * esconde) só é aplicada aqui, por JS. Assim, se o JS não rodar ou o Google
 * indexar sem executar scripts, o conteúdo aparece normalmente.
 */
export default function FadeInProvider() {
  useEffect(() => {
    // Respeita quem pediu menos animação no sistema operacional
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const elements = document.querySelectorAll<HTMLElement>(".fade");
    elements.forEach((el) => el.classList.add("pre"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
