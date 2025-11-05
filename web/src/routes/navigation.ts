import { URL } from './url';

let navigateFunction: ((path: string) => void) | null = null;

export const setNavigate = (fn: (path: string) => void) => {
  navigateFunction = fn;
};

export const navigate = (path: URL) => {
  if (navigateFunction) navigateFunction(path);
};
