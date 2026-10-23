import { beforeEach, describe, expect, it } from 'vitest';
import { loadViewport, saveViewport } from './mapViewport';

describe('mapViewport', () => {
  beforeEach(() => sessionStorage.clear());

  it('devolve a última posição guardada', () => {
    saveViewport({ longitude: -46.6, latitude: -23.5, zoom: 14 });
    expect(loadViewport()).toEqual({ longitude: -46.6, latitude: -23.5, zoom: 14 });
  });
});
