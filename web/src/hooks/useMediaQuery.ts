import { useEffect, useState } from 'react';

/** Acompanha uma media query (ex.: `(min-width: 1024px)`). */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window === 'undefined' || !window.matchMedia
      ? false
      : window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

/** Verdadeiro quando a pessoa pediu para reduzir movimento. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
