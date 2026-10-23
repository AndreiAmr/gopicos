import { describe, expect, it } from 'vitest';

import { sanitizeRedirect } from './navigation';

describe('sanitizeRedirect', () => {
  it('aceita caminhos internos', () => {
    expect(sanitizeRedirect('/spot/1?x=2')).toBe('/spot/1?x=2');
  });

  it.each([undefined, null, '', 'home', '//evil.com', 'https://evil.com', '/\\evil.com'])(
    'rejeita %s',
    (value) => {
      expect(sanitizeRedirect(value as string | null | undefined)).toBeNull();
    }
  );
});
