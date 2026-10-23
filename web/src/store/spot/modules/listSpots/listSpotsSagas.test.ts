import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runSagaIsolated } from '@/test-utils/runSaga';

import { listSpotsActions } from './listSpotsActions';
import { listSpotsRepository } from './listSpotsRepository';
import { getListSpotsAsync } from './listSpotsSagas';
import type { IListSpots } from './listSpotsTypes';

vi.mock('./listSpotsRepository', () => ({
  listSpotsRepository: { getListSpots: vi.fn() },
}));

const getListSpots = vi.mocked(listSpotsRepository.getListSpots);
const spots = [{ id: '1', name: 'Praça' }] as unknown as IListSpots;

describe('getListSpotsAsync', () => {
  beforeEach(() => vi.resetAllMocks());

  it('busca sem filtro e guarda o resultado', async () => {
    getListSpots.mockResolvedValue(spots);

    const dispatched = await runSagaIsolated(getListSpotsAsync, [
      listSpotsActions.getListSpotsAsync(),
    ]);

    expect(getListSpots).toHaveBeenCalledWith(null);
    expect(dispatched).toContainEqual(listSpotsActions.setListSpots(spots));
    expect(dispatched).toContainEqual(listSpotsActions.setIsErrorListSpots(false));
  });

  it('repassa o filtro ao repository', async () => {
    getListSpots.mockResolvedValue(spots);

    await runSagaIsolated(getListSpotsAsync, [
      listSpotsActions.getListSpotsAsync({ isPaid: false, minRating: 4 }),
    ]);

    expect(getListSpots).toHaveBeenCalledWith({ isPaid: false, minRating: 4 });
  });

  it('falha marca erro, mantém os dados anteriores e encerra o loading', async () => {
    getListSpots.mockRejectedValue(new Error('rede'));

    const dispatched = await runSagaIsolated(getListSpotsAsync, [
      listSpotsActions.getListSpotsAsync(),
    ]);

    expect(dispatched).toContainEqual(listSpotsActions.setIsErrorListSpots(true));
    expect(dispatched.map((a) => a.type)).not.toContain(
      listSpotsActions.setListSpots(spots).type,
    );
    expect(dispatched.at(-1)).toEqual(listSpotsActions.setIsLoadingListSpots(false));
  });
});
