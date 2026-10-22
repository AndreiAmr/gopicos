export const MAX_STARS = 5;

export type StarFill = 'full' | 'half' | 'empty';

/** Limita a nota ao intervalo [0, max]; valores inválidos viram 0. */
export const clampRating = (value: number, max = MAX_STARS): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(value, 0), max);
};

/** Arredonda para o meio ponto mais próximo (4,3 -> 4,5; 4,2 -> 4). */
export const roundToHalf = (value: number): number => Math.round(value * 2) / 2;

/**
 * Preenchimento de cada estrela para exibir uma nota (inclusive média
 * fracionada). Ex.: 3,6 -> ['full','full','full','half','empty'].
 */
export const getStarFills = (value: number, max = MAX_STARS): StarFill[] => {
  const rounded = roundToHalf(clampRating(value, max));

  return Array.from({ length: max }, (_, index) => {
    const position = index + 1;
    if (rounded >= position) {
      return 'full';
    }
    if (rounded >= position - 0.5) {
      return 'half';
    }
    return 'empty';
  });
};

/**
 * Média no formato pt-BR com 1 casa e contagem: "4,3 (12)". Sem avaliações
 * devolve `fallback` (ex.: "Sem avaliações").
 */
export const formatAverage = (
  average: number,
  count: number,
  fallback = '',
): string => {
  if (!count || count <= 0) {
    return fallback;
  }
  return `${clampRating(average).toFixed(1).replace('.', ',')} (${count})`;
};

/** Rótulo de acessibilidade de uma nota: "3 de 5 estrelas". */
export const starLabel = (value: number, max = MAX_STARS): string => {
  const text = Number.isInteger(value)
    ? String(value)
    : value.toFixed(1).replace('.', ',');
  return `${text} de ${max} estrelas`;
};

/** Valor da próxima nota ao ajustar por acessibilidade (increment/decrement). */
export const stepRating = (
  current: number,
  direction: 1 | -1,
  max = MAX_STARS,
): number => {
  const next = Math.round(current) + direction;
  return Math.min(Math.max(next, 1), max);
};
