import { apolloClient } from '@/config/apollo-client';
import { navigate } from '@/routes/navigation';
import { URL } from '@/routes/url';

import { clearSession } from './session';

type LoginState = {
  sessionExpired?: boolean;
  accountDeleted?: boolean;
  email?: string;
};

/**
 * Encerra a sessão local: apaga o token, limpa o cache do Apollo e vai ao Login
 * com `replace` (o voltar não retorna a páginas protegidas). Não depende de rede.
 */
export const logout = async (state?: LoginState): Promise<void> => {
  clearSession();
  await apolloClient.clearStore().catch(() => undefined);
  navigate(URL.LOGIN, { replace: true, state });
};
