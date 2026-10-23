import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import type { Review } from '@/domain/spot/reviews';
import { ReviewDialog } from './ReviewDialog';
import { ReviewsSection } from './ReviewsSection';

afterEach(cleanup);

const review = (id: string, over: Partial<Review> = {}): Review => ({
  id,
  rating: 4,
  description: 'Chão liso',
  createdAt: new Date().toISOString(),
  author: { id: 'u', displayName: 'Marina S.' },
  isMine: false,
  ...over,
});

const baseProps = {
  status: 'ready' as const,
  items: [] as Review[],
  myReview: null,
  totalCount: 0,
  ratingAverage: null,
  isOwner: false,
  hasMore: false,
  loadingMore: false,
  moreError: false,
  lastLoaded: null,
  onRetry: vi.fn(),
  onLoadMore: vi.fn(),
};

describe('ReviewsSection (web)', () => {
  it('mostra skeleton, vazio, vazio do autor e erro', () => {
    const { rerender } = render(<ReviewsSection {...baseProps} status="loading" />);
    expect(screen.getByTestId('reviews-loading')).toBeTruthy();

    rerender(<ReviewsSection {...baseProps} />);
    expect(screen.getByText('Seja o primeiro a avaliar')).toBeTruthy();

    rerender(<ReviewsSection {...baseProps} isOwner />);
    expect(screen.getByText('Ainda sem avaliações.')).toBeTruthy();

    const onRetry = vi.fn();
    rerender(<ReviewsSection {...baseProps} status="error" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('mostra resumo, minha avaliação no topo e usuário desativado', () => {
    render(
      <ReviewsSection
        {...baseProps}
        totalCount={3}
        ratingAverage={4.5}
        myReview={review('m', { isMine: true, description: 'Meu texto' })}
        items={[review('a'), review('b', { author: null, description: null })]}
      />,
    );

    expect(screen.getByText('4,5')).toBeTruthy();
    expect(screen.getByText('3 avaliações')).toBeTruthy();
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items[0].getAttribute('data-testid')).toBe('my-review');
    expect(screen.getByText('Sua avaliação')).toBeTruthy();
    expect(screen.getByText('Usuário Desativado')).toBeTruthy();
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('"Carregar mais" aparece com mais páginas, foca o primeiro item novo e anuncia', () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <ReviewsSection
        {...baseProps}
        totalCount={3}
        ratingAverage={4}
        items={[review('a')]}
        hasMore
        onLoadMore={onLoadMore}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Carregar mais' }));
    expect(onLoadMore).toHaveBeenCalled();

    rerender(
      <ReviewsSection
        {...baseProps}
        totalCount={3}
        ratingAverage={4}
        items={[review('a'), review('b'), review('c')]}
        lastLoaded={{ firstId: 'b', count: 2 }}
        onLoadMore={onLoadMore}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Carregar mais' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('2 avaliações carregadas');
    expect(document.activeElement?.getAttribute('data-testid')).toBe('review-item');
    expect(document.activeElement?.getAttribute('aria-label')).toContain('Marina S.');
  });

  it('erro ao carregar mais permite tentar de novo', () => {
    const onLoadMore = vi.fn();
    render(
      <ReviewsSection
        {...baseProps}
        totalCount={2}
        ratingAverage={4}
        items={[review('a')]}
        hasMore
        moreError
        onLoadMore={onLoadMore}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onLoadMore).toHaveBeenCalled();
  });
});

describe('ReviewDialog (web)', () => {
  const setup = (props: Partial<React.ComponentProps<typeof ReviewDialog>> = {}) => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <ReviewDialog
        open
        submitting={false}
        onSubmit={onSubmit}
        onClose={onClose}
        {...props}
      />,
    );
    return { onSubmit, onClose };
  };

  it('"Enviar avaliação" fica desabilitado sem estrelas e mostra a dica', () => {
    setup();
    expect(screen.getByText('Escolha de 1 a 5 estrelas')).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: 'Enviar avaliação' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('envia nota e comentário aparado', () => {
    const { onSubmit } = setup();

    fireEvent.click(screen.getByRole('radio', { name: '4 de 5 estrelas' }));
    expect(screen.getByText('Muito bom')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Comentário (opcional)'), {
      target: { value: '  Ótimo pico  ' },
    });
    expect(screen.getByText('14/500')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar avaliação' }));

    expect(onSubmit).toHaveBeenCalledWith(4, 'Ótimo pico');
  });

  it('comentário acima de 500 caracteres bloqueia o envio', () => {
    setup();
    fireEvent.click(screen.getByRole('radio', { name: '5 de 5 estrelas' }));
    fireEvent.change(screen.getByLabelText('Comentário (opcional)'), {
      target: { value: 'a'.repeat(501) },
    });
    expect(
      (screen.getByRole('button', { name: 'Enviar avaliação' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('cancelar sem rascunho fecha; com rascunho pede confirmação', () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('radio', { name: '3 de 5 estrelas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Descartar sua avaliação?')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Descartar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('mostra o erro de rede preservando a nota e o texto', () => {
    setup({ error: 'Não foi possível enviar sua avaliação. Tente novamente.' });
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível enviar');
  });

  it('modo edição usa o título "Editar sua avaliação" e os valores atuais', () => {
    const { onSubmit } = setup({ initial: { rating: 3, description: 'Ok' } });

    expect(screen.getByText('Editar sua avaliação')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onSubmit).toHaveBeenCalledWith(3, 'Ok');
  });
});
