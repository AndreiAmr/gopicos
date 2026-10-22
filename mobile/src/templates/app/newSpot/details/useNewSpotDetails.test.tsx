import { act, renderHook } from '@testing-library/react-native';
import { useNewSpotDetails } from './useNewSpotDetails';
import { CreateSpotError } from '../../../../services/spot/createSpot';

const mockReset = jest.fn();
const mockGoBack = jest.fn();
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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: mockReset,
    goBack: mockGoBack,
    dispatch: jest.fn(),
    addListener: () => () => undefined,
  }),
  useRoute: () => ({ params: { coordinates: polygon } }),
}));

const mockShow = jest.fn();
jest.mock('../../../../atomic/ds/molecules/Toast', () => ({
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

jest.mock('../../../../services/session', () => ({
  clearSession: jest.fn(() => Promise.resolve()),
}));

const mockCreate = jest.fn();
jest.mock('../../../../services/spot/createSpot', () => {
  const actual = jest.requireActual('../../../../services/spot/createSpot');
  return {
    ...actual,
    createSpotRequest: (...args: unknown[]) => mockCreate(...args),
  };
});

const asset = { uri: 'file:///a.jpg', fileName: 'a.jpg', type: 'image/jpeg', fileSize: 100 };

const fillValid = async (result: { current: ReturnType<typeof useNewSpotDetails> }) => {
  await act(async () => {
    result.current.form.setValue('name', 'Pico da Praça', { shouldDirty: true });
    result.current.form.setValue('description', 'Escadas', { shouldDirty: true });
    result.current.form.setValue('modality', 'street', { shouldDirty: true });
    result.current.handlePicked({ assets: [asset] });
  });
};

describe('useNewSpotDetails', () => {
  beforeEach(() => jest.clearAllMocks());

  it('conta os pontos do polígono e volta para alterar o local', async () => {
    const { result } = await renderHook(() => useNewSpotDetails());

    expect(result.current.pointsCount).toBe(3);
    result.current.changeLocation();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('sem foto não envia e mostra o erro de fotos', async () => {
    const { result } = await renderHook(() => useNewSpotDetails());
    await act(async () => {
      result.current.form.setValue('name', 'Pico');
      result.current.form.setValue('description', 'd');
      result.current.form.setValue('modality', 'street');
    });

    await act(async () => result.current.submit());

    expect(mockCreate).not.toHaveBeenCalled();
    expect(result.current.photoError).toBe('Adicione ao menos 1 foto.');
  });

  it('sucesso: envia, atualiza o mapa e vai ao detalhe do pico novo', async () => {
    mockCreate.mockResolvedValue('novo-id');
    const { result } = await renderHook(() => useNewSpotDetails());
    await fillValid(result);

    await act(async () => result.current.submit());

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Pico da Praça', coordinates: polygon }),
      [expect.objectContaining({ uri: 'file:///a.jpg', name: 'a.jpg' })],
    );
    expect(mockRefetch).toHaveBeenCalledWith({ include: ['GetAllSpots'] });
    expect(mockShow).toHaveBeenCalledWith({ type: 'success', message: 'Pico criado!' });
    expect(mockReset).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'SpotDetails', params: { id: 'novo-id' } }],
    });
  });

  it('falha de rede mantém os dados e mostra o banner', async () => {
    mockCreate.mockRejectedValue(new CreateSpotError(null));
    const { result } = await renderHook(() => useNewSpotDetails());
    await fillValid(result);

    await act(async () => result.current.submit());

    expect(result.current.banner).toBe(
      'Não foi possível criar o pico. Seus dados foram mantidos.',
    );
    expect(result.current.form.getValues('name')).toBe('Pico da Praça');
    expect(result.current.photos).toHaveLength(1);
    expect(result.current.submitting).toBe(false);
  });

  it('VALIDATION_ERROR do servidor vai para o campo', async () => {
    mockCreate.mockRejectedValue(
      new CreateSpotError({
        type: 'VALIDATION_ERROR',
        message: 'O nome deve ter no máximo 80 caracteres.',
        statusCode: 400,
        field: 'name',
      }),
    );
    const { result } = await renderHook(() => useNewSpotDetails());
    await fillValid(result);

    await act(async () => result.current.submit());

    expect(result.current.form.getFieldState('name').error?.message).toBe(
      'O nome deve ter no máximo 80 caracteres.',
    );
    expect(result.current.banner).toBeNull();
  });

  it('sessão expirada leva ao Login', async () => {
    mockCreate.mockRejectedValue(
      new CreateSpotError({ type: 'UNAUTHENTICATED', message: 'x', statusCode: 401 }),
    );
    const { result } = await renderHook(() => useNewSpotDetails());
    await fillValid(result);

    await act(async () => result.current.submit());

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
    });
  });
});
