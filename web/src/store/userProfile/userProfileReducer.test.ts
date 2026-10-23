import { describe, expect, it } from 'vitest';

import { userProfileActions } from './userProfileActions';
import userProfileReducer, { USER_PROFILE_INITIAL_STATE } from './userProfileReducer';

const me = {
  id: '1',
  name: 'Ana Lima',
  firstName: 'Ana',
  lastName: 'Lima',
  email: 'a@b.com',
  createdAt: '2026-10-22T00:00:00.000Z',
  spotsCount: 0,
  reviewsCount: 0,
};

describe('userProfileReducer', () => {
  it('guarda o perfil, o loading e os erros', () => {
    let state = userProfileReducer(undefined, userProfileActions.setMe(me));
    state = userProfileReducer(state, userProfileActions.setIsLoadingMe(true));
    state = userProfileReducer(state, userProfileActions.setErrorMe('server'));
    state = userProfileReducer(state, userProfileActions.setIsLoadingUpdate(true));
    state = userProfileReducer(
      state,
      userProfileActions.setErrorUpdate({ kind: 'banner', message: 'x' }),
    );

    expect(state.me).toEqual({ data: me, isLoading: true, error: 'server' });
    expect(state.update).toEqual({
      isLoading: true,
      error: { kind: 'banner', message: 'x' },
    });
  });

  it('ignora actions desconhecidas', () => {
    expect(
      userProfileReducer(USER_PROFILE_INITIAL_STATE, { type: 'x' } as never),
    ).toBe(USER_PROFILE_INITIAL_STATE);
  });
});
