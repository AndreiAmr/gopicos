import { call, put } from 'redux-saga/effects';
import { runSagaIsolated } from './runSaga';

/**
 * PADRÃO DE TESTE DE SAGA (mobile)
 *
 * Em uma feature real, importe a saga de `store/<domínio>/<feature>/` e mocke
 * o repository (`jest.mock('./<feature>Repository')`). Aqui a saga é definida
 * inline apenas para servir de modelo: carrega -> sucesso | erro -> finaliza.
 */
type Spot = { id: string; name: string };

const repository = { getSpots: jest.fn<Promise<Spot[]>, [string]>() };

const actions = {
  setLoading: (isLoading: boolean) => ({
    type: 'SET_LOADING',
    payload: { isLoading },
  }),
  setError: (isError: boolean) => ({
    type: 'SET_ERROR',
    payload: { isError },
  }),
  setSpots: (spots: Spot[]) => ({ type: 'SET_SPOTS', payload: { spots } }),
};

function* getSpotsAsync(search: string) {
  try {
    yield put(actions.setLoading(true));
    yield put(actions.setError(false));
    const spots: Spot[] = yield call(repository.getSpots, search);
    yield put(actions.setSpots(spots));
  } catch {
    yield put(actions.setError(true));
  } finally {
    yield put(actions.setLoading(false));
  }
}

describe('getSpotsAsync (exemplo de saga)', () => {
  beforeEach(() => jest.resetAllMocks());

  it('passo a passo: o generator emite os effects esperados', () => {
    const gen = getSpotsAsync('skate');

    expect(gen.next().value).toEqual(put(actions.setLoading(true)));
    expect(gen.next().value).toEqual(put(actions.setError(false)));
    expect(gen.next().value).toEqual(call(repository.getSpots, 'skate'));
  });

  it('despacha loading, dados e finaliza o loading em caso de sucesso', async () => {
    const spots = [{ id: '1', name: 'Praça' }];
    repository.getSpots.mockResolvedValue(spots);

    const dispatched = await runSagaIsolated(getSpotsAsync, ['skate']);

    expect(repository.getSpots).toHaveBeenCalledWith('skate');
    expect(dispatched).toEqual([
      actions.setLoading(true),
      actions.setError(false),
      actions.setSpots(spots),
      actions.setLoading(false),
    ]);
  });

  it('marca erro e finaliza o loading quando o repository falha', async () => {
    repository.getSpots.mockRejectedValue(new Error('falha de rede'));

    const dispatched = await runSagaIsolated(getSpotsAsync, ['skate']);

    expect(dispatched).toEqual([
      actions.setLoading(true),
      actions.setError(false),
      actions.setError(true),
      actions.setLoading(false),
    ]);
  });
});
