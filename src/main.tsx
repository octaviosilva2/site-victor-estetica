import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Em produção o HTML já vem pré-renderizado (scripts/prerender.mjs): aí o
// React hidrata o que está na tela em vez de jogar fora e renderizar de novo.
// Em desenvolvimento o container está vazio e o caminho normal é usado.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
