import { beforeEach, describe, expect, it, vi } from 'vitest';

import { expireSession, isUnauthenticated } from './sessionExpiration';

const mockNavigate = vi.fn();
const mockClearSession = vi.fn();

vi.mock('@/routes/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/routes/navigation')>()),
  navigate: (...args: unknown[]) => mockNavigate(...args),
}));
vi.mock('./session', () => ({ clearSession: () => mockClearSession() }));

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, '', '/spot/7?x=1');
});

describe('isUnauthenticated', () => {
  it('reconhece o type em extensions ou no topo', () => {
    expect(isUnauthenticated([{ extensions: { type: 'UNAUTHENTICATED' } }])).toBe(true);
    expect(isUnauthenticated([{ type: 'UNAUTHENTICATED' }])).toBe(true);
  });

  it('ignora outros erros e ausência de erros', () => {
    expect(isUnauthenticated([{ extensions: { type: 'FORBIDDEN' } }])).toBe(false);
    expect(isUnauthenticated(undefined)).toBe(false);
  });
});

describe('expireSession', () => {
  it('apaga a sessão, vai ao Login com aviso e guarda a rota', async () => {
    const clearCache = vi.fn().mockResolvedValue(undefined);
    expireSession(clearCache);

    expect(mockClearSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/', {
      replace: true,
      state: { sessionExpired: true, from: '/spot/7?x=1' },
    });
    expect(clearCache).toHaveBeenCalled();
  });

  it('já no Login não faz nada', () => {
    window.history.replaceState(null, '', '/');
    expireSession();
    expect(mockClearSession).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
