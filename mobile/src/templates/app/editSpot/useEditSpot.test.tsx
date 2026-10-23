import { act, renderHook } from '@testing-library/react-native';
import { useEditSpot } from './useEditSpot';
import { UpdateSpotError } from '../../../services/spot/updateSpot';
import type { SpotDetails } from '../../../domain/spot/details';

const mockReset = jest.fn();
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const polygon = {
  type: 'Polygon' as const,
  coordinates: [
    [
      [-46.65, -23.55],
      [-46.64, -23.55],
      [-46.64, -23.56],
      [-46.65, -23.55],
    ],
  ],
};

let mockParams: Record<string, unknown> = { id: 's1' };
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: mockReset,
    goBack: mockGoBack,
    navigate: mockNavigate,
    dispatch: jest.fn(),
    addListener: () => () => undefined,
  }),
  useRoute: () => ({ params: mockParams }),
}));

const mockShow = jest.fn();
jest.mock('../../../atomic/ds/molecules/Toast', () => ({
  useToast: () => ({ show: mockShow, hide: jest.fn() }),
}));

const mockRefetch = jest.fn(() => Promise.resolve([]));
jest.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({ refetchQueries: mockRefetch }),
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

jest.mock('../../../services/session', () => ({
  clearSession: jest.fn(() => Promise.resolve()),
}));

const spot: SpotDetails = {
  id: 's1',
  name: 'Pico da Praça',
  description: 'Escadas.',
  modality: 'street',
  isPaid: false,
  entryAmount: null,
  alwaysOpen: true,
  openingHours: null,
  hasCoverage: false,
  equipmentRequired: false,
  images: ['https://img/a.jpg'],
  coordinates: polygon,
  ratingAverage: null,
  reviewsCount: 0,
  isOwner: true,
  author: { id: 'u1', displayName: 'Marina S.' },
};

let mockQuery: { spot: SpotDetails | null; status: string; refetch: () => void };
jest.mock('../../../hooks/query/spotDetails/useSpotDetailsQuery', () => ({
  useSpotDetailsQuery: () => mockQuery,
}));

const mockUpdate = jest.fn();
jest.mock('../../../services/spot/updateSpot', () => {
  const actual = jest.requireActual('../../../services/spot/updateSpot');
  return {
    ...actual,
    updateSpotRequest: (...args: unknown[]) => mockUpdate(...args),
  };
});

const asset = { uri: 'file:///b.jpg', fileName: 'b.jpg', type: 'image/jpeg', fileSize: 100 };

const setup = async () => {
  const hook = await renderHook(() => useEditSpot());
  return hook;
};

describe('useEditSpot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 's1' };
    mockQuery = { spot, status: 'ready', refetch: jest.fn() };
  });

  it('abre preenchido com os dados e as fotos do pico', async () => {
    const { result } = await setup();

    expect(result.current.ready).toBe(true);
    expect(result.current.form.getValues('name')).toBe('Pico da Praça');
    expect(result.current.photos).toHaveLength(1);
    expect(result.current.pointsCount).toBe(3);
  });

  it('enquanto carrega não está pronto', async () => {
    mockQuery = { spot: null, status: 'loading', refetch: jest.fn() };
    const { result } = await setup();
    expect(result.current.ready).toBe(false);
  });

  it('não autor sai da tela com aviso', async () => {
    mockQuery = { spot: { ...spot, isOwner: false }, status: 'ready', refetch: jest.fn() };
    await setup();

    expect(mockShow).toHaveBeenCalledWith({
      type: 'error',
      message: 'Só quem criou o pico pode editá-lo.',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('salvar sem mudanças só volta ao detalhe', async () => {
    const { result } = await setup();

    await act(async () => {
      await result.current.submit();
    });

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('salva alterações, atualiza detalhe e mapa e volta', async () => {
    mockUpdate.mockResolvedValue('s1');
    const { result } = await setup();

    await act(async () => {
      result.current.form.setValue('name', 'Novo nome', { shouldDirty: true });
      result.current.handlePicked({ assets: [asset] });
    });
    await act(async () => {
      await result.current.submit();
    });

    const [id, input, photos] = mockUpdate.mock.calls[0];
    expect(id).toBe('s1');
    expect(input).toMatchObject({
      name: 'Novo nome',
      keepImages: ['https://img/a.jpg'],
    });
    expect(photos).toHaveLength(1);
    expect(mockRefetch).toHaveBeenCalledWith({
      include: ['GetSpotById', 'GetAllSpots'],
    });
    expect(mockShow).toHaveBeenCalledWith({
      type: 'success',
      message: 'Alterações salvas.',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('não deixa remover a última foto', async () => {
    const { result } = await setup();

    await act(async () => result.current.removePhoto(0));

    expect(result.current.photos).toHaveLength(1);
    expect(result.current.photoError).toBe('O pico precisa ter ao menos 1 foto.');
  });

  it('remove uma foto existente quando há outra', async () => {
    const { result } = await setup();

    await act(async () => result.current.handlePicked({ assets: [asset] }));
    await act(async () => result.current.removePhoto(0));

    expect(result.current.photos.map(p => p.uri)).toEqual(['file:///b.jpg']);
  });

  it('"Alterar local" abre o editor com o polígono atual', async () => {
    const { result } = await setup();

    result.current.changeLocation();

    expect(mockNavigate).toHaveBeenCalledWith('EditSpotLocation', {
      id: 's1',
      coordinates: polygon,
    });
  });

  it('usa o local devolvido pelo editor', async () => {
    const novo = {
      type: 'Polygon' as const,
      coordinates: [[[0, 0], [1, 0], [1, 1], [2, 2], [0, 0]]],
    };
    mockParams = { id: 's1', coordinates: novo };
    const { result } = await setup();

    expect(result.current.pointsCount).toBe(4);
  });

  it('UNAUTHENTICATED leva ao Login', async () => {
    mockUpdate.mockRejectedValue(
      new UpdateSpotError({ type: 'UNAUTHENTICATED', message: 'x', statusCode: 401 }),
    );
    const { result } = await setup();

    await act(async () => {
      result.current.form.setValue('name', 'Novo', { shouldDirty: true });
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
    });
  });

  it('FORBIDDEN avisa e volta; NOT_FOUND vai à Home com aviso', async () => {
    const { result } = await setup();
    await act(async () => {
      result.current.form.setValue('name', 'Novo', { shouldDirty: true });
    });

    mockUpdate.mockRejectedValueOnce(
      new UpdateSpotError({ type: 'FORBIDDEN', message: 'x', statusCode: 403 }),
    );
    await act(async () => {
      await result.current.submit();
    });
    expect(mockGoBack).toHaveBeenCalled();

    mockUpdate.mockRejectedValueOnce(
      new UpdateSpotError({ type: 'NOT_FOUND', message: 'x', statusCode: 404 }),
    );
    await act(async () => {
      await result.current.submit();
    });
    expect(mockShow).toHaveBeenCalledWith({
      type: 'info',
      message: 'Este pico já não existe.',
    });
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Home' }] });
  });

  it('falha de rede mantém as edições e mostra o banner', async () => {
    mockUpdate.mockRejectedValue(new UpdateSpotError(null));
    const { result } = await setup();

    await act(async () => {
      result.current.form.setValue('name', 'Novo', { shouldDirty: true });
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.banner).toBe(
      'Não foi possível salvar. Suas edições foram mantidas.',
    );
    expect(result.current.form.getValues('name')).toBe('Novo');
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('erro de campo do servidor vai para o campo', async () => {
    mockUpdate.mockRejectedValue(
      new UpdateSpotError({
        type: 'VALIDATION_ERROR',
        message: 'Informe o nome do pico.',
        statusCode: 400,
        field: 'name',
      } as never),
    );
    const { result } = await setup();

    await act(async () => {
      result.current.form.setValue('name', 'Novo', { shouldDirty: true });
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.form.control._formState.errors.name?.message).toBe(
      'Informe o nome do pico.',
    );
  });
});
