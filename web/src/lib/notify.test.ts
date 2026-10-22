import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';
import { TOAST_DURATION_MS, durationFor, notify } from './notify';

describe('notify (toast do DS)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa 4 s como duracao padrao', () => {
    notify.success('Pico salvo');

    expect(toast.success).toHaveBeenCalledWith('Pico salvo', {
      description: undefined,
      action: undefined,
      duration: TOAST_DURATION_MS,
    });
    expect(TOAST_DURATION_MS).toBe(4000);
  });

  it('dispara o tipo correspondente (info, warning, error)', () => {
    notify.info('a');
    notify.warning('b');
    notify.error('c');

    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.warning).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('erro sem acao some em 4 s', () => {
    expect(durationFor('error')).toBe(4000);
  });

  it('erro que exige acao nao some sozinho', () => {
    const onClick = vi.fn();
    notify.error('Falha ao salvar', {
      action: { label: 'Tentar novamente', onClick },
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Falha ao salvar',
      expect.objectContaining({ duration: Infinity }),
    );
  });

  it('acao nao altera a duracao de tipos que nao sao erro', () => {
    const action = { label: 'Desfazer', onClick: vi.fn() };

    expect(durationFor('success', { action })).toBe(4000);
    expect(durationFor('warning', { action })).toBe(4000);
  });
});
