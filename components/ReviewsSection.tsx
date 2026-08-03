import { siteConfig } from "@/lib/siteConfig";

// Conteúdo de exemplo até a integração com o Google Places API (ou um plugin
// tipo Elfsight/Trustindex) puxar as avaliações reais do perfil.
const sampleReviews = [
  {
    text: "Exemplo de avaliação real puxada do Google — texto e nota vêm direto do seu perfil.",
    name: "Paciente Exemplo",
  },
  {
    text: "Exemplo de avaliação real puxada do Google — texto e nota vêm direto do seu perfil.",
    name: "Paciente Exemplo",
  },
  {
    text: "Exemplo de avaliação real puxada do Google — texto e nota vêm direto do seu perfil.",
    name: "Paciente Exemplo",
  },
];

export default function ReviewsSection() {
  return (
    <section
      id="avaliacoes"
      style={{ background: "var(--bg-alt)", paddingTop: 88, paddingBottom: 88 }}
    >
      <div className="container">
        <p className="eyebrow fade">Avaliações</p>
        <h2 className="section-title fade">O que dizem no Google</h2>
        <p className="section-sub fade">
          Avaliações carregadas automaticamente do perfil no Google (exemplo de layout — conteúdo
          real vem da integração).
        </p>

        <div className="review-grid">
          {sampleReviews.map((review, index) => (
            <div className="review-card fade" key={index}>
              <div className="review-stars" aria-label="5 de 5 estrelas">
                ★★★★★
              </div>
              <div className="review-text">&ldquo;{review.text}&rdquo;</div>
              <div className="review-name">{review.name}</div>
              <div className="review-badge">Avaliação do Google</div>
            </div>
          ))}
        </div>

        <p className="review-note fade">
          <a href={siteConfig.links.googleBusiness} target="_blank" rel="noopener noreferrer">
            Ver todas as avaliações no perfil do Google
          </a>
        </p>
      </div>
    </section>
  );
}
