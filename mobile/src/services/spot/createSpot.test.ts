import {
  CreateSpotError,
  buildCreateSpotBody,
  createSpotRequest,
} from './createSpot';

jest.mock('../session', () => ({ getToken: jest.fn(() => Promise.resolve('jwt')) }));
jest.mock('../../config/apollo', () => ({
  graphqlEndpoint: 'http://api.test/graphql',
}));

const photo = { uri: 'file:///a.jpg', name: 'a.jpg', type: 'image/jpeg', size: 10 };

/** FormData como o do React Native: guarda as partes em `_parts`. */
class FakeFormData {
  _parts: [string, unknown][] = [];
  append(key: string, value: unknown) {
    this._parts.push([key, value]);
  }
}

const partsOf = (body: FormData) =>
  (body as unknown as FakeFormData)._parts;

describe('createSpot (multipart)', () => {
  const fetchMock = jest.fn();
  beforeAll(() => {
    (globalThis as any).fetch = fetchMock;
    (globalThis as any).FormData = FakeFormData;
  });
  beforeEach(() => fetchMock.mockReset());

  it('monta operations, map e um arquivo por foto', () => {
    const parts = partsOf(buildCreateSpotBody({ name: 'Pico' }, [photo, photo]));
    const byKey = Object.fromEntries(parts);

    const operations = JSON.parse(byKey.operations as string);
    expect(operations.variables.input).toEqual({ name: 'Pico', images: [null, null] });
    expect(JSON.parse(byKey.map as string)).toEqual({
      0: ['variables.input.images.0'],
      1: ['variables.input.images.1'],
    });
    expect(byKey['0']).toEqual({ uri: 'file:///a.jpg', name: 'a.jpg', type: 'image/jpeg' });
  });

  it('envia com token e devolve o id', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ data: { createSpot: { id: 's1' } } }),
    });

    await expect(createSpotRequest({}, [photo])).resolves.toBe('s1');
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer jwt');
    expect(init.headers['apollo-require-preflight']).toBe('true');
  });

  it('erro do servidor traz type e field', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve({
          data: null,
          errors: [
            {
              message: 'Informe o nome do pico.',
              type: 'VALIDATION_ERROR',
              statusCode: 400,
              extensions: { field: 'name' },
            },
          ],
        }),
    });

    const error = await createSpotRequest({}, [photo]).catch(e => e);
    expect(error).toBeInstanceOf(CreateSpotError);
    expect(error.apiError).toMatchObject({ type: 'VALIDATION_ERROR', field: 'name' });
  });

  it('falha de rede vira erro sem apiError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    const error = await createSpotRequest({}, [photo]).catch(e => e);
    expect(error).toBeInstanceOf(CreateSpotError);
    expect(error.apiError).toBeNull();
  });
});
