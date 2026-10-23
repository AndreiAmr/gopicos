import { describe, expect, it } from 'vitest';
import {
  createdByText,
  detailChips,
  entryText,
  galleryCounter,
  infoRows,
  reviewsCountText,
  spotPageTitle,
  stepIndex,
  validImages,
  type SpotDetails,
} from './details';

const spot: SpotDetails = {
  id: '1',
  name: 'Praça',
  description: 'Boa',
  modality: 'street',
  isPaid: false,
  entryAmount: null,
  alwaysOpen: true,
  openingHours: null,
  hasCoverage: false,
  equipmentRequired: false,
  images: ['a.jpg', null],
  coordinates: null,
  ratingAverage: null,
  reviewsCount: 0,
  isOwner: false,
  author: { id: 'u', displayName: 'Marina S.' },
};

describe('domain/spot/details', () => {
  it('monta as linhas de informação', () => {
    expect(infoRows(spot)).toEqual([
      { label: 'Entrada', value: 'Gratuita' },
      { label: 'Horário', value: 'Aberto 24 horas' },
      { label: 'Cobertura', value: 'Descoberto' },
      { label: 'Equipamento', value: 'Não exige' },
    ]);
    const paid = {
      ...spot,
      isPaid: true,
      entryAmount: 'R$ 20',
      alwaysOpen: false,
      openingHours: 'Seg a sex',
      hasCoverage: true,
      equipmentRequired: true,
    };
    expect(infoRows(paid).map((row) => row.value)).toEqual([
      'R$ 20',
      'Seg a sex',
      'Coberto',
      'Exige proteção',
    ]);
    expect(entryText({ isPaid: true, entryAmount: ' ' })).toBe('Paga');
    expect(detailChips(paid)).toEqual(['R$ 20', 'Coberto']);
    expect(detailChips(spot)).toEqual(['Gratuito']);
  });

  it('formata contagem, autor e título', () => {
    expect(reviewsCountText(0)).toBe('Sem avaliações ainda');
    expect(reviewsCountText(1)).toBe('1 avaliação');
    expect(reviewsCountText(23)).toBe('23 avaliações');
    expect(createdByText(spot)).toBe('Criado por Marina S.');
    expect(createdByText({ author: null })).toBe('Criado por Usuário Desativado');
    expect(spotPageTitle('Praça')).toBe('Praça - GoPicos');
  });

  it('navega pela galeria de forma circular', () => {
    expect(galleryCounter(1, 4)).toBe('2 / 4');
    expect(stepIndex(3, 4, 1)).toBe(0);
    expect(stepIndex(0, 4, -1)).toBe(3);
    expect(stepIndex(0, 0, 1)).toBe(0);
    expect(validImages(spot.images)).toEqual(['a.jpg']);
    expect(validImages(null)).toEqual([]);
  });
});
