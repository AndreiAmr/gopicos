import { act, renderHook } from '@testing-library/react-native';
import { useLogin } from './useLogin';
import { clearSession, saveSession } from '../../../services/session';

const mockReset = jest.fn();
const mockNavigate = jest.fn();
const mockToast = jest.fn();
const mockMutate = jest.fn();
let mockParams: unknown;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ reset: mockReset, navigate: mockNavigate }),
  useRoute: () => ({ params: mockParams }),
}));
jest.mock('../../../services/session', () => ({
  saveSession: jest.fn(),
  clearSession: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../atomic/ds', () => ({
  useToast: () => ({ show: mockToast }),
}));
jest.mock('../../../hooks/mutation/login/useLoginMutation', () => ({
  ELoginErrors: { INVALID_CREDENTIALS: 'INVALID_CREDENTIALS' },
  useLoginMutation: () => ({ mutate: mockMutate }),
}));
jest.mock('../../../config/apollo', () => ({
  normalizeApolloError: (e: { errors?: unknown[] }) => e?.errors?.[0] ?? null,
}));

const user = { token: 't', exp: 1, id: '1', name: 'N', email: 'a@b.com' };

const submit = async (email = 'a@b.com', password = 'pw') => {
  const hook = await renderHook(() => useLogin());
  await act(async () => {
    hook.result.current.control._formValues.email = email;
    hook.result.current.control._formValues.password = password;
    await hook.result.current.handleLogin();
  });
  return hook;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = undefined;
});

describe('useLogin', () => {
  it('sucesso salva a sessão e navega para Home', async () => {
    mockMutate.mockResolvedValue({ data: { login: user } });
    await submit();
    expect(saveSession).toHaveBeenCalledWith(user);
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('reactivated mostra o toast de boas-vindas', async () => {
    mockMutate.mockResolvedValue({
      data: { login: { ...user, reactivated: true } },
    });
    await submit();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('reativada'),
      }),
    );
  });

  it('INVALID_CREDENTIALS gera falha credentials', async () => {
    mockMutate.mockRejectedValue({
      errors: [{ type: 'INVALID_CREDENTIALS', message: 'x' }],
    });
    const { result } = await submit();
    expect(result.current.failure).toBe('credentials');
    expect(saveSession).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('erro sem ApiError vira falha de rede', async () => {
    mockMutate.mockRejectedValue(new Error('Network'));
    const { result } = await submit();
    expect(result.current.failure).toBe('network');
  });

  it('lê e-mail e notice dos params e navega para Signup', async () => {
    mockParams = { email: 'x@y.com', notice: 'registered' };
    const { result } = await renderHook(() => useLogin());
    expect(result.current.notice).toBe('registered');
    result.current.goToSignup();
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  it('sessionExpired limpa o token do Keychain', async () => {
    mockParams = { notice: 'sessionExpired' };
    await renderHook(() => useLogin());
    expect(clearSession).toHaveBeenCalled();
  });
});
