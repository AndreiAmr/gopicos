import * as Keychain from 'react-native-keychain';
import { clearSession, getSession, getToken, saveSession } from './index';

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

const kc = Keychain as jest.Mocked<typeof Keychain>;
const session = { token: 't', exp: 1, id: '1', name: 'N', email: 'a@b.com' };

beforeEach(() => jest.clearAllMocks());

describe('session', () => {
  it('grava a sessão no Keychain', async () => {
    kc.setGenericPassword.mockResolvedValue({
      service: 's',
      storage: 'x',
    } as never);
    await saveSession(session);
    expect(kc.setGenericPassword).toHaveBeenCalledWith(
      '1',
      JSON.stringify(session),
      expect.objectContaining({ service: 'gopicos.session' }),
    );
  });

  it('lança se o Keychain não gravar', async () => {
    kc.setGenericPassword.mockResolvedValue(false as never);
    await expect(saveSession(session)).rejects.toThrow();
  });

  it('lê token e trata ausência/JSON inválido', async () => {
    kc.getGenericPassword.mockResolvedValueOnce({
      password: JSON.stringify(session),
    } as never);
    expect(await getToken()).toBe('t');
    kc.getGenericPassword.mockResolvedValueOnce(false as never);
    expect(await getSession()).toBeNull();
    kc.getGenericPassword.mockResolvedValueOnce({ password: '{' } as never);
    expect(await getSession()).toBeNull();
  });

  it('limpa a sessão', async () => {
    await clearSession();
    expect(kc.resetGenericPassword).toHaveBeenCalled();
  });
});
