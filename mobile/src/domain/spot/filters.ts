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
  clear: 'Limpar',
  clearAll: 'Limpar filtros',
  apply: 'Aplicar filtros',
  modality: 'Modalidade',
  entry: 'Entrada',
  covered: 'Somente cobertos',
  coverage: 'Cobertura',
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

/** Rótulo de acessibilidade do botão: "Filtros" ou "Filtros, 2 aplicados". */
export const filterButtonLabel = (filters: SpotFilters): string => {
  const count = activeFilterCount(filters);
  return count > 0
    ? `${filterStrings.button}, ${count} ${count === 1 ? 'aplicado' : 'aplicados'}`
    : filterStrings.button;
};

/** Campos do pico usados pelos filtros no cliente (prévia ao vivo, UX-H19). */
export type FilterableSpot = Pick<
  SpotSummary,
  'modality' | 'ratingAverage' | 'isPaid' | 'hasCoverage'
>;

/**
 * Mesmo critério do backend (`getAllSpots(filter)`): entrada e cobertura
 * comparam o valor exato e a nota mínima exclui picos sem avaliação.
 */
export const matchesFilters = (
  spot: FilterableSpot,
  filters: SpotFilters,
): boolean => {
  if (filters.modalities.length > 0 && !filters.modalities.includes(spot.modality)) {
    return false;
  }
  if (filters.entry === 'free' && spot.isPaid !== false) return false;
  if (filters.entry === 'paid' && spot.isPaid !== true) return false;
  if (filters.coveredOnly && spot.hasCoverage !== true) return false;
  if (
    filters.minRating > 0 &&
    !(spot.ratingAverage != null && spot.ratingAverage >= filters.minRating)
  ) {
    return false;
  }
  return true;
};

export const applyFilters = <T extends FilterableSpot>(
  spots: T[],
  filters: SpotFilters,
): T[] => spots.filter(spot => matchesFilters(spot, filters));

const plural = (count: number, one: string, many: string) =>
  count === 1 ? one : many;

/** "1 filtro" / "2 filtros". */
export const filtersCountText = (count: number): string =>
  `${count} ${plural(count, 'filtro', 'filtros')}`;

/** "Ver 12 picos" (botão do sheet com prévia) ou "Aplicar filtros". */
export const applyButtonLabel = (previewCount: number | null): string =>
  previewCount === null
    ? filterStrings.apply
    : `Ver ${previewCount} ${plural(previewCount, 'pico', 'picos')}`;

export type ScoreTapeState =
  | { kind: 'loading'; text: string }
  | { kind: 'updating'; text: string }
  | { kind: 'count'; text: string; filtersText?: string };

export const scoreTapeStrings = {
  loading: 'Carregando picos...',
  updating: 'Atualizando...',
  none: 'Nenhum pico na área',
} as const;

/**
 * Texto da fita de placar (spec home.md 6.1): "32 picos na área · 2 filtros",
 * "Nenhum pico na área", "0 picos com 2 filtros", "999+ picos na área".
 * `count` null = área do mapa ainda desconhecida.
 */
export const scoreTape = ({
  loading,
  updating,
  count,
  filterCount,
}: {
  loading: boolean;
  updating: boolean;
  count: number | null;
  filterCount: number;
}): ScoreTapeState => {
  if (loading || count === null) {
    return { kind: 'loading', text: scoreTapeStrings.loading };
  }
  if (updating) {
    return { kind: 'updating', text: scoreTapeStrings.updating };
  }
  if (count === 0) {
    return filterCount > 0
      ? { kind: 'count', text: `0 picos com ${filtersCountText(filterCount)}` }
      : { kind: 'count', text: scoreTapeStrings.none };
  }
  const shown = count > 999 ? '999+' : String(count);
  return {
    kind: 'count',
    text: `${shown} ${plural(count, 'pico', 'picos')} na área`,
    filtersText: filterCount > 0 ? filtersCountText(filterCount) : undefined,
  };
};

/** Texto único da fita (leitor de tela e testes). */
export const scoreTapeText = (state: ScoreTapeState): string =>
  state.kind === 'count' && state.filtersText
    ? `${state.text} · ${state.filtersText}`
    : state.text;

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
