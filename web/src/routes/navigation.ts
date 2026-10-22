import { URL } from './url';

export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type NavigateFn = (path: string, options?: NavigateOptions) => void;

let navigateFunction: NavigateFn | null = null;

export const setNavigate = (fn: NavigateFn) => {
  navigateFunction = fn;
};

export const navigate = (path: URL | string, options?: NavigateOptions) => {
  if (navigateFunction) navigateFunction(path, options);
};

/**
 * Aceita só caminhos internos (começam com uma única "/"), para evitar
 * redirecionamento aberto via rota pretendida.
 */
export const sanitizeRedirect = (path?: string | null): string | null => {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  if (path.includes('\\')) return null;
  return path;
};
