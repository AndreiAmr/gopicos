import {
  UpdateSpotError,
  buildUpdateSpotBody,
  updateSpotRequest,
} from './updateSpot';

jest.mock('../session', () => ({ getToken: jest.fn(() => Promise.resolve('jwt')) }));
jest.mock('../../config/apollo', () => ({
  graphqlEndpoint: 'http://api.test/graphql',
}));

const photo = { uri: 'file:///a.jpg', name: 'a.jpg', type: 'image/jpeg', size: 10 };

class FakeFormData {
  _parts: [string, unknown][] = [];
  append(key: string, value: unknown) {
    this._parts.push([key, value]);
  }
}

const partsOf = (body: FormData) => (body as unknown as FakeFormData)._parts;

describe('updateSpot (multipart)', () => {
  const fetchMock = jest.fn();
  beforeAll(() => {
    (globalThis as any).fetch = fetchMock;
    (globalThis as any).FormData = FakeFormData;
  });
  beforeEach(() => fetchMock.mockReset());

  it('monta operations com id, keepImages e as fotos novas', () => {
    const byKey = Object.fromEntries(
      partsOf(buildUpdateSpotBody('s1', { name: 'Pico', keepImages: ['u'] }, [photo])),
    );

    const operations = JSON.parse(byKey.operations as string);
    expect(operations.variables).toEqual({
      id: 's1',
      input: { name: 'Pico', keepImages: ['u'], newImages: [null] },
    });
    expect(JSON.parse(byKey.map as string)).toEqual({
      0: ['variables.input.newImages.0'],
    });
    expect(byKey['0']).toEqual({ uri: 'file:///a.jpg', name: 'a.jpg', type: 'image/jpeg' });
  });

  it('envia com token e devolve o id', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ data: { updateSpot: { id: 's1' } } }),
    });

    await expect(updateSpotRequest('s1', {}, [])).resolves.toBe('s1');
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer jwt');
  });

  it('erro do servidor traz type e field', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve({
          data: null,
          errors: [
            {
              message: 'Só quem criou o pico pode editá-lo.',
              type: 'FORBIDDEN',
              statusCode: 403,
              extensions: { field: 'name' },
            },
          ],
        }),
    });

    const error = await updateSpotRequest('s1', {}, []).catch(e => e);
    expect(error).toBeInstanceOf(UpdateSpotError);
    expect(error.apiError).toMatchObject({ type: 'FORBIDDEN', field: 'name' });
  });

  it('falha de rede vira erro sem apiError', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    const error = await updateSpotRequest('s1', {}, []).catch(e => e);
    expect(error.apiError).toBeNull();
  });
});
