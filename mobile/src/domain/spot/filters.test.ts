import {
  NO_FILTERS,
  SpotFilters,
  activeChips,
  activeFilterCount,
  filterButtonLabel,
  filterByModalities,
  removeChip,
  sameFilters,
  toQueryFilter,
  toggleModality,
} from './filters';

const all: SpotFilters = {
  modalities: ['street', 'park'],
  entry: 'free',
  coveredOnly: true,
  minRating: 4,
};

describe('domain/spot/filters', () => {
  it('conta cada seção ativa como 1 (modalidades contam 1 no total)', () => {
    expect(activeFilterCount(NO_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...NO_FILTERS, modalities: ['street', 'park'] })).toBe(1);
    expect(activeFilterCount(all)).toBe(4);
    expect(filterButtonLabel(NO_FILTERS)).toBe('Filtros');
    expect(filterButtonLabel(all)).toBe('Filtros, 4 aplicados');
    expect(filterButtonLabel({ ...NO_FILTERS, coveredOnly: true })).toBe('Filtros, 1 aplicado');
  });

  it('converte para as variáveis do backend (E entre seções)', () => {
    expect(toQueryFilter(NO_FILTERS)).toBeNull();
    expect(toQueryFilter(all)).toEqual({
      isPaid: false,
      hasCoverage: true,
      minRating: 4,
    });
    expect(toQueryFilter({ ...NO_FILTERS, entry: 'paid' })).toEqual({ isPaid: true });
    // A modalidade não vai ao backend (OU é no cliente).
    expect(toQueryFilter({ ...NO_FILTERS, modalities: ['street'] })).toBeNull();
  });

  it('filtra modalidades com OU, e sem marcação mostra todas', () => {
    const spots = [
      { modality: 'street' },
      { modality: 'park' },
      { modality: 'bowl_pool' },
    ];
    expect(filterByModalities(spots, [])).toHaveLength(3);
    expect(filterByModalities(spots, ['street', 'park'])).toHaveLength(2);
  });

  it('gera chips e remove cada filtro', () => {
    expect(activeChips(all).map(chip => chip.label)).toEqual([
      'Street',
      'Park',
      'Gratuito',
      'Coberto',
      'Nota 4+',
    ]);
    let filters = all;
    for (const chip of activeChips(all)) {
      filters = removeChip(filters, chip.key);
    }
    expect(filters).toEqual(NO_FILTERS);
  });

  it('marca e desmarca modalidades e compara filtros', () => {
    const once = toggleModality(NO_FILTERS, 'street');
    expect(once.modalities).toEqual(['street']);
    expect(toggleModality(once, 'street').modalities).toEqual([]);
    expect(sameFilters(all, { ...all, modalities: ['park', 'street'] })).toBe(true);
    expect(sameFilters(all, NO_FILTERS)).toBe(false);
  });
});
