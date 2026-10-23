import { act, renderHook } from '@testing-library/react-native';
import { useDeleteAccount } from './useDeleteAccount';
import { keepsActivityText, mapDeleteError } from './logic';

const mockGoBack = jest.fn();
const mockMutate = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);
const mockResetToLogin = jest.fn();
let mockProfile: Record<string, unknown> | null;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));
jest.mock('../../../../hooks/query/profile/useProfile', () => ({
  useProfile: () => ({ profile: mockProfile }),
}));
jest.mock(
  '../../../../hooks/mutation/deleteAccount/useDeleteAccountMutation',
  () => ({
    useDeleteAccountMutation: () => ({ mutate: mockMutate, loading: false }),
  }),
);
jest.mock('../../../../services/session/logout', () => ({
  logout: (p: unknown) => mockLogout(p),
}));
jest.mock('../../../../routes/navigationRef', () => ({
  resetToLogin: (p: unknown) => mockResetToLogin(p),
}));

const submit = async (password = 'senha123') => {
  const hook = await renderHook(() => useDeleteAccount());
  await act(async () => {
    hook.result.current.control._formValues.password = password;
    await hook.result.current.handleDelete();
  });
  return hook;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockProfile = { email: 'a@b.com', spotsCount: 2, reviewsCount: 1 };
});

describe('keepsActivityText', () => {
  it('sem contagens usa o texto genérico', () => {
    expect(keepsActivityText(undefined, undefined)).toBe(
      'Seus picos e avaliações continuam no GoPicos, com o autor mostrado como "Usuário Desativado".',
    );
  });

  it('com contagens cita picos e avaliações', () => {
    expect(keepsActivityText(3, 2)).toBe(
      'Seus 3 picos e 2 avaliações continuam no GoPicos, com o autor mostrado como "Usuário Desativado".',
    );
  });

  it('singular e só um dos dois', () => {
    expect(keepsActivityText(1, 0)).toMatch(/^Seu 1 pico continua no GoPicos/);
    expect(keepsActivityText(0, 1)).toMatch(/^Sua 1 avaliação continua no GoPicos/);
    expect(keepsActivityText(0, 4)).toMatch(/^Seus 4 avaliações continuam/);
  });

  it('ambas zero omite o item', () => {
    expect(keepsActivityText(0, 0)).toBeNull();
  });
});

describe('mapDeleteError', () => {
  it('INVALID_CREDENTIALS vira erro no campo', () => {
    expect(
      mapDeleteError({ errors: [{ type: 'INVALID_CREDENTIALS', message: 'x' }] }),
    ).toEqual({ kind: 'field', message: 'Senha incorreta.' });
  });

  it('UNAUTHENTICATED e rede', () => {
    expect(
      mapDeleteError({ errors: [{ type: 'UNAUTHENTICATED', message: 'x' }] }),
    ).toEqual({ kind: 'sessionExpired' });
    expect(mapDeleteError({ networkError: {} })).toEqual(
      expect.objectContaining({ kind: 'banner' }),
    );
  });
});

describe('useDeleteAccount', () => {
  it('sucesso encerra a sessão e vai ao Login com aviso e e-mail', async () => {
    mockMutate.mockResolvedValue({ data: {} });
    await submit();

    expect(mockMutate).toHaveBeenCalledWith({
      variables: { props: { password: 'senha123' } },
    });
    expect(mockLogout).toHaveBeenCalledWith({
      notice: 'accountDeleted',
      email: 'a@b.com',
    });
  });

  it('senha vazia não chama o servidor', async () => {
    const hook = await submit('');

    expect(mockMutate).not.toHaveBeenCalled();
    expect(hook.result.current.errors.password?.message).toBe(
      'Informe sua senha para continuar.',
    );
  });

  it('senha incorreta mostra erro no campo e mantém a sessão', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'INVALID_CREDENTIALS', message: 'x' }],
    });
    const hook = await submit();

    expect(hook.result.current.errors.password?.message).toBe('Senha incorreta.');
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('erro de rede mostra banner e nada é apagado localmente', async () => {
    mockMutate.mockRejectedValue({ networkError: {} });
    const hook = await submit();

    expect(hook.result.current.banner).toMatch(/conexão/);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED leva ao Login de sessão expirada', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'UNAUTHENTICATED', message: 'x' }],
    });
    await submit();

    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
  });

  it('expõe o texto das atividades a partir das contagens do perfil', async () => {
    const { result } = await renderHook(() => useDeleteAccount());
    expect(result.current.keepsActivity).toMatch(/^Seus 2 picos e 1 avaliação continuam/);
  });
});
