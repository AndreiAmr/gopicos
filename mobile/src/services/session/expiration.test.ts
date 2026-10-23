import { renderHook, waitFor } from '@testing-library/react-native';
import {
  expireSession,
  isSessionActive,
  restoreSession,
} from './expiration';
import { isUnauthenticatedError } from './errors';
import { useSessionBootstrap } from './useSessionBootstrap';

const mockGetSession = jest.fn();
const mockClearSession = jest.fn();
jest.mock('./index', () => ({
  getSession: () => mockGetSession(),
  clearSession: () => mockClearSession(),
}));

const mockResetToLogin = jest.fn();
const mockIsReady = jest.fn();
const mockCurrentRoute = jest.fn();
jest.mock('../../routes/navigationRef', () => ({
  resetToLogin: (p: unknown) => mockResetToLogin(p),
  navigationRef: {
    isReady: () => mockIsReady(),
    getCurrentRoute: () => mockCurrentRoute(),
  },
}));

const NOW = 1_700_000_000_000;
const session = (exp: number) => ({
  token: 't',
  exp,
  id: '1',
  name: 'N',
  email: 'a@b.com',
});

beforeEach(() => {
  jest.clearAllMocks();
  mockClearSession.mockResolvedValue(undefined);
  mockIsReady.mockReturnValue(true);
  mockCurrentRoute.mockReturnValue({ name: 'Home' });
});

describe('isSessionActive', () => {
  it('vale só com token e exp no futuro', () => {
    expect(isSessionActive(session(NOW / 1000 + 60), NOW)).toBe(true);
    expect(isSessionActive(session(NOW / 1000 - 1), NOW)).toBe(false);
    expect(isSessionActive({ token: '', exp: NOW }, NOW)).toBe(false);
    expect(isSessionActive(null, NOW)).toBe(false);
  });
});

describe('restoreSession', () => {
  it('devolve a sessão válida sem apagar', async () => {
    const valid = session(NOW / 1000 + 3600);
    mockGetSession.mockResolvedValue(valid);
    await expect(restoreSession(NOW)).resolves.toEqual(valid);
    expect(mockClearSession).not.toHaveBeenCalled();
  });

  it('sessão vencida é apagada do Keychain', async () => {
    mockGetSession.mockResolvedValue(session(NOW / 1000 - 10));
    await expect(restoreSession(NOW)).resolves.toBeNull();
    expect(mockClearSession).toHaveBeenCalled();
  });

  it('sem sessão ou Keychain com erro: abre no Login', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    await expect(restoreSession(NOW)).resolves.toBeNull();
    mockGetSession.mockRejectedValueOnce(new Error('keychain'));
    await expect(restoreSession(NOW)).resolves.toBeNull();
  });
});

describe('isUnauthenticatedError', () => {
  it('reconhece type no topo ou em extensions', () => {
    expect(isUnauthenticatedError({ errors: [{ type: 'UNAUTHENTICATED' }] })).toBe(true);
    expect(
      isUnauthenticatedError({ errors: [{ extensions: { type: 'UNAUTHENTICATED' } }] }),
    ).toBe(true);
  });

  it('ignora outros erros e erros de rede', () => {
    expect(isUnauthenticatedError({ errors: [{ type: 'FORBIDDEN' }] })).toBe(false);
    expect(isUnauthenticatedError(new Error('network'))).toBe(false);
    expect(isUnauthenticatedError(null)).toBe(false);
  });
});

describe('expireSession', () => {
  it('apaga o token, vai ao Login com aviso e limpa o cache', async () => {
    const clearCache = jest.fn().mockResolvedValue(undefined);
    await expireSession(clearCache);
    expect(mockClearSession).toHaveBeenCalled();
    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
    expect(clearCache).toHaveBeenCalled();
  });

  it('vai ao Login mesmo se o Keychain falhar', async () => {
    mockClearSession.mockRejectedValue(new Error('keychain'));
    await expireSession();
    expect(mockResetToLogin).toHaveBeenCalledWith({ notice: 'sessionExpired' });
  });

  it('já no Login não faz nada (evita reset em loop)', async () => {
    mockCurrentRoute.mockReturnValue({ name: 'Login' });
    await expireSession();
    expect(mockClearSession).not.toHaveBeenCalled();
    expect(mockResetToLogin).not.toHaveBeenCalled();
  });
});

describe('useSessionBootstrap', () => {
  it('com sessão válida abre autenticado', async () => {
    mockGetSession.mockResolvedValue(session(Date.now() / 1000 + 3600));
    const { result } = await renderHook(() => useSessionBootstrap());
    await waitFor(() =>
      expect(result.current).toEqual({ status: 'ready', authenticated: true }),
    );
  });

  it('sem sessão abre no Login', async () => {
    mockGetSession.mockResolvedValue(null);
    const { result } = await renderHook(() => useSessionBootstrap());
    await waitFor(() =>
      expect(result.current).toEqual({ status: 'ready', authenticated: false }),
    );
  });
});
