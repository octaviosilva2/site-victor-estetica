import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { fetchGoogleReviews, isGoogleReviewsConfigured, type GoogleReview } from "@/lib/googleReviews";
import { FadeIn, FadeInUp } from "@/hooks/useScrollAnimation";

const Stars = ({ rating }: { rating: number }) => (
  <div className="mb-2.5 flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        aria-hidden="true"
        className={
          star <= Math.round(rating) ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5 text-border"
        }
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: GoogleReview }) => (
  <li className="rounded-[2px] border border-border bg-white p-5">
    <Stars rating={review.rating} />
    <p className="mb-3.5 text-[13px] italic leading-[1.55] text-foreground-muted">"{review.text}"</p>
    <div className="flex items-center gap-2.5">
      {review.authorPhoto && (
        <img src={review.authorPhoto} alt="" aria-hidden="true" className="h-7 w-7 rounded-full" />
      )}
      <div>
        <p className="m-0 text-[12px] font-bold tracking-[0.02em]">{review.author}</p>
        {/* Atribuição exigida pelos termos da Places API. */}
        <p className="m-0 text-[10.5px] uppercase tracking-[0.04em] text-sage">
          Avaliação do Google{review.relativeTime && ` · ${review.relativeTime}`}
        </p>
      </div>
    </div>
  </li>
);

/**
 * Avaliações reais do perfil no Google.
 *
 * Sem a integração configurada a seção não é renderizada em produção — não
 * publicamos avaliação de exemplo como se fosse de paciente real. Em
 * desenvolvimento aparece um aviso explicando o que falta configurar.
 */
const ReviewsSection = () => {
  const { data } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: ({ signal }) => fetchGoogleReviews(signal),
    enabled: isGoogleReviewsConfigured,
    staleTime: 1000 * 60 * 60 * 12,
    retry: 1,
  });

  if (!isGoogleReviewsConfigured) {
    if (!import.meta.env.DEV) return null;
    return (
      <section className="grad-subtle-panel px-6 py-28 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl rounded-[2px] border border-dashed border-primary/40 p-6">
          <p className="eyebrow m-0">Avaliações do Google</p>
          <h2 className="mb-3 mt-3 text-[22px] font-normal">Integração ainda não configurada</h2>
          <p className="m-0 text-[14px] leading-[1.6] text-foreground-muted">
            Defina <code>VITE_GOOGLE_PLACES_API_KEY</code> e <code>VITE_GOOGLE_PLACE_ID</code> no arquivo{" "}
            <code>.env</code> para exibir as avaliações reais do perfil no Google. Enquanto isso, esta seção
            não aparece no site publicado. Este aviso só é visível em desenvolvimento.
          </p>
        </div>
      </section>
    );
  }

  // Falha na API ou perfil sem avaliações: a seção simplesmente não aparece.
  if (!data || data.reviews.length === 0) return null;

  return (
    <section id="avaliacoes" className="grad-subtle-panel px-6 py-28 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="eyebrow m-0">Avaliações</p>
          <h2 className="mb-4 mt-3 text-[27px] font-normal">O que dizem no Google</h2>
          <p className="mb-9 max-w-[32.5rem] text-[15px] leading-[1.6] text-foreground-muted">
            {data.rating && data.totalRatings
              ? `Nota ${data.rating.toFixed(1)} de 5, com base em ${data.totalRatings} avaliações do perfil no Google.`
              : "Avaliações reais, carregadas direto do perfil no Google."}
          </p>
        </FadeIn>

        <FadeInUp delay={120}>
          <ul className="m-0 grid list-none gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ul>

          {data.mapsUri && (
            <p className="mt-5 text-center text-[12px] italic text-foreground-muted">
              <a href={data.mapsUri} target="_blank" rel="noopener noreferrer" className="underline">
                Ver todas as avaliações no Google
              </a>
            </p>
          )}
        </FadeInUp>
      </div>
    </section>
  );
};

export default ReviewsSection;
