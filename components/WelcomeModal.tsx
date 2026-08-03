"use client";

import { useEffect, useState } from "react";

import { siteConfig } from "@/lib/siteConfig";

/**
 * Modal de captura de lead exibido 1,5s após a entrada.
 *
 * Está DESLIGADO — siteConfig.flags.welcomeModal está false.
 * Para ligar: mudar a flag para true e conectar o handleSubmit abaixo à
 * automação que vai disparar a mensagem no WhatsApp. Enquanto o destino do
 * lead não estiver definido, o formulário não deve ir ao ar: capturar um
 * telefone que não chega a lugar nenhum é pior do que não capturar.
 */
export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!siteConfig.flags.welcomeModal) return;

    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!siteConfig.flags.welcomeModal) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: enviar { name, phone } para a automação combinada com o cliente
    // (webhook do n8n/Make, ou API própria) antes de fechar.
    setOpen(false);
  };

  return (
    <div className={`welcome-overlay${open ? " open" : ""}`}>
      <div className="welcome-card">
        <button className="welcome-close" onClick={() => setOpen(false)} aria-label="Fechar">
          ✕
        </button>
        <div className="welcome-eyebrow">Antes de agendar</div>
        <h3 className="welcome-title">
          O que considerar antes de qualquer procedimento facial
        </h3>
        <p className="welcome-sub">
          Preencha seus dados e receba um material rápido sobre como funciona uma avaliação de
          verdade — direto no seu WhatsApp.
        </p>
        <form className="welcome-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefone / WhatsApp"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
          <button type="submit" className="btn welcome-submit">
            Quero receber
          </button>
        </form>
        <button className="welcome-skip" onClick={() => setOpen(false)}>
          Agora não
        </button>
      </div>
    </div>
  );
}
