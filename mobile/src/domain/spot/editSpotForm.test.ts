import type { SpotDetails } from './details';
import {
  Polygon,
  isUnchanged,
  newPhotos,
  spotPhotos,
  spotToFormData,
  toUpdateSpotInput,
} from './editSpotForm';

const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-46.65, -23.55],
      [-46.64, -23.55],
      [-46.64, -23.56],
      [-46.65, -23.55],
    ],
  ],
};

const spot: SpotDetails = {
  id: 's1',
  name: 'Pico da Praça',
  description: 'Escadas.',
  modality: 'street',
  isPaid: true,
  entryAmount: 'R$ 20',
  alwaysOpen: false,
  openingHours: '8h às 22h',
  hasCoverage: true,
  equipmentRequired: false,
  images: ['https://img/a.jpg', 'https://img/b.jpg'],
  coordinates: polygon,
  ratingAverage: null,
  reviewsCount: 0,
  isOwner: true,
  author: { id: 'u1', displayName: 'Marina S.' },
};

describe('edição de pico', () => {
  it('preenche o formulário e as fotos a partir do pico', () => {
    expect(spotToFormData(spot)).toMatchObject({
      name: 'Pico da Praça',
      entryAmount: 'R$ 20',
      openingHours: '8h às 22h',
    });
    expect(spotPhotos(spot).map(p => p.uri)).toEqual(spot.images);
    expect(spotPhotos(spot).every(p => p.remote)).toBe(true);
  });

  it('valores nulos viram texto vazio', () => {
    const data = spotToFormData({
      ...spot,
      isPaid: false,
      entryAmount: null,
      alwaysOpen: true,
      openingHours: null,
    });
    expect(data.entryAmount).toBe('');
    expect(data.openingHours).toBe('');
  });

  it('input traz as fotos mantidas e deixa as novas para o multipart', () => {
    const added = { uri: 'file:///c.jpg', name: 'c.jpg', type: 'image/jpeg' };
    const photos = [spotPhotos(spot)[1], added];

    expect(newPhotos(photos)).toEqual([added]);
    expect(
      toUpdateSpotInput(spotToFormData(spot), polygon, photos),
    ).toMatchObject({
      keepImages: ['https://img/b.jpg'],
      name: 'Pico da Praça',
      coordinates: polygon,
    });
  });

  describe('isUnchanged', () => {
    const data = spotToFormData(spot);
    const photos = spotPhotos(spot);

    it('sem mudança', () => {
      expect(isUnchanged(spot, data, polygon, photos)).toBe(true);
      expect(isUnchanged(spot, { ...data, name: ' Pico da Praça ' }, polygon, photos)).toBe(true);
    });

    it('detecta campo, foto removida, foto nova e local', () => {
      expect(isUnchanged(spot, { ...data, name: 'Outro' }, polygon, photos)).toBe(false);
      expect(isUnchanged(spot, data, polygon, [photos[0]])).toBe(false);
      expect(
        isUnchanged(spot, data, polygon, [
          ...photos,
          { uri: 'file:///c.jpg', name: 'c.jpg', type: 'image/jpeg' },
        ]),
      ).toBe(false);
      expect(
        isUnchanged(
          spot,
          data,
          { ...polygon, coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] },
          photos,
        ),
      ).toBe(false);
    });
  });
});
