/** Avaliação como `getSpotReviews` devolve. */
export type Review = {
  id: string;
  rating: number;
  description: string | null;
  createdAt: string;
  author: { id: string; displayName: string | null } | null;
  isMine: boolean;
};

export type ReviewsPage = {
  items: Review[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  ratingAverage: number | null;
  myReview: Review | null;
};

export const COMMENT_MAX = 500;
export const PAGE_SIZE = 10;

export const reviewStrings = {
  section: 'Avaliações',
  rate: 'Avaliar este pico',
  seeMine: 'Ver minha avaliação',
  formTitle: 'Avaliar este pico',
  editTitle: 'Editar sua avaliação',
  starsHint: 'Escolha de 1 a 5 estrelas',
  comment: 'Comentário (opcional)',
  submit: 'Enviar avaliação',
  save: 'Salvar',
  cancel: 'Cancelar',
  sent: 'Avaliação enviada!',
  updated: 'Avaliação atualizada.',
  networkError: 'Não foi possível enviar sua avaliação. Tente novamente.',
  alreadyReviewed: 'Você já avaliou este pico. Edite sua avaliação.',
  ownSpot: 'Você criou este pico, por isso não pode avaliá-lo.',
  ownSpotNoReviews: 'Ainda sem avaliações.',
  mine: 'Sua avaliação',
  emptyTitle: 'Seja o primeiro a avaliar',
  emptyText: 'Conte como é andar neste pico.',
  loadError: 'Não foi possível carregar as avaliações.',
  retry: 'Tentar novamente',
  loadingMore: 'Carregando mais...',
  loadMoreError: 'Não foi possível carregar mais.',
  discardTitle: 'Descartar sua avaliação?',
  discard: 'Descartar',
  keepEditing: 'Continuar editando',
  deactivated: 'Usuário Desativado',
  seeMore: 'Ver mais',
  loadMore: 'Carregar mais',
  seeLess: 'Ver menos',
} as const;

const RATING_LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

/** Rótulo textual da nota ("Bom"); vazio sem nota. */
export const ratingLabel = (rating: number): string =>
  RATING_LABELS[Math.round(rating)] ?? '';

/** "0/500". */
export const commentCounter = (comment: string): string =>
  `${comment.length}/${COMMENT_MAX}`;

export const isCommentTooLong = (comment: string): boolean =>
  comment.length > COMMENT_MAX;

/** Enviar exige 1 a 5 estrelas e comentário dentro do limite. */
export const canSubmitReview = (rating: number, comment: string): boolean =>
  Number.isInteger(rating) &&
  rating >= 1 &&
  rating <= 5 &&
  !isCommentTooLong(comment);

/** Há algo digitado que se perderia ao fechar? */
export const hasDraft = (
  rating: number,
  comment: string,
  initial?: { rating: number; description: string | null } | null,
): boolean =>
  initial
    ? rating !== initial.rating || comment !== (initial.description ?? '')
    : rating > 0 || comment.trim().length > 0;

/** Nome público do autor ("Nome S." ou "Usuário Desativado"). */
export const authorName = (review: Pick<Review, 'author'>): string =>
  review.author?.displayName?.trim() || reviewStrings.deactivated;

/** Inicial do avatar; "?" neutro para conta desativada. */
export const authorInitial = (review: Pick<Review, 'author'>): string => {
  const name = review.author?.displayName?.trim();
  return name ? name.charAt(0).toUpperCase() : '?';
};

/** Rótulo de acessibilidade do item. */
export const reviewA11yLabel = (
  review: Review,
  relative: string,
): string => {
  const comment = review.description ? ` ${review.description}` : '';
  return `${authorName(review)}, nota ${review.rating} de 5, ${relative}.${comment}`;
};

/** Junta a próxima página sem repetir ids. */
export const appendPage = (current: Review[], next: Review[]): Review[] => {
  const seen = new Set(current.map(item => item.id));
  return [...current, ...next.filter(item => !seen.has(item.id))];
};


const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** "agora há pouco", "há 3 dias", "há 2 semanas"... */
export const relativeDate = (iso: string, now: number = Date.now()): string => {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return '';
  const diff = Math.max(0, now - time);
  if (diff < HOUR) return 'agora há pouco';
  if (diff < DAY) return `há ${plural(Math.floor(diff / HOUR), 'hora', 'horas')}`;
  if (diff < 7 * DAY) return `há ${plural(Math.floor(diff / DAY), 'dia', 'dias')}`;
  if (diff < 30 * DAY) {
    return `há ${plural(Math.floor(diff / (7 * DAY)), 'semana', 'semanas')}`;
  }
  if (diff < 365 * DAY) {
    return `há ${plural(Math.floor(diff / (30 * DAY)), 'mês', 'meses')}`;
  }
  return `há ${plural(Math.floor(diff / (365 * DAY)), 'ano', 'anos')}`;
};

/** "12/10/2026" (UTC), para o `title` e leitores de tela. */
export const fullDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
};

/** Anúncio ao carregar mais: "10 avaliações carregadas" / "1 avaliação carregada". */
export const loadedAnnouncement = (count: number): string =>
  count === 1 ? '1 avaliação carregada' : `${count} avaliações carregadas`;
