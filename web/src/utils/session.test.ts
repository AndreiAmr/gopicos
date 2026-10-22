import { beforeEach, describe, expect, it } from 'vitest';

import { clearSession, getSession, getToken, saveSession } from './session';

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  });
});

describe('session', () => {
  it('persiste e lê a sessão', () => {
    saveSession({ token: 't', exp: 2_000_000_000 });
    expect(getToken()).toBe('t');
  });

  it('descarta sessão expirada', () => {
    saveSession({ token: 't', exp: 100 });
    expect(getSession(200_000)).toBeNull();
    expect(getToken()).toBeNull();
  });

  it('ignora JSON corrompido e clearSession remove', () => {
    store.set('gopicos.session', '{oops');
    expect(getSession()).toBeNull();
    saveSession({ token: 't', exp: 2_000_000_000 });
    clearSession();
    expect(getToken()).toBeNull();
  });
});
