import { act, renderHook } from '@testing-library/react-native';
import { useDeleteReviewFlow } from './useDeleteReviewFlow';

const mockMutate = jest.fn();
const mockShow = jest.fn();
const mockResetToLogin = jest.fn();

jest.mock('../../../hooks/mutation/spotReview/useDeleteReviewMutation', () => ({
  useDeleteReviewMutation: () => ({ mutate: mockMutate, loading: false }),
}));
jest.mock('../../../atomic/ds', () => ({ useToast: () => ({ show: mockShow }) }));
jest.mock('../../../routes/navigationRef', () => ({
  resetToLogin: (p: unknown) => mockResetToLogin(p),
}));

const onDeleted = jest.fn();
const sheet = { present: jest.fn(), dismiss: jest.fn() };

const setup = async () => {
  const hook = await renderHook(() => useDeleteReviewFlow(onDeleted));
  (hook.result.current.sheetRef as { current: unknown }).current = sheet;
  await act(async () => hook.result.current.open('r1'));
  return hook;
};

const apiError = (type: string) => ({
  errors: [{ type, message: 'x', statusCode: 400 }],
});

beforeEach(() => jest.clearAllMocks());

describe('useDeleteReviewFlow', () => {
  it('Excluir abre a confirmação sem excluir', async () => {
    await setup();
    expect(sheet.present).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('confirmar exclui, fecha, avisa e atualiza lista/média/mapa', async () => {
    mockMutate.mockResolvedValue({});
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockMutate).toHaveBeenCalledWith({ variables: { id: 'r1' } });
    expect(sheet.dismiss).toHaveBeenCalled();
    expect(mockShow).toHaveBeenCalledWith({
      type: 'success',
      message: 'Avaliação excluída.',
    });
    expect(onDeleted).toHaveBeenCalled();
  });

  it('cancelar fecha sem excluir', async () => {
    const { result } = await setup();
    await act(async () => result.current.cancel());
    expect(sheet.dismiss).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('erro de rede: banner na confirmação, que continua aberta', async () => {
    mockMutate.mockRejectedValue(new Error('rede'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(result.current.error).toBe(
      'Não foi possível excluir. Tente novamente.',
    );
    expect(sheet.dismiss).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('NOT_FOUND vira sucesso silencioso com aviso', async () => {
    mockMutate.mockRejectedValue(apiError('NOT_FOUND'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockShow).toHaveBeenCalledWith({
      type: 'info',
      message: 'Esta avaliação já não existe.',
    });
    expect(onDeleted).toHaveBeenCalled();
  });

  it('FORBIDDEN fecha com toast de erro', async () => {
    mockMutate.mockRejectedValue(apiError('FORBIDDEN'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' }),
    );
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED leva ao Login', async () => {
    mockMutate.mockRejectedValue(apiError('UNAUTHENTICATED'));
    const { result } = await setup();

    await act(async () => result.current.confirm());

    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
  });
});
