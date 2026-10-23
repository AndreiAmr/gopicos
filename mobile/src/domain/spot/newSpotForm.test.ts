import {
  NewSpotFormData,
  addPhotos,
  newSpotDefaults,
  newSpotSchema,
  photoCounter,
  photosError,
  toCreateSpotInput,
} from './newSpotForm';

const photo = (name: string, size = 1000) => ({
  uri: `file:///${name}`,
  name,
  type: 'image/jpeg',
  size,
});

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
  } catch (error: any) {
    return error.errors as string[];
  }
};

describe('formulário de novo pico', () => {
  it('exige nome, descrição e modalidade', async () => {
    expect(await errorsOf(newSpotDefaults)).toEqual([
      'Informe o nome do pico.',
      'Descreva o pico.',
      'Escolha a modalidade.',
    ]);
    expect(await errorsOf(valid)).toEqual([]);
  });

  it('valor obrigatório se pago e horário se não for 24 h', async () => {
    expect(await errorsOf({ ...valid, isPaid: true })).toEqual([
      'Informe o valor da entrada.',
    ]);
    expect(await errorsOf({ ...valid, alwaysOpen: false })).toEqual([
      'Informe o horário de funcionamento.',
    ]);
  });

  it('limites de 80 e 1000 caracteres', async () => {
    expect(await errorsOf({ ...valid, name: 'a'.repeat(81) })).toHaveLength(1);
    expect(
      await errorsOf({ ...valid, description: 'a'.repeat(1001) }),
    ).toHaveLength(1);
  });

  it('fotos: recusa acima de 5 MB e corta em 5', () => {
    const big = addPhotos([], [photo('grande.jpg', 6 * 1024 * 1024), photo('a.jpg')]);
    expect(big.photos.map(p => p.name)).toEqual(['a.jpg']);
    expect(big.errors).toEqual([
      'A foto grande.jpg passa de 5 MB e não foi adicionada.',
    ]);

    const many = addPhotos(
      [photo('1'), photo('2'), photo('3'), photo('4')],
      [photo('5'), photo('6')],
    );
    expect(many.photos).toHaveLength(5);
    expect(many.errors).toEqual(['Você pode enviar no máximo 5 fotos.']);

    expect(photosError([])).toBe('Adicione ao menos 1 foto.');
    expect(photosError([photo('a')])).toBeUndefined();
    expect(photoCounter(2)).toBe('2 de 5 fotos');
  });

  it('monta o input da mutation sem campos que não se aplicam', () => {
    const polygon = { type: 'Polygon' as const, coordinates: [[[0, 0]]] };
    expect(
      toCreateSpotInput(
        { ...valid, name: ' Pico ', entryAmount: 'R$ 5', openingHours: '8h' },
        polygon,
      ),
    ).toMatchObject({
      name: 'Pico',
      entryAmount: null,
      openingHours: null,
      coordinates: polygon,
    });
    expect(
      toCreateSpotInput(
        { ...valid, isPaid: true, entryAmount: ' R$ 5 ', alwaysOpen: false, openingHours: '8h' },
        polygon,
      ),
    ).toMatchObject({ entryAmount: 'R$ 5', openingHours: '8h' });
  });
});
