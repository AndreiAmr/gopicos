export const activityStrings = {
  activity: 'Atividade',
  mySpots: 'Meus picos',
  myReviews: 'Minhas avaliações',
  spotsTile: 'Picos',
  reviewsTile: 'Avaliações',
  loadError: 'Não foi possível carregar a lista.',
  retry: 'Tentar novamente',
  spotsEmptyTitle: 'Você ainda não cadastrou nenhum pico.',
  spotsEmptyText: 'Conhece um lugar bom para andar? Cadastre e ajude a galera.',
  spotsEmptyAction: 'Cadastrar pico',
  reviewsEmptyTitle: 'Você ainda não avaliou nenhum pico.',
  reviewsEmptyText: 'Suas notas ajudam outros skatistas a achar os melhores picos.',
  reviewsEmptyAction: 'Explorar o mapa',
} as const;

/** "1 pico" / "{n} picos". */
export const spotsCountLabel = (n: number): string =>
  n === 1 ? '1 pico' : `${n} picos`;

/** "1 avaliação" / "{n} avaliações". */
export const reviewsCountLabel = (n: number): string =>
  n === 1 ? '1 avaliação' : `${n} avaliações`;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** "agora há pouco", "há 3 dias", "há 2 semanas"... (mobile, spec 8.3). */
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

/** "12/10/2026" (para leitor de tela). */
export const fullDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
};

/** Rótulo composto do item (spec 8.4). */
export const reviewA11yLabel = (review: {
  rating: number;
  description: string | null;
  createdAt: string;
  spot: { name: string };
}): string => {
  const base = `${review.spot.name}, sua nota ${review.rating} de 5, ${fullDate(review.createdAt)}.`;
  const comment = review.description ? ` ${review.description}.` : '';
  return `${base}${comment} Abrir pico.`;
};
