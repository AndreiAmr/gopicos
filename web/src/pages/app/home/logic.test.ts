import { describe, expect, it } from 'vitest';
import { announceSpot, cycleSpot, pickClickTarget } from './logic';

describe('home/logic', () => {
  const ids = ['a', 'b', 'c'];

  it('percorre os picos de forma circular', () => {
    expect(cycleSpot(ids, null, 1)).toEqual({ id: 'a', position: 1 });
    expect(cycleSpot(ids, null, -1)).toEqual({ id: 'c', position: 3 });
    expect(cycleSpot(ids, 'a', 1)).toEqual({ id: 'b', position: 2 });
    expect(cycleSpot(ids, 'c', 1)).toEqual({ id: 'a', position: 1 });
    expect(cycleSpot(ids, 'a', -1)).toEqual({ id: 'c', position: 3 });
  });

  it('não faz nada sem picos', () => {
    expect(cycleSpot([], null, 1)).toBeNull();
  });

  it('anuncia a posição do pico', () => {
    expect(announceSpot({ name: 'Praça' }, 2, 7)).toBe('Pico 2 de 7: Praça');
  });

  it('identifica o alvo do clique: cluster, pico ou vazio', () => {
    expect(
      pickClickTarget([
        {
          properties: { cluster: true, cluster_id: 7, point_count: 4 },
          geometry: { type: 'Point', coordinates: [-46.6, -23.5] },
        },
      ]),
    ).toEqual({ kind: 'cluster', clusterId: 7, center: [-46.6, -23.5] });
    expect(pickClickTarget([{ properties: { id: 's1' } }])).toEqual({
      kind: 'spot',
      id: 's1',
    });
    expect(pickClickTarget([])).toEqual({ kind: 'none' });
    expect(pickClickTarget(undefined)).toEqual({ kind: 'none' });
  });
});
