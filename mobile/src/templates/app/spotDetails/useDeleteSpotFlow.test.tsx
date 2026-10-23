import { act, renderHook } from '@testing-library/react-native';
import { useDeleteSpotFlow } from './useDeleteSpotFlow';

const mockMutate = jest.fn();
const mockShow = jest.fn();
const mockRefetch = jest.fn(() => Promise.resolve());
const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockClearSession = jest.fn(() => Promise.resolve());

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
}));
jest.mock('../../../hooks/mutation/spot/useDeleteSpotMutation', () => ({
  useDeleteSpotMutation: () => ({ mutate: mockMutate, loading: false }),
}));
jest.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({ refetchQueries: mockRefetch }),
}));
jest.mock('../../../atomic/ds', () => ({
  useToast: () => ({ show: mockShow }),
}));
jest.mock('../../../services/session', () => ({
  clearSession: () => mockClearSession(),
}));

const present = jest.fn();
const dismiss = jest.fn();

const setup = async () => {
  const hook = await renderHook(() => useDeleteSpotFlow('s1'));
  (hook.result.current.sheetRef as { current: unknown }).current = {
    present,
    dismiss,
  };
  return hook;
};

const apiError = (type: string) => ({
  errors: [{ type, message: 'x', statusCode: 400 }],
});

beforeEach(() => jest.clearAllMocks());

describe('useDeleteSpotFlow', () => {
  it('open abre a confirmação e cancel fecha sem excluir', async () => {
    const { result } = await setup();

    await act(async () => result.current.open());
    expect(present).toHaveBeenCalled();

    await act(async () => result.current.cancel());
    expect(dismiss).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('sucesso: toast, atualiza mapa e meus picos e volta à Home', async () => {
    mockMutate.mockResolvedValue({});
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockMutate).toHaveBeenCalledWith({ variables: { id: 's1' } });
    expect(mockRefetch).toHaveBeenCalledWith({
      include: ['GetAllSpots', 'MySpots'],
    });
    expect(mockNavigate).toHaveBeenCalledWith('Home');
    expect(mockShow).toHaveBeenCalledWith({
      type: 'success',
      message: 'Pico excluído.',
    });
  });

  it('NOT_FOUND: trata como sucesso silencioso com toast informativo', async () => {
    mockMutate.mockRejectedValue(apiError('NOT_FOUND'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockNavigate).toHaveBeenCalledWith('Home');
    expect(mockShow).toHaveBeenCalledWith({
      type: 'info',
      message: 'Este pico já não existe.',
    });
  });

  it('FORBIDDEN: toast de erro, fecha e não sai da tela', async () => {
    mockMutate.mockRejectedValue(apiError('FORBIDDEN'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockShow).toHaveBeenCalledWith({
      type: 'error',
      message: 'Só quem criou o pico pode excluí-lo.',
    });
    expect(dismiss).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED: limpa a sessão e vai ao Login', async () => {
    mockMutate.mockRejectedValue(apiError('UNAUTHENTICATED'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockClearSession).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
    });
  });

  it('erro de rede: mantém a confirmação aberta com mensagem, e limpa ao fechar', async () => {
    mockMutate.mockRejectedValue(new Error('network'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(result.current.error).toBe('Não foi possível excluir. Tente novamente.');
    expect(dismiss).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    await act(async () => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
