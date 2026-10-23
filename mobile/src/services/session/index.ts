import * as Keychain from 'react-native-keychain';

const SERVICE = 'gopicos.session';

export type Session = {
  token: string;
  /** Expiração do token em segundos desde a época (campo `exp` do JWT). */
  exp: number;
  id: string;
  name: string;
  email: string;
};

/** Grava a sessão no Keychain (iOS) / Keystore (Android). */
export const saveSession = async (session: Session): Promise<void> => {
  const saved = await Keychain.setGenericPassword(
    session.id,
    JSON.stringify(session),
    { service: SERVICE },
  );

  if (!saved) {
    throw new Error('Não foi possível gravar a sessão no Keychain');
  }
};

export const getSession = async (): Promise<Session | null> => {
  const credentials = await Keychain.getGenericPassword({ service: SERVICE });

  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as Session;
  } catch {
    return null;
  }
};

export const getToken = async (): Promise<string | null> =>
  (await getSession())?.token ?? null;

export const clearSession = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: SERVICE });
};
