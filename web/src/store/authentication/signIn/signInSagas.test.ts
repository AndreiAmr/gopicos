import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSignIn, navigate, success, saveSession } = vi.hoisted(() => ({
  getSignIn: vi.fn(),
  navigate: vi.fn(),
  success: vi.fn(),
  saveSession: vi.fn(),
}));

vi.mock('./signInRepository', () => ({ signInRepository: { getSignIn } }));
vi.mock('@/routes/navigation', async (orig) => ({
  ...(await orig<typeof import('@/routes/navigation')>()),
  navigate,
}));
vi.mock('@/lib/notify', () => ({ notify: { success } }));
vi.mock('@/utils/session', () => ({ saveSession }));

import { runSagaIsolated } from '@/test-utils/runSaga';
import { signInActions } from './signInActions';
import { getSignInAsync, REACTIVATED_MESSAGE } from './signInSagas';
import { SignInActionTypes } from './signInTypes';

const credentials = { email: 'a@b.com', password: '12345678' };
const profile = { token: 'tk', exp: 99, name: 'A', email: 'a@b.com', id: '1' };

const run = (redirectTo?: string | null) =>
  runSagaIsolated(getSignInAsync, [
    signInActions.getSignInAsync(credentials, redirectTo),
  ]);

describe('getSignInAsync', () => {
  beforeEach(() => vi.clearAllMocks());

  it('persiste a sessão e vai para /home com replace', async () => {
    getSignIn.mockResolvedValue(profile);
    await run();
    expect(saveSession).toHaveBeenCalledWith({ token: 'tk', exp: 99 });
    expect(navigate).toHaveBeenCalledWith('/home', { replace: true });
    expect(success).not.toHaveBeenCalled();
  });

  it('vai para a rota pretendida quando segura', async () => {
    getSignIn.mockResolvedValue(profile);
    await run('/spot/new-spot');
    expect(navigate).toHaveBeenCalledWith('/spot/new-spot', { replace: true });
  });

  it('ignora rota pretendida externa', async () => {
    getSignIn.mockResolvedValue(profile);
    await run('//evil.com');
    expect(navigate).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('avisa quando a conta foi reativada', async () => {
    getSignIn.mockResolvedValue({ ...profile, reactivated: true });
    await run();
    expect(success).toHaveBeenCalledWith(REACTIVATED_MESSAGE);
  });

  it('em falha grava o erro, não navega nem persiste e encerra o loading', async () => {
    getSignIn.mockRejectedValue(new TypeError('Failed to fetch'));
    const actions = await run();
    expect(navigate).not.toHaveBeenCalled();
    expect(saveSession).not.toHaveBeenCalled();
    expect(actions).toContainEqual(signInActions.setErrorSignIn('network'));
    expect(actions.at(-1)).toEqual(signInActions.setIsLoadingSignIn(false));
    expect(actions.at(-1)?.type).toBe(SignInActionTypes.SET_IS_LOADING_SIGN_IN);
  });
});
