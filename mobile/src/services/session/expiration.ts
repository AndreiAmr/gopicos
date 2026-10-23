import { navigationRef, resetToLogin } from '../../routes/navigationRef';
import { clearSession, getSession, type Session } from './index';

/** O token vale enquanto `exp` (segundos) estiver no futuro. */
export const isSessionActive = (
  session: Pick<Session, 'token' | 'exp'> | null,
  now: number = Date.now(),
): boolean =>
  Boolean(session?.token) &&
  typeof session?.exp === 'number' &&
  session.exp * 1000 > now;

/**
 * Lê a sessão do Keychain ao abrir o app. Sessão ausente, corrompida ou
 * vencida é apagada e devolve `null` (o app abre no Login).
 */
export const restoreSession = async (
  now: number = Date.now(),
): Promise<Session | null> => {
  let session: Session | null = null;
  try {
    session = await getSession();
  } catch {
    session = null;
  }

  if (session && isSessionActive(session, now)) {
    return session;
  }

  await clearSession().catch(() => undefined);
  return null;
};

/**
 * Sessão recusada pelo backend: apaga o token do Keychain, limpa o cache e
 * volta ao Login (pilha resetada) com o aviso de sessão expirada. Já no
 * Login (ex.: várias respostas 401 em sequência), não faz nada.
 */
export const expireSession = async (clearCache?: () => Promise<unknown>) => {
  if (
    navigationRef.isReady() &&
    navigationRef.getCurrentRoute()?.name === 'Login'
  ) {
    return;
  }

  try {
    await clearSession();
  } catch {
    // Sem conseguir apagar agora, o Login com aviso tenta de novo (useLogin).
  } finally {
    resetToLogin({ notice: 'sessionExpired' });
    await clearCache?.().catch(() => undefined);
  }
};
