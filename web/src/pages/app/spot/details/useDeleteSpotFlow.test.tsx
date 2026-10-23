import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

import { useDeleteSpotFlow } from './useDeleteSpotFlow';

const deleteSpot = vi.fn();
const navigate = vi.fn();
const refetchQueries = vi.fn(() => Promise.resolve());
const evict = vi.fn();
const success = vi.fn();
const info = vi.fn();
const error = vi.fn();
const logout = vi.fn();

vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useMutation: () => [deleteSpot, { loading: false }],
  useApolloClient: () => ({ refetchQueries, cache: { evict, gc: vi.fn() } }),
}));
vi.mock('react-router', () => ({ useNavigate: () => navigate }));
vi.mock('@/lib/notify', () => ({
  notify: {
    success: (m: string) => success(m),
    info: (m: string) => info(m),
    error: (m: string) => error(m),
  },
}));
vi.mock('@/utils/logout', () => ({ logout: (s: unknown) => logout(s) }));

const apiError = (type: string) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError('x', { extensions: { type } })],
  });

const setup = () => {
  const hook = renderHook(() => useDeleteSpotFlow('s1'));
  act(() => hook.result.current.openConfirm());
  return hook;
};

beforeEach(() => vi.clearAllMocks());

describe('useDeleteSpotFlow (web)', () => {
  it('abrir só pede confirmação', () => {
    const { result } = setup();
    expect(result.current.open).toBe(true);
    expect(deleteSpot).not.toHaveBeenCalled();
  });

  it('sucesso: exclui, avisa e volta à Home sem histórico', async () => {
    deleteSpot.mockResolvedValue({});
    const { result } = setup();

    await act(async () => result.current.confirm());

    expect(deleteSpot).toHaveBeenCalledWith({ variables: { id: 's1' } });
    expect(success).toHaveBeenCalledWith('Pico excluído.');
    expect(navigate).toHaveBeenCalledWith('/home', { replace: true });
    expect(evict).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });

  it('erro de rede: banner e dialog aberto', async () => {
    deleteSpot.mockRejectedValue(new Error('rede'));
    const { result } = setup();

    await act(async () => result.current.confirm());

    expect(result.current.error).toBe('Não foi possível excluir. Tente novamente.');
    expect(result.current.open).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('NOT_FOUND: vai à Home com aviso', async () => {
    deleteSpot.mockRejectedValue(apiError('NOT_FOUND'));
    const { result } = setup();

    await act(async () => result.current.confirm());

    expect(info).toHaveBeenCalledWith('Este pico já não existe.');
    expect(navigate).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('FORBIDDEN: fecha com erro e fica no detalhe', async () => {
    deleteSpot.mockRejectedValue(apiError('FORBIDDEN'));
    const { result } = setup();

    await act(async () => result.current.confirm());

    expect(error).toHaveBeenCalledWith('Só quem criou o pico pode excluí-lo.');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('UNAUTHENTICATED: sessão expirada', async () => {
    deleteSpot.mockRejectedValue(apiError('UNAUTHENTICATED'));
    const { result } = setup();

    await act(async () => result.current.confirm());

    expect(logout).toHaveBeenCalledWith({ sessionExpired: true });
  });
});
