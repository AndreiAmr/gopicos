import { apolloClient } from '../../config/apollo';
import { resetToLogin } from '../../routes/navigationRef';
import { clearSession } from './index';

type LoginParams = Parameters<typeof resetToLogin>[0];

/**
 * Encerra a sessão local: apaga o token (Keychain), limpa o cache do Apollo e
 * vai ao Login. É sempre possível (não depende de rede).
 */
export const logout = async (loginParams?: LoginParams) => {
  try {
    await clearSession();
  } finally {
    await apolloClient.clearStore().catch(() => undefined);
    resetToLogin(loginParams);
  }
};
