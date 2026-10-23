import { navigate, sanitizeRedirect } from '@/routes/navigation';
import { URL } from '@/routes/url';

import { clearSession } from './session';

type GraphQLErrorLike = {
  type?: unknown;
  extensions?: { type?: unknown } | null;
};

/** Algum erro GraphQL da resposta é `UNAUTHENTICATED`? */
export const isUnauthenticated = (
  errors?: readonly GraphQLErrorLike[] | null,
): boolean =>
  Array.isArray(errors) &&
  errors.some(
    (error) =>
      error?.type === 'UNAUTHENTICATED' ||
      error?.extensions?.type === 'UNAUTHENTICATED',
  );

/** Rota atual (caminho + query). */
export const currentPath = (): string =>
  `${window.location.pathname}${window.location.search}`;

/**
 * Sessão recusada pelo backend: apaga o token, vai ao Login com `replace` e o
 * aviso de sessão expirada, guardando a rota para voltar depois de entrar.
 * Já no Login (várias respostas 401 seguidas), não faz nada.
 */
export const expireSession = (clearCache?: () => Promise<unknown>): void => {
  if (window.location.pathname === URL.LOGIN) return;

  const from = sanitizeRedirect(currentPath());
  clearSession();
  navigate(URL.LOGIN, {
    replace: true,
    state: { sessionExpired: true, ...(from ? { from } : {}) },
  });
  clearCache?.().catch(() => undefined);
};
