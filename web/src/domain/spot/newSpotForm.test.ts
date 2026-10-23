import { describe, expect, it } from 'vitest';

import {
  addPhotos,
  newSpotDefaults,
  newSpotSchema,
  photosError,
  pointsCounter,
  pointsToPolygon,
  toCreateSpotInput,
  type NewSpotFormData,
} from './newSpotForm';

const photo = (name: string, size = 1000, type = 'image/jpeg') =>
  new File([new Uint8Array(size)], name, { type });

const valid: NewSpotFormData = {
  ...newSpotDefaults,
  name: 'Pico',
  description: 'Bom',
  modality: 'street',
};

const errorsOf = async (data: NewSpotFormData) => {
  try {
    await newSpotSchema.validate(data, { abortEarly: false });
    return [];
  } catch (error) {
    return (error as { errors: string[] }).errors;
  }
};

describe('newSpotForm', () => {
  it('aceita um formulário válido', async () => {
    expect(await errorsOf(valid)).toEqual([]);
  });

  it('exige nome, descrição e modalidade', async () => {
    const errors = await errorsOf(newSpotDefaults);
    expect(errors).toEqual(
      expect.arrayContaining([
        'Informe o nome do pico.',
        'Descreva o pico.',
        'Escolha a modalidade.',
      ]),
    );
  });

  it('exige valor se pago e horário se não for 24 h', async () => {
    const errors = await errorsOf({
      ...valid,
      isPaid: true,
      alwaysOpen: false,
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        'Informe o valor da entrada.',
        'Informe o horário de funcionamento.',
      ]),
    );
  });

  it('limita nome a 80 caracteres', async () => {
    expect(await errorsOf({ ...valid, name: 'a'.repeat(81) })).toEqual([
      'O nome deve ter no máximo 80 caracteres.',
    ]);
  });

  it('recusa foto acima de 5 MB e não-imagem', () => {
    const big = photo('grande.jpg', 5 * 1024 * 1024 + 1);
    const pdf = photo('doc.pdf', 10, 'application/pdf');
    const result = addPhotos([], [big, pdf, photo('ok.jpg')]);
    expect(result.photos.map((p) => p.name)).toEqual(['ok.jpg']);
    expect(result.errors).toEqual([
      'A foto grande.jpg passa de 5 MB e não foi adicionada.',
      'O arquivo doc.pdf não é uma imagem e não foi adicionado.',
    ]);
  });

  it('limita a 5 fotos', () => {
    const current = [1, 2, 3, 4].map((n) => photo(`${n}.jpg`));
    const result = addPhotos(current, [photo('5.jpg'), photo('6.jpg')]);
    expect(result.photos).toHaveLength(5);
    expect(result.errors).toEqual(['Você pode enviar no máximo 5 fotos.']);
  });

  it('exige ao menos 1 foto', () => {
    expect(photosError([])).toBe('Adicione ao menos 1 foto.');
    expect(photosError([photo('a.jpg')])).toBeUndefined();
  });

  it('fecha o polígono repetindo o primeiro ponto', () => {
    expect(
      pointsToPolygon([
        [1, 2],
        [3, 4],
        [5, 6],
      ]),
    ).toEqual({
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          [1, 2],
        ],
      ],
    });
  });

  it('conta pontos', () => {
    expect(pointsCounter(2)).toBe('Marque pelo menos 3 pontos');
    expect(pointsCounter(4)).toBe('4 pontos');
  });

  it('monta o input zerando entrada e horário quando não se aplicam', () => {
    const input = toCreateSpotInput(
      { ...valid, name: ' Pico ', entryAmount: 'R$ 5', openingHours: 'x' },
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    );
    expect(input.name).toBe('Pico');
    expect(input.entryAmount).toBeNull();
    expect(input.openingHours).toBeNull();
    expect(input.coordinates.coordinates[0]).toHaveLength(4);
  });
});
