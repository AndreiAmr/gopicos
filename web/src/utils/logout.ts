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
  // Sessão expirada: o guard global do Apollo já levou ao Login guardando a
  // rota pretendida; navegar de novo apagaria esse `from`.
  if (state?.sessionExpired && window.location.pathname === URL.LOGIN) return;
  navigate(URL.LOGIN, { replace: true, state });
};
