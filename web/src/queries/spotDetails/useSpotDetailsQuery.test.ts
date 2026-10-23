import { describe, expect, it } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

import { classifyStatus } from './useSpotDetailsQuery';

const apiError = (type: string) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError('x', { extensions: { type } })],
  });

describe('classifyStatus', () => {
  it('classifica os estados da tela', () => {
    expect(classifyStatus({ hasSpot: true, loading: false, error: null })).toBe('ready');
    expect(classifyStatus({ hasSpot: false, loading: true, error: null })).toBe('loading');
    expect(classifyStatus({ hasSpot: false, loading: false, error: null })).toBe('notFound');
    expect(
      classifyStatus({ hasSpot: false, loading: false, error: apiError('NOT_FOUND') }),
    ).toBe('notFound');
    expect(
      classifyStatus({ hasSpot: false, loading: false, error: apiError('UNAUTHENTICATED') }),
    ).toBe('unauthenticated');
    expect(
      classifyStatus({
        hasSpot: false,
        loading: false,
        error: new ApolloError({ networkError: new Error('offline') }),
      }),
    ).toBe('error');
  });

  it('mantém os dados já carregados quando uma atualização falha na rede', () => {
    expect(
      classifyStatus({
        hasSpot: true,
        loading: false,
        error: new ApolloError({ networkError: new Error('offline') }),
      }),
    ).toBe('ready');
  });
});
