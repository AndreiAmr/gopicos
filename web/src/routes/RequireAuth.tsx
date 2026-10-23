import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { getToken } from '@/utils/session';

import { URL } from './url';

/** Caminho completo da rota atual, guardado para voltar a ela depois do login. */
const intendedPath = (location: { pathname: string; search?: string }) =>
  `${location.pathname}${location.search ?? ''}`;

/**
 * Guard de rotas (GP-028): sem sessão válida, vai ao Login com `replace`,
 * guardando a rota pretendida em `state.from` (o login volta para ela).
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  if (!getToken()) {
    return (
      <Navigate
        to={URL.LOGIN}
        replace
        state={{ from: intendedPath(location) }}
      />
    );
  }

  return <>{children}</>;
};
