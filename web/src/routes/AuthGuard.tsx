import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { getCookie } from '@/utils/cookies';
import { URL } from './url';

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const token = getCookie('token');

  if (!token) {
    return <Navigate to={URL.LOGIN} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
