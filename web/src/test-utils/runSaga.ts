import { runSaga, type Saga } from 'redux-saga';

type Action = { type: string; payload?: unknown };

/**
 * Executa uma saga isolada (sem store) e devolve as actions despachadas.
 * `state` é o que `select` enxergará dentro da saga.
 */
export const runSagaIsolated = async <A extends unknown[]>(
  saga: Saga<A>,
  args: A,
  state: unknown = {}
) => {
  const dispatched: Action[] = [];

  await runSaga(
    {
      dispatch: (action: Action) => dispatched.push(action),
      getState: () => state,
    },
    saga,
    ...args
  ).toPromise();

  return dispatched;
};
