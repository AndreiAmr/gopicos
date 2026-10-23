export const ACTIVITY_STRINGS = {
  mySpots: 'Meus picos',
  myReviews: 'Minhas avaliações',
  loadError: 'Não foi possível carregar a lista.',
  retry: 'Tentar novamente',
  spotsEmptyTitle: 'Você ainda não cadastrou nenhum pico.',
  spotsEmptyText: 'Conhece um lugar bom para andar? Cadastre e ajude a galera.',
  spotsEmptyAction: 'Cadastrar pico',
  reviewsEmptyTitle: 'Você ainda não avaliou nenhum pico.',
  reviewsEmptyText:
    'Suas notas ajudam outros skatistas a achar os melhores picos.',
  reviewsEmptyAction: 'Explorar o mapa',
} as const;

export type MyReview = {
  id: string;
  rating: number;
  description: string | null;
  createdAt: string;
  spot: { id: string; name: string; modality: string };
};

/** "1 pico" / "{n} picos". */
export const spotsCountLabel = (n: number): string =>
  n === 1 ? '1 pico' : `${n} picos`;

/** "1 avaliação" / "{n} avaliações". */
export const reviewsCountLabel = (n: number): string =>
  n === 1 ? '1 avaliação' : `${n} avaliações`;

/** "12/10/2026" (UTC, igual ao mobile). */
export const fullDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
};

/** Rótulo composto do item (spec 8.4). */
export const reviewA11yLabel = (
  review: Pick<MyReview, 'rating' | 'description' | 'createdAt'> & {
    spot: { name: string };
  },
): string => {
  const base = `${review.spot.name}, sua nota ${review.rating} de 5, ${fullDate(review.createdAt)}.`;
  const comment = review.description ? ` ${review.description}.` : '';
  return `${base}${comment} Abrir pico.`;
};
