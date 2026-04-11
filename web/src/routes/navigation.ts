import { URL } from './url';

let navigateFunction:
  | ((path: string, options?: { replace?: boolean }) => void)
  | null = null;

export const setNavigate = (
  fn: (path: string, options?: { replace?: boolean }) => void,
) => {
  navigateFunction = fn;
};

export const navigate = (path: URL, options?: { replace?: boolean }) => {
  if (navigateFunction) navigateFunction(path, options);
};
