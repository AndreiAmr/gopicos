import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { MyReviewsPage, MySpotsPage } from './ActivityPages';

const spots = vi.fn();
const reviews = vi.fn();

vi.mock('@/queries/myActivity/myActivityQueries', () => ({
  useMySpots: () => spots(),
  useMyReviews: () => reviews(),
}));

afterEach(cleanup);

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const spot = {
  id: 's1',
  name: 'Praça',
  modality: 'street',
  coordinates: null,
  images: [],
  ratingAverage: null,
  reviewsCount: 0,
};

describe('Meus picos', () => {
  it('lista os picos com contagem e link para o detalhe', () => {
    spots.mockReturnValue({ spots: [spot], isLoading: false, isError: false, retry: vi.fn() });
    wrap(<MySpotsPage />);

    expect(screen.getByText('1 pico')).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe('/spot/s1');
    expect(screen.getByText('Sem avaliações')).toBeTruthy();
  });

  it('mostra o estado vazio com atalho para cadastrar', () => {
    spots.mockReturnValue({ spots: [], isLoading: false, isError: false, retry: vi.fn() });
    wrap(<MySpotsPage />);

    expect(screen.getByText('Você ainda não cadastrou nenhum pico.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cadastrar pico' })).toBeTruthy();
  });

  it('mostra erro com nova tentativa', () => {
    const retry = vi.fn();
    spots.mockReturnValue({ spots: [], isLoading: false, isError: true, retry });
    wrap(<MySpotsPage />);

    screen.getByRole('button', { name: 'Tentar novamente' }).click();
    expect(retry).toHaveBeenCalled();
  });

  it('mostra skeletons ao carregar', () => {
    spots.mockReturnValue({ spots: [], isLoading: true, isError: false, retry: vi.fn() });
    wrap(<MySpotsPage />);
    expect(screen.getByTestId('my-spots-loading')).toBeTruthy();
  });
});

describe('Minhas avaliações', () => {
  it('lista a avaliação com rótulo composto e comentário', () => {
    reviews.mockReturnValue({
      reviews: [
        {
          id: 'r1',
          rating: 4,
          description: 'Muito bom',
          createdAt: '2026-10-12T15:00:00.000Z',
          spot: { id: 's1', name: 'Praça', modality: 'street' },
        },
      ],
      isLoading: false,
      isError: false,
      retry: vi.fn(),
    });
    wrap(<MyReviewsPage />);

    const link = screen.getByRole('link', {
      name: 'Praça, sua nota 4 de 5, 12/10/2026. Muito bom. Abrir pico.',
    });
    expect(link.getAttribute('href')).toBe('/spot/s1');
    expect(screen.getByText('1 avaliação')).toBeTruthy();
  });

  it('mostra o vazio com "Explorar o mapa"', () => {
    reviews.mockReturnValue({ reviews: [], isLoading: false, isError: false, retry: vi.fn() });
    wrap(<MyReviewsPage />);

    expect(screen.getByText('Você ainda não avaliou nenhum pico.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Explorar o mapa' })).toBeTruthy();
  });
});
