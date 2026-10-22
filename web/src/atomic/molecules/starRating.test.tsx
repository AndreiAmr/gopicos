import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { StarRating } from './starRating';
import {
  clampRating,
  formatAverage,
  nextRating,
  starLabel,
  summaryText,
} from './starRating.utils';

afterEach(cleanup);

describe('starRating.utils', () => {
  it('formata media em pt-BR com 1 casa', () => {
    expect(formatAverage(4.3)).toBe('4,3');
    expect(formatAverage(4)).toBe('4,0');
    expect(summaryText(4.3, 12)).toBe('4,3 (12)');
  });

  it('gera o rotulo "N de 5 estrelas"', () => {
    expect(starLabel(1)).toBe('1 de 5 estrelas');
    expect(starLabel(3)).toBe('3 de 5 estrelas');
  });

  it('limita o valor entre 0 e 5', () => {
    expect(clampRating(9)).toBe(5);
    expect(clampRating(-2)).toBe(0);
  });

  it('calcula a proxima nota pelo teclado', () => {
    expect(nextRating(3, 'ArrowRight')).toBe(4);
    expect(nextRating(5, 'ArrowRight')).toBe(5);
    expect(nextRating(3, 'ArrowLeft')).toBe(2);
    expect(nextRating(1, 'ArrowDown')).toBe(1);
    expect(nextRating(3, 'Home')).toBe(1);
    expect(nextRating(3, 'End')).toBe(5);
    expect(nextRating(3, 'a')).toBeNull();
  });
});

describe('StarRating (entrada)', () => {
  it('expoe radiogroup acessivel com 5 radios', () => {
    render(<StarRating value={0} onChange={() => {}} />);

    expect(
      screen.getByRole('radiogroup', { name: 'Nota de 1 a 5 estrelas' }),
    ).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('radio', { name: '3 de 5 estrelas' })).toBeTruthy();
  });

  it('seleciona a nota ao clicar', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: '4 de 5 estrelas' }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('marca apenas a nota atual como aria-checked', () => {
    render(<StarRating value={3} onChange={() => {}} />);

    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual([
      'false',
      'false',
      'true',
      'false',
      'false',
    ]);
  });

  it('usa roving tabindex: so a estrela atual entra na ordem de foco', () => {
    render(<StarRating value={3} onChange={() => {}} />);

    const tabIndexes = screen
      .getAllByRole('radio')
      .map((r) => r.getAttribute('tabindex'));
    expect(tabIndexes).toEqual(['-1', '-1', '0', '-1', '-1']);
  });

  it('sem nota, a primeira estrela e a focavel', () => {
    render(<StarRating value={0} onChange={() => {}} />);

    expect(screen.getAllByRole('radio')[0].getAttribute('tabindex')).toBe('0');
  });

  it('navega e seleciona com as setas, Home e End', () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} />);
    const radio = screen.getByRole('radio', { name: '3 de 5 estrelas' });

    fireEvent.keyDown(radio, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(4);

    fireEvent.keyDown(radio, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith(2);

    fireEvent.keyDown(radio, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.keyDown(radio, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it('ignora teclas nao relacionadas', () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole('radio', { name: '3 de 5 estrelas' }), {
      key: 'x',
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('desabilitado nao dispara onChange', () => {
    const onChange = vi.fn();
    render(<StarRating value={2} onChange={onChange} disabled />);

    const radio = screen.getByRole('radio', { name: '4 de 5 estrelas' });
    fireEvent.click(radio);
    fireEvent.keyDown(radio, { key: 'ArrowRight' });

    expect((radio as HTMLButtonElement).disabled).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('mostra erro e liga ao grupo por aria-describedby', () => {
    render(
      <StarRating value={0} onChange={() => {}} error="Escolha uma nota" />,
    );

    const group = screen.getByRole('radiogroup');
    const message = screen.getByText('Escolha uma nota');
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe(message.id);
  });

  it('em loading mostra skeleton e nao os radios', () => {
    render(<StarRating value={0} onChange={() => {}} isLoading />);

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });
});

describe('StarRating (leitura)', () => {
  it('mostra media e contagem e descreve para leitores de tela', () => {
    render(<StarRating mode="read" value={4.3} count={12} />);

    expect(screen.getByText('4,3 (12)')).toBeTruthy();
    expect(
      screen.getByRole('img', { name: 'Nota 4,3 de 5, 12 avaliações' }),
    ).toBeTruthy();
  });

  it('nao e interativo', () => {
    render(<StarRating mode="read" value={4} />);

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });
});
