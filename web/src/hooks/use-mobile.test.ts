import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useIsMobile } from './use-mobile';

/**
 * PADRÃO DE TESTE DE HOOK (web)
 * renderHook (@testing-library/react) + mock das APIs do browser (matchMedia);
 * mudanças de estado são disparadas dentro de `act`.
 */
const mockViewport = (width: number) => {
  let onChange: () => void = () => undefined;
  const removeEventListener = vi.fn();

  window.innerWidth = width;
  window.matchMedia = vi.fn().mockImplementation(() => ({
    addEventListener: (_: string, cb: () => void) => {
      onChange = cb;
    },
    removeEventListener,
  }));

  return {
    removeEventListener,
    resize: (next: number) => {
      window.innerWidth = next;
      onChange();
    },
  };
};

describe('useIsMobile', () => {
  afterEach(() => vi.restoreAllMocks());

  it('retorna true em viewport menor que 768px', () => {
    mockViewport(500);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('retorna false em viewport desktop', () => {
    mockViewport(1280);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('reage à mudança de tamanho da janela', () => {
    const viewport = mockViewport(1280);
    const { result } = renderHook(() => useIsMobile());

    act(() => viewport.resize(400));

    expect(result.current).toBe(true);
  });

  it('remove o listener ao desmontar', () => {
    const viewport = mockViewport(1280);
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(viewport.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
