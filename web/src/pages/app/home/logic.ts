import type { SpotSummary } from '@/domain/spot/spot';

export const homeStrings = {
  loading: 'Carregando picos...',
  error: 'Não foi possível carregar os picos. Verifique sua conexão.',
  retry: 'Tentar novamente',
  emptyTitle: 'Nenhum pico por aqui ainda',
  emptyDescription: 'Seja o primeiro a cadastrar um pico nesta região.',
  emptyAction: 'Cadastrar o primeiro pico',
  newSpot: 'Novo pico',
  mapLabel: 'Mapa de picos',
  mapHint: 'Use ] e [ para percorrer os picos e Enter para abrir o detalhe.',
} as const;

/** Próximo (`1`) ou anterior (`-1`) pico da lista, circular. Sem seleção, `]` vai ao primeiro e `[` ao último. */
export const cycleSpot = (
  ids: string[],
  currentId: string | null,
  direction: 1 | -1,
): { id: string; position: number } | null => {
  if (ids.length === 0) return null;
  const index = currentId ? ids.indexOf(currentId) : -1;
  let next: number;
  if (index === -1) {
    next = direction === 1 ? 0 : ids.length - 1;
  } else {
    next = (index + direction + ids.length) % ids.length;
  }
  return { id: ids[next], position: next + 1 };
};

/** "Pico 2 de 7: {nome}", anunciado ao percorrer os picos pelo teclado. */
export const announceSpot = (
  spot: Pick<SpotSummary, 'name'>,
  position: number,
  total: number,
): string => `Pico ${position} de ${total}: ${spot.name}`;

type ClickFeature = {
  properties?: Record<string, unknown> | null;
  geometry?: { type?: string; coordinates?: unknown } | null;
};

export type ClickTarget =
  | { kind: 'cluster'; clusterId: number; center: [number, number] }
  | { kind: 'spot'; id: string }
  | { kind: 'none' };

/** O que um clique no mapa atingiu: cluster (aproxima), pico (seleciona) ou nada (fecha). */
export const pickClickTarget = (
  features: ClickFeature[] | null | undefined,
): ClickTarget => {
  const cluster = features?.find((feature) => feature.properties?.cluster);
  if (cluster) {
    const coordinates = cluster.geometry?.coordinates as number[] | undefined;
    if (coordinates && coordinates.length >= 2) {
      return {
        kind: 'cluster',
        clusterId: Number(cluster.properties?.cluster_id),
        center: [coordinates[0], coordinates[1]],
      };
    }
  }
  const spot = features?.find((feature) => feature.properties?.id);
  return spot ? { kind: 'spot', id: String(spot.properties?.id) } : { kind: 'none' };
};
