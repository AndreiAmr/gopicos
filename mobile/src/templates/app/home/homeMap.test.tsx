import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MAP_LAYER_STORAGE_KEY,
  loadMapLayer,
  saveMapLayer,
} from '../../../services/storage/mapLayer';
import { useMapLayer } from './useMapLayer';
import { columnFits, toastZone } from './layout';

describe('persistência da camada (decisão do dono P4)', () => {
  beforeEach(() => AsyncStorage.clear());

  it('salva e lê a camada no aparelho; sem valor, Rua', async () => {
    expect(await loadMapLayer()).toBe('street');
    await saveMapLayer('satellite');
    expect(await AsyncStorage.getItem(MAP_LAYER_STORAGE_KEY)).toBe('satellite');
    expect(await loadMapLayer()).toBe('satellite');
  });

  it('useMapLayer começa com a salva, troca na hora e persiste', async () => {
    await saveMapLayer('concrete');
    const onError = jest.fn();
    const { result } = await renderHook(() => useMapLayer({ onError }));

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.layer).toBe('concrete');

    // Rua <-> Concreto é só config do Standard: não fica "trocando".
    await act(async () => result.current.setLayer('street'));
    expect(result.current.layer).toBe('street');
    expect(result.current.switching).toBe(false);
    await waitFor(async () => expect(await loadMapLayer()).toBe('street'));

    // Satélite muda o estilo: fica "trocando" até carregar.
    await act(async () => result.current.setLayer('satellite'));
    expect(result.current.switching).toBe(true);
    await act(async () => result.current.onStyleLoaded());
    expect(result.current.switching).toBe(false);
  });

  it('falha ao carregar o satélite volta para a anterior e avisa', async () => {
    const onError = jest.fn();
    const { result } = await renderHook(() => useMapLayer({ onError }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    await act(async () => result.current.setLayer('satellite'));
    await act(async () => result.current.onStyleError());

    expect(result.current.layer).toBe('street');
    expect(onError).toHaveBeenCalledWith('Não foi possível carregar o mapa de satélite.');
    await waitFor(async () => expect(await loadMapLayer()).toBe('street'));
  });
});

describe('zonas reservadas (spec home.md 4)', () => {
  it('a coluna some quando não cabe entre o topo e o sheet', () => {
    // iPhone SE: topo termina em 132; tab bar em 603 (referencial do mapa).
    expect(columnFits(132, 603)).toBe(true);
    // Com resumo (peek 188): base 415 -> coluna 295 a 399, cabe.
    expect(columnFits(184, 415)).toBe(true);
    // Sheet expandido: não cabe.
    expect(columnFits(184, 250)).toBe(false);
  });

  it('toast embaixo à esquerda da coluna; vai para o topo com sheet modal ou sem espaço', () => {
    expect(
      toastZone({ tabBarHeight: 64, overlap: 0, mapHeight: 603, z1Bottom: 132, modalOpen: false }),
    ).toEqual({ position: 'bottom', bottom: 64 + 36, left: 16, right: 72 });
    expect(
      toastZone({ tabBarHeight: 64, overlap: 0, mapHeight: 603, z1Bottom: 132, modalOpen: true }),
    ).toEqual({ position: 'top' });
    expect(
      toastZone({ tabBarHeight: 64, overlap: 400, mapHeight: 603, z1Bottom: 132, modalOpen: false }),
    ).toEqual({ position: 'top' });
  });
});
