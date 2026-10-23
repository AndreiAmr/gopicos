import {
  NO_FILTERS,
  applyButtonLabel,
  applyFilters,
  matchesFilters,
  scoreTape,
  scoreTapeText,
} from './filters';

/** Prévia ao vivo e fita de placar (spec home.md 6.1 e 6.9). */
describe('prévia dos filtros e fita de placar', () => {
  const spot = (over: Partial<Parameters<typeof matchesFilters>[0]> = {}) => ({
    modality: 'street',
    ratingAverage: null,
    isPaid: false,
    hasCoverage: false,
    ...over,
  });

  it('filtra no cliente com o mesmo critério do backend', () => {
    expect(matchesFilters(spot(), NO_FILTERS)).toBe(true);
    expect(matchesFilters(spot({ isPaid: true }), { ...NO_FILTERS, entry: 'free' })).toBe(false);
    expect(matchesFilters(spot({ isPaid: null }), { ...NO_FILTERS, entry: 'free' })).toBe(false);
    expect(matchesFilters(spot({ isPaid: true }), { ...NO_FILTERS, entry: 'paid' })).toBe(true);
    expect(matchesFilters(spot(), { ...NO_FILTERS, coveredOnly: true })).toBe(false);
    // Nota mínima exclui pico sem avaliação.
    expect(matchesFilters(spot(), { ...NO_FILTERS, minRating: 3 })).toBe(false);
    expect(matchesFilters(spot({ ratingAverage: 4.2 }), { ...NO_FILTERS, minRating: 4 })).toBe(true);
    expect(
      applyFilters([spot(), spot({ modality: 'park' })], { ...NO_FILTERS, modalities: ['park'] }),
    ).toHaveLength(1);
  });

  it('textos da fita em todos os estados', () => {
    const tape = (count: number | null, filterCount = 0, extra = {}) =>
      scoreTapeText(
        scoreTape({ loading: false, updating: false, count, filterCount, ...extra }),
      );
    expect(tape(null)).toBe('Carregando picos...');
    expect(tape(5, 0, { loading: true })).toBe('Carregando picos...');
    expect(tape(5, 1, { updating: true })).toBe('Atualizando...');
    expect(tape(32)).toBe('32 picos na área');
    expect(tape(1)).toBe('1 pico na área');
    expect(tape(32, 2)).toBe('32 picos na área · 2 filtros');
    expect(tape(32, 1)).toBe('32 picos na área · 1 filtro');
    expect(tape(1500)).toBe('999+ picos na área');
    expect(tape(0)).toBe('Nenhum pico na área');
    expect(tape(0, 2)).toBe('0 picos com 2 filtros');
  });

  it('botão do sheet: "Ver N picos" com prévia, "Aplicar filtros" sem', () => {
    expect(applyButtonLabel(null)).toBe('Aplicar filtros');
    expect(applyButtonLabel(12)).toBe('Ver 12 picos');
    expect(applyButtonLabel(1)).toBe('Ver 1 pico');
  });
});
