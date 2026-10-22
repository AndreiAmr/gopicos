import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';

import { loginMutation } from './loginMutation';
import { useLoginMutation } from './useLoginMutation';

/**
 * PADRÃO DE TESTE DE HOOK (mobile)
 * renderHook (@testing-library/react-native) + MockedProvider do Apollo.
 */
const variables = { props: { email: 'a@a.com', password: '123456' } };

const user = {
  token: 'jwt',
  exp: 1,
  createdAt: 1,
  name: 'Skatista',
  email: 'a@a.com',
  id: 'u1',
};

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const renderLogin = async (mocks: Mocks) =>
  await renderHook(() => useLoginMutation(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

describe('useLoginMutation', () => {
  it('começa ocioso, sem dados nem erro', async () => {
    const { result } = await renderLogin([]);

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('expõe os dados do usuário após login com sucesso', async () => {
    const { result } = await renderLogin([
      {
        request: { query: loginMutation, variables },
        result: { data: { login: user } },
      },
    ]);

    await act(async () => {
      await result.current.mutate({ variables });
    });

    await waitFor(() => expect(result.current.data).toEqual(user));
    expect(result.current.error).toBeNull();
  });
});
