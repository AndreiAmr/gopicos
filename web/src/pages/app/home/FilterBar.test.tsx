import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { NO_FILTERS } from '@/domain/spot/filters';
import { FilterBar } from './FilterBar';

afterEach(cleanup);

const setup = (filters = NO_FILTERS) => {
  const onApply = vi.fn();
  render(<FilterBar filters={filters} applying={false} onApply={onApply} />);
  return { onApply };
};

describe('FilterBar (web)', () => {
  it('abre o popover, aplica o conjunto escolhido e fecha', () => {
    const { onApply } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    fireEvent.click(screen.getByRole('button', { name: 'Street' }));
    fireEvent.click(screen.getByRole('button', { name: 'Park' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Gratuito' }));
    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('radio', { name: '4+' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    expect(onApply).toHaveBeenCalledWith({
      modalities: ['street', 'park'],
      entry: 'free',
      coveredOnly: true,
      minRating: 4,
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Esc fecha sem aplicar', () => {
    const { onApply } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    fireEvent.click(screen.getByRole('button', { name: 'Street' }));
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('mostra a contagem e remove um filtro pelo chip', () => {
    const { onApply } = setup({
      ...NO_FILTERS,
      modalities: ['street'],
      coveredOnly: true,
    });

    expect(screen.getByRole('button', { name: 'Filtros (2)' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Coberto' }));
    expect(onApply).toHaveBeenCalledWith({
      ...NO_FILTERS,
      modalities: ['street'],
    });
  });

  it('"Limpar filtros" zera o rascunho', () => {
    const { onApply } = setup({ ...NO_FILTERS, entry: 'paid' });

    fireEvent.click(screen.getByRole('button', { name: 'Filtros (1)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    expect(onApply).toHaveBeenCalledWith(NO_FILTERS);
  });
});
