import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

import { useReviewsFlow } from './useReviewsFlow';

const reload = vi.fn();
const createReview = vi.fn();
const success = vi.fn();
const info = vi.fn();
const logout = vi.fn();

vi.mock('@/queries/spotReviews/useSpotReviews', () => ({
  useSpotReviews: () => ({ reload, loadMore: vi.fn() }),
}));
vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useMutation: () => [createReview, { loading: false }],
}));
vi.mock('@/lib/notify', () => ({
  notify: { success: (m: string) => success(m), info: (m: string) => info(m) },
}));
vi.mock('@/utils/logout', () => ({ logout: (s: unknown) => logout(s) }));

const refreshSpot = vi.fn();
const apiError = (type: string, message = 'x') =>
  new ApolloError({
    graphQLErrors: [new GraphQLError(message, { extensions: { type } })],
  });

const setup = () =>
  renderHook(() => useReviewsFlow({ spotId: 's1', refreshSpot }));

beforeEach(() => vi.clearAllMocks());

describe('useReviewsFlow.submit (web)', () => {
  it('sucesso: fecha, avisa e atualiza lista e detalhe', async () => {
    createReview.mockResolvedValue({});
    const { result } = setup();
    act(() => result.current.openForm());
    expect(result.current.open).toBe(true);

    await act(async () => result.current.submit(5, 'Top'));

    expect(createReview).toHaveBeenCalledWith({
      variables: { data: { spotId: 's1', rating: 5, description: 'Top' } },
    });
    expect(result.current.open).toBe(false);
    expect(success).toHaveBeenCalledWith('Avaliação enviada!');
    expect(reload).toHaveBeenCalledWith(true);
    expect(refreshSpot).toHaveBeenCalled();
  });

  it('REVIEW_ALREADY_EXISTS: fecha, avisa e mostra a existente', async () => {
    createReview.mockRejectedValue(apiError('REVIEW_ALREADY_EXISTS'));
    const { result } = setup();

    await act(async () => result.current.submit(5, ''));

    expect(info).toHaveBeenCalledWith('Você já avaliou este pico. Edite sua avaliação.');
    expect(reload).toHaveBeenCalledWith(true);
  });

  it('VALIDATION_ERROR junto ao comentário; rede vira banner; sessão expira', async () => {
    const { result } = setup();

    createReview.mockRejectedValueOnce(apiError('VALIDATION_ERROR', 'Longo demais.'));
    await act(async () => result.current.submit(5, 'x'));
    expect(result.current.commentError).toBe('Longo demais.');

    createReview.mockRejectedValueOnce(new Error('rede'));
    await act(async () => result.current.submit(5, 'x'));
    expect(result.current.error).toBe(
      'Não foi possível enviar sua avaliação. Tente novamente.',
    );
    expect(reload).not.toHaveBeenCalled();

    createReview.mockRejectedValueOnce(apiError('UNAUTHENTICATED'));
    await act(async () => result.current.submit(5, 'x'));
    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});
