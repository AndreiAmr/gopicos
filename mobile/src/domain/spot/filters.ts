import { MODALITY_LABELS, SpotSummary } from './spot';

export type EntryFilter = 'all' | 'free' | 'paid';
export type MinRating = 0 | 3 | 4 | 5;

/** Filtros da Home (spec picos.md 10 e picos-fechamento.md 8). */
export type SpotFilters = {
  /** Multisseleção (OU entre modalidades). Vazio = todas. */
  modalities: string[];
  entry: EntryFilter;
  coveredOnly: boolean;
  /** 0 = qualquer nota. */
  minRating: MinRating;
};

export const NO_FILTERS: SpotFilters = {
  modalities: [],
  entry: 'all',
  coveredOnly: false,
  minRating: 0,
};

export const MODALITY_OPTIONS = Object.entries(MODALITY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const ENTRY_OPTIONS: Array<{ value: EntryFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'free', label: 'Gratuito' },
  { value: 'paid', label: 'Pago' },
];

export const RATING_OPTIONS: Array<{ value: MinRating; label: string }> = [
  { value: 0, label: 'Qualquer' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5' },
];

export const filterStrings = {
  button: 'Filtros',
  title: 'Filtros',
  clear: 'Limpar filtros',
  apply: 'Aplicar filtros',
  modality: 'Modalidade',
  entry: 'Entrada',
  covered: 'Somente cobertos',
  minRating: 'Nota mínima',
  applyError: 'Não foi possível aplicar os filtros.',
  retry: 'Tentar novamente',
  emptyTitle: 'Nenhum pico com esses filtros.',
  emptyDescription: 'Tente mudar ou limpar os filtros.',
  emptyAction: 'Limpar filtros',
} as const;

/** Cada seção ativa conta 1 (as modalidades contam 1 no total). */
export const activeFilterCount = (filters: SpotFilters): number =>
  (filters.modalities.length > 0 ? 1 : 0) +
  (filters.entry !== 'all' ? 1 : 0) +
  (filters.coveredOnly ? 1 : 0) +
  (filters.minRating > 0 ? 1 : 0);

export const hasActiveFilters = (filters: SpotFilters): boolean =>
  activeFilterCount(filters) > 0;

/** "Filtros" ou "Filtros (2)". */
export const filterButtonLabel = (filters: SpotFilters): string => {
  const count = activeFilterCount(filters);
  return count > 0 ? `${filterStrings.button} (${count})` : filterStrings.button;
};

/** Variáveis do backend. A modalidade é tratada no cliente (o backend aceita uma só). */
export type SpotsQueryFilter = {
  isPaid?: boolean;
  hasCoverage?: boolean;
  minRating?: number;
};

export const toQueryFilter = (filters: SpotFilters): SpotsQueryFilter | null => {
  const query: SpotsQueryFilter = {};
  if (filters.entry === 'free') query.isPaid = false;
  if (filters.entry === 'paid') query.isPaid = true;
  if (filters.coveredOnly) query.hasCoverage = true;
  if (filters.minRating > 0) query.minRating = filters.minRating;
  return Object.keys(query).length > 0 ? query : null;
};

/** OU entre as modalidades marcadas; sem marcação, todas. */
export const filterByModalities = <T extends Pick<SpotSummary, 'modality'>>(
  spots: T[],
  modalities: string[],
): T[] =>
  modalities.length === 0
    ? spots
    : spots.filter(spot => modalities.includes(spot.modality));

export type FilterChip = { key: string; label: string };

/** Chips dos filtros ativos (um por modalidade, entrada, cobertura e nota). */
export const activeChips = (filters: SpotFilters): FilterChip[] => [
  ...filters.modalities.map(value => ({
    key: `modality:${value}`,
    label: MODALITY_LABELS[value] ?? value,
  })),
  ...(filters.entry !== 'all'
    ? [
        {
          key: 'entry',
          label: filters.entry === 'free' ? 'Gratuito' : 'Pago',
        },
      ]
    : []),
  ...(filters.coveredOnly ? [{ key: 'covered', label: 'Coberto' }] : []),
  ...(filters.minRating > 0
    ? [{ key: 'rating', label: `Nota ${filters.minRating}+` }]
    : []),
];

/** Remove o filtro de um chip. */
export const removeChip = (filters: SpotFilters, key: string): SpotFilters => {
  if (key.startsWith('modality:')) {
    const value = key.slice('modality:'.length);
    return {
      ...filters,
      modalities: filters.modalities.filter(item => item !== value),
    };
  }
  if (key === 'entry') return { ...filters, entry: 'all' };
  if (key === 'covered') return { ...filters, coveredOnly: false };
  if (key === 'rating') return { ...filters, minRating: 0 };
  return filters;
};

/** Marca ou desmarca uma modalidade. */
export const toggleModality = (
  filters: SpotFilters,
  value: string,
): SpotFilters => ({
  ...filters,
  modalities: filters.modalities.includes(value)
    ? filters.modalities.filter(item => item !== value)
    : [...filters.modalities, value],
});

export const sameFilters = (a: SpotFilters, b: SpotFilters): boolean =>
  a.entry === b.entry &&
  a.coveredOnly === b.coveredOnly &&
  a.minRating === b.minRating &&
  a.modalities.length === b.modalities.length &&
  a.modalities.every(item => b.modalities.includes(item));
