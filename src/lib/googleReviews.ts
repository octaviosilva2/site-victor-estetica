// ============================================
// AVALIAÇÕES DO GOOGLE — integração real
//
// Puxar avaliações reais não é texto, é integração: exige a Places API (New)
// com uma API key e o Place ID do perfil do Google Meu Negócio.
//
// Como ligar:
//   1. No Google Cloud Console, habilite a "Places API (New)" e crie uma API key.
//   2. Restrinja a key por referenciador HTTP (o domínio do site) — ela fica
//      visível no navegador, então a restrição é o que impede uso indevido.
//   3. Pegue o Place ID do perfil: https://developers.google.com/maps/documentation/places/web-service/place-id
//   4. Crie um arquivo .env (ver .env.example) com:
//        VITE_GOOGLE_PLACES_API_KEY=...
//        VITE_GOOGLE_PLACE_ID=...
//
// Enquanto isso não estiver configurado, a seção não aparece no site
// publicado — melhor não mostrar nada do que mostrar avaliação de exemplo
// como se fosse de paciente real.
//
// Observação: a API devolve até 5 avaliações, escolhidas pelo Google. Os
// termos da Places API não permitem editar nem filtrar avaliações por nota,
// e exigem exibir o nome do autor e a data — é o que este módulo faz.
// ============================================

export interface GoogleReview {
  id: string;
  author: string;
  authorPhoto?: string;
  authorUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GooglePlaceReviews {
  rating?: number;
  totalRatings?: number;
  mapsUri?: string;
  reviews: GoogleReview[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

/** True quando a API key e o Place ID estão configurados. */
export const isGoogleReviewsConfigured = Boolean(API_KEY && PLACE_ID);

interface PlacesApiReview {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
}

/**
 * Busca as avaliações do perfil no Google. Devolve null quando a integração
 * não está configurada.
 */
export async function fetchGoogleReviews(signal?: AbortSignal): Promise<GooglePlaceReviews | null> {
  if (!isGoogleReviewsConfigured) return null;

  const url = new URL(`https://places.googleapis.com/v1/places/${PLACE_ID}`);
  url.searchParams.set("languageCode", "pt-BR");
  url.searchParams.set("fields", "rating,userRatingCount,googleMapsUri,reviews");
  url.searchParams.set("key", API_KEY as string);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Places API respondeu ${response.status}`);
  }

  const data = (await response.json()) as PlacesApiResponse;

  return {
    rating: data.rating,
    totalRatings: data.userRatingCount,
    mapsUri: data.googleMapsUri,
    reviews: (data.reviews ?? [])
      .map((review, index) => ({
        id: review.name ?? `review-${index}`,
        author: review.authorAttribution?.displayName ?? "Paciente",
        authorPhoto: review.authorAttribution?.photoUri,
        authorUrl: review.authorAttribution?.uri,
        rating: review.rating ?? 0,
        text: review.text?.text ?? review.originalText?.text ?? "",
        relativeTime: review.relativePublishTimeDescription ?? "",
      }))
      .filter((review) => review.text.length > 0),
  };
}
