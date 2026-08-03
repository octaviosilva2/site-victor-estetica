"use client";

import { useRef } from "react";

type Props = {
  label: string;
};

/**
 * Card do carrossel de antes/depois, com a linha divisória arrastável.
 *
 * Hoje mostra os blocos de placeholder — as fotos reais ainda não foram
 * liberadas. Quando forem, é aqui que as duas imagens entram, dentro de
 * .compare-before e .compare-after; o arraste já funciona.
 */
export default function CompareCard({ label }: Props) {
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
    after.style.width = `${percent}%`;
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
        <div className="compare-before">Antes</div>
        <div className="compare-after" ref={afterRef}>
          Depois
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
