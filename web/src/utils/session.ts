const SESSION_KEY = 'gopicos.session';

export type Session = {
  token: string;
  /** Expiração do token em segundos desde a época (campo `exp` do JWT). */
  exp: number;
};

/** Lê a sessão persistida; devolve null se ausente, corrompida ou expirada. */
export const getSession = (now: number = Date.now()): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session?.token) return null;
    if (typeof session.exp === 'number' && session.exp * 1000 <= now) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => getSession()?.token ?? null;

export const saveSession = (session: Session): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // armazenamento indisponível (modo privado): a sessão vale só até recarregar
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignorado
  }
};
