import { URL } from './url';

export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

let navigateFunction:
  | ((path: string, options?: NavigateOptions) => void)
  | null = null;

export const setNavigate = (
  fn: (path: string, options?: NavigateOptions) => void
) => {
  navigateFunction = fn;
};

export const navigate = (path: URL, options?: NavigateOptions) => {
  if (navigateFunction) navigateFunction(path, options);
};
