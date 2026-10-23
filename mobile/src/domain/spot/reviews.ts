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
  seeLess: 'Ver menos',
  edit: 'Editar',
  remove: 'Excluir',
  editA11y: 'Editar sua avaliação',
  removeA11y: 'Excluir sua avaliação',
  deleteTitle: 'Excluir sua avaliação?',
  deleteDescription:
    'Sua nota e seu comentário serão removidos. Você poderá avaliar de novo depois.',
  deleteConfirm: 'Excluir avaliação',
  deleted: 'Avaliação excluída.',
  deleteError: 'Não foi possível excluir. Tente novamente.',
  gone: 'Esta avaliação já não existe.',
  forbidden: 'Só quem escreveu a avaliação pode alterá-la.',
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

/** Rolagem chegou perto do fim? (dispara a próxima página). */
export const isNearEnd = (
  layoutHeight: number,
  contentHeight: number,
  offsetY: number,
  threshold = 240,
): boolean => offsetY + layoutHeight >= contentHeight - threshold;
