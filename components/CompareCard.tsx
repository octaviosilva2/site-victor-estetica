"use client";

import { useRef } from "react";
import Image from "next/image";

type Props = {
  label: string;
  /** Caminho da foto de antes, dentro de /public. */
  before: string;
  /** Caminho da foto de depois, dentro de /public. */
  after: string;
  /** Texto alternativo base, sem descrever a pessoa. */
  alt: string;
};

/**
 * Card do carrossel de antes/depois, com a linha divisória arrastável.
 *
 * As duas fotos ficam empilhadas ocupando o card inteiro. A de cima é a de
 * depois, e o arraste recorta essa camada para revelar a de baixo.
 */
export default function CompareCard({ label, before, after, alt }: Props) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setPosition = (clientX: number) => {
    const media = mediaRef.current;
    const after = afterRef.current;
    const handle = handleRef.current;
    if (!media || !after || !handle) return;

    const rect = media.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));

    // Recorte, não redimensionamento. Antes das fotos entrarem, esta linha
    // reduzia a largura da camada — com imagem dentro, isso espremeria o
    // rosto horizontalmente enquanto a pessoa arrasta. O clip-path corta a
    // camada mantendo a foto no tamanho original.
    //
    // O corte é pela ESQUERDA: a camada de depois vai da alça até a borda
    // direita, deixando o antes, que está na camada de baixo, visível à
    // esquerda. Inverter este lado inverte de que lado aparece cada foto.
    after.style.clipPath = `inset(0 0 0 ${percent}%)`;
    handle.style.left = `${percent}%`;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    // Garante que o arraste continue mesmo se o cursor sair do card
    event.currentTarget.setPointerCapture(event.pointerId);
    setPosition(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setPosition(event.clientX);
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  // O card nunca passa de 300px de largura, então não faz sentido servir a
  // foto original de 2047px. Sem isto, cada card baixaria cerca de 500 KB.
  const sizes = "(min-width: 640px) 300px, 78vw";

  return (
    <div className="compare-card">
      <div
        className="compare-media"
        ref={mediaRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="compare-before">
          <Image src={before} alt={`${alt} — antes`} fill sizes={sizes} className="compare-img" />
          <span className="compare-tag compare-tag-before">Antes</span>
        </div>
        <div className="compare-after" ref={afterRef}>
          <Image src={after} alt={`${alt} — depois`} fill sizes={sizes} className="compare-img" />
          <span className="compare-tag compare-tag-after">Depois</span>
        </div>
        <div className="compare-handle" ref={handleRef}>
          <div className="compare-handle-btn" aria-hidden="true">
            ⇔
          </div>
        </div>
      </div>
      <div className="compare-label">{label}</div>
    </div>
  );
}
