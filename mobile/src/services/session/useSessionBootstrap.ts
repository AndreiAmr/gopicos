import { useEffect, useState } from 'react';
import { restoreSession } from './expiration';

export type SessionBootstrap =
  | { status: 'loading' }
  | { status: 'ready'; authenticated: boolean };

/**
 * Decide a tela inicial: com sessão válida no Keychain o app abre direto na
 * Home; sem sessão (ou vencida) abre no Login.
 */
export const useSessionBootstrap = (): SessionBootstrap => {
  const [state, setState] = useState<SessionBootstrap>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    restoreSession()
      .then(session => session !== null)
      .catch(() => false)
      .then(authenticated => {
        if (active) setState({ status: 'ready', authenticated });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
};
