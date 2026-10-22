import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { call, put } from 'redux-saga/effects';

import { runSagaIsolated } from '@/test-utils/runSaga';

import { searchPlaceActions } from './searchPlaceActions';
import { searchPlaceRepository } from './searchPlaceRepository';
import { getSearchPlaceAsync } from './searchPlaceSagas';
import type { ISearchPlace } from './searchPlaceTypes';

/**
 * PADRÃO DE TESTE DE SAGA (web)
 * - mocke o repository (a fronteira com a API), nunca o Apollo diretamente;
 * - teste o passo a passo dos effects (generator) e o fluxo completo com
 *   `runSagaIsolated`, conferindo as actions despachadas.
 */
vi.mock('./searchPlaceRepository', () => ({
  searchPlaceRepository: { getSearchPlace: vi.fn() },
}));

const places = [{ name: 'Praça da Sé', lat: -23.55, lng: -46.63 }] as ISearchPlace[];
const getSearchPlace = vi.mocked(searchPlaceRepository.getSearchPlace);

describe('getSearchPlaceAsync', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it('passo a passo: o generator emite os effects esperados', () => {
    const gen = getSearchPlaceAsync(searchPlaceActions.getSearchPlaceAsync('sé'));

    expect(gen.next().value).toEqual(
      put(searchPlaceActions.setIsLoadingSearchPlace(true))
    );
    expect(gen.next().value).toEqual(
      put(searchPlaceActions.setIsErrorSearchPlace(false))
    );
    expect(gen.next().value).toEqual(call(getSearchPlace, 'sé'));
  });

  it('despacha loading, resultado e finaliza o loading em caso de sucesso', async () => {
    getSearchPlace.mockResolvedValue(places);

    const dispatched = await runSagaIsolated(getSearchPlaceAsync, [
      searchPlaceActions.getSearchPlaceAsync('sé'),
    ]);

    expect(getSearchPlace).toHaveBeenCalledWith('sé');
    expect(dispatched).toEqual([
      searchPlaceActions.setIsLoadingSearchPlace(true),
      searchPlaceActions.setIsErrorSearchPlace(false),
      searchPlaceActions.setSearchPlace(places),
      searchPlaceActions.setIsLoadingSearchPlace(false),
    ]);
  });

  it('marca erro e finaliza o loading quando o repository falha', async () => {
    getSearchPlace.mockRejectedValue(new Error('falha de rede'));

    const dispatched = await runSagaIsolated(getSearchPlaceAsync, [
      searchPlaceActions.getSearchPlaceAsync('sé'),
    ]);

    expect(dispatched).toEqual([
      searchPlaceActions.setIsLoadingSearchPlace(true),
      searchPlaceActions.setIsErrorSearchPlace(false),
      searchPlaceActions.setIsErrorSearchPlace(true),
      searchPlaceActions.setIsLoadingSearchPlace(false),
    ]);
  });

  it('não chama a API quando o termo de busca está vazio', async () => {
    const dispatched = await runSagaIsolated(getSearchPlaceAsync, [
      searchPlaceActions.getSearchPlaceAsync(''),
    ]);

    expect(getSearchPlace).not.toHaveBeenCalled();
    expect(dispatched).toEqual([searchPlaceActions.setIsLoadingSearchPlace(false)]);
  });
});
