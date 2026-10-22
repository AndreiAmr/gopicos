import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('mantem tamanho tipografico do DS e cor de texto juntos', () => {
    expect(cn('text-h1', 'text-gp-text-muted')).toBe('text-h1 text-gp-text-muted');
    expect(cn('text-body-sm font-semibold', 'text-gp-error')).toBe(
      'text-body-sm font-semibold text-gp-error',
    );
    expect(cn('text-caption', 'text-gp-text-subtle')).toBe(
      'text-caption text-gp-text-subtle',
    );
  });

  it('ainda resolve conflito entre dois tamanhos', () => {
    expect(cn('text-h1', 'text-h2')).toBe('text-h2');
    expect(cn('text-sm', 'text-body')).toBe('text-body');
  });

  it('ainda resolve conflito entre duas cores', () => {
    expect(cn('text-gp-text', 'text-gp-error')).toBe('text-gp-error');
  });
});
