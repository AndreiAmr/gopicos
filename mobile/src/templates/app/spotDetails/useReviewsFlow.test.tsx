import { act, renderHook } from '@testing-library/react-native';
import { useReviewsFlow } from './useReviewsFlow';

const mockReload = jest.fn();
const mockLoadMore = jest.fn();
const mockMutate = jest.fn();
const mockShow = jest.fn();
const mockRefetch = jest.fn(() => Promise.resolve());

jest.mock('../../../hooks/query/spotReviews/useSpotReviews', () => ({
  useSpotReviews: () => ({ reload: mockReload, loadMore: mockLoadMore }),
}));
jest.mock('../../../hooks/mutation/spotReview/useCreateReviewMutation', () => ({
  useCreateReviewMutation: () => ({ mutate: mockMutate, loading: false }),
}));
jest.mock('@apollo/client/react', () => ({
  useApolloClient: () => ({ refetchQueries: mockRefetch }),
}));
jest.mock('../../../atomic/ds', () => ({ useToast: () => ({ show: mockShow }) }));

const mockReset = jest.fn();
const mockClearSession = jest.fn(() => Promise.resolve());
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ reset: mockReset }),
}));
jest.mock('../../../services/session', () => ({
  clearSession: () => mockClearSession(),
}));

const refreshSpot = jest.fn();

const setup = async () => {
  const hook = await renderHook(() =>
    useReviewsFlow({ spotId: 's1', refreshSpot }),
  );
  // O sheet é controlado por ref; aqui só interessa não quebrar ao dispensar.
  (hook.result.current.sheetRef as { current: unknown }).current = {
    dismiss: jest.fn(),
    present: jest.fn(),
  };
  return hook;
};

const apiError = (type: string, message = 'x') => ({
  errors: [{ type, message, statusCode: 400 }],
});

beforeEach(() => jest.clearAllMocks());

describe('useReviewsFlow.submit', () => {
  it('sucesso: toast, recarrega avaliações, detalhe e mapa', async () => {
    mockMutate.mockResolvedValue({});
    const { result } = await setup();

    await act(async () => result.current.submit(5, 'Top'));

    expect(mockMutate).toHaveBeenCalledWith({
      variables: { data: { spotId: 's1', rating: 5, description: 'Top' } },
    });
    expect(mockShow).toHaveBeenCalledWith({
      type: 'success',
      message: 'Avaliação enviada!',
    });
    expect(mockReload).toHaveBeenCalledWith(true);
    expect(refreshSpot).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalledWith({ include: ['GetAllSpots'] });
  });

  it('comentário vazio vai como null', async () => {
    mockMutate.mockResolvedValue({});
    const { result } = await setup();

    await act(async () => result.current.submit(3, ''));

    expect(mockMutate).toHaveBeenCalledWith({
      variables: { data: { spotId: 's1', rating: 3, description: null } },
    });
  });

  it('REVIEW_ALREADY_EXISTS: fecha, avisa e mostra a avaliação existente', async () => {
    mockMutate.mockRejectedValue(apiError('REVIEW_ALREADY_EXISTS'));
    const { result } = await setup();

    await act(async () => result.current.submit(5, ''));

    expect(mockShow).toHaveBeenCalledWith({
      type: 'info',
      message: 'Você já avaliou este pico. Edite sua avaliação.',
    });
    expect(mockReload).toHaveBeenCalledWith(true);
  });

  it('VALIDATION_ERROR: mensagem do servidor junto ao comentário', async () => {
    mockMutate.mockRejectedValue(apiError('VALIDATION_ERROR', 'Comentário longo demais.'));
    const { result } = await setup();

    await act(async () => result.current.submit(5, 'x'));

    expect(result.current.commentError).toBe('Comentário longo demais.');
    expect(mockShow).not.toHaveBeenCalled();
  });

  it('falha de rede: banner no formulário e nada recarregado', async () => {
    mockMutate.mockRejectedValue(new Error('rede'));
    const { result } = await setup();

    await act(async () => result.current.submit(5, 'x'));

    expect(result.current.error).toBe(
      'Não foi possível enviar sua avaliação. Tente novamente.',
    );
    expect(mockReload).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED: limpa a sessão e volta ao Login com o aviso', async () => {
    mockMutate.mockRejectedValue(apiError('UNAUTHENTICATED'));
    const { result } = await setup();

    await act(async () => result.current.submit(5, 'x'));

    expect(mockClearSession).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login', params: { notice: 'sessionExpired' } }],
    });
    expect(result.current.error).toBeNull();
  });
});
