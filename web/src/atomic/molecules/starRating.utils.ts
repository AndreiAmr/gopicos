export const MAX_STARS = 5;

/** Formata a nota no padrao pt-BR com 1 casa decimal ("4,3"). */
export const formatAverage = (average: number) =>
  average.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

/** Rotulo acessivel de uma estrela: "1 de 5 estrelas", "3 de 5 estrelas". */
export const starLabel = (position: number) =>
  `${position} de ${MAX_STARS} estrelas`;

/** Texto visivel ao lado das estrelas: "4,3 (12)". */
export const summaryText = (average: number, count?: number) =>
  count === undefined
    ? formatAverage(average)
    : `${formatAverage(average)} (${count})`;

/** Mantem o valor dentro de 0..5. */
export const clampRating = (value: number) =>
  Math.min(MAX_STARS, Math.max(0, value));

/** Proxima nota ao usar o teclado em um radiogroup de estrelas. */
export const nextRating = (current: number, key: string): number | null => {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(MAX_STARS, current + 1);
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(1, current - 1);
    case 'Home':
      return 1;
    case 'End':
      return MAX_STARS;
    default:
      return null;
  }
};
