import {
  SpotDetails,
  createdByText,
  detailChips,
  entryText,
  galleryCounter,
  infoRows,
  reviewsCountText,
} from './details';

const base: SpotDetails = {
  id: 's1',
  name: 'Pico',
  modality: 'street',
  coordinates: null,
  ratingAverage: null,
  reviewsCount: 0,
  description: 'd',
  isPaid: false,
  entryAmount: null,
  alwaysOpen: true,
  openingHours: null,
  hasCoverage: false,
  equipmentRequired: false,
  images: [],
  author: { id: 'u1', displayName: 'Marina S.' },
  isOwner: false,
};

describe('detalhe do pico (domínio)', () => {
  it('monta as InfoRows com a microcopy da spec', () => {
    expect(infoRows(base)).toEqual([
      { label: 'Entrada', value: 'Gratuita' },
      { label: 'Horário', value: 'Aberto 24 horas' },
      { label: 'Cobertura', value: 'Descoberto' },
      { label: 'Equipamento', value: 'Não exige' },
    ]);

    expect(
      infoRows({
        ...base,
        isPaid: true,
        entryAmount: 'R$ 20',
        alwaysOpen: false,
        openingHours: '8h às 22h',
        hasCoverage: true,
        equipmentRequired: true,
      }).map(row => row.value),
    ).toEqual(['R$ 20', '8h às 22h', 'Coberto', 'Exige proteção']);
  });

  it('entrada paga sem valor vira "Paga"', () => {
    expect(entryText({ isPaid: true, entryAmount: ' ' })).toBe('Paga');
  });

  it('chips de entrada e cobertura', () => {
    expect(detailChips(base)).toEqual(['Gratuito']);
    expect(
      detailChips({ ...base, isPaid: true, entryAmount: 'R$ 5', hasCoverage: true }),
    ).toEqual(['R$ 5', 'Coberto']);
  });

  it('contagem de avaliações', () => {
    expect(reviewsCountText(0)).toBe('Sem avaliações ainda');
    expect(reviewsCountText(1)).toBe('1 avaliação');
    expect(reviewsCountText(23)).toBe('23 avaliações');
  });

  it('autor e contador da galeria', () => {
    expect(createdByText(base)).toBe('Criado por Marina S.');
    expect(createdByText({ author: null })).toBe('Criado por Usuário Desativado');
    expect(galleryCounter(0, 4)).toBe('1 / 4');
  });
});
