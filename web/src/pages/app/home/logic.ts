import type { SpotSummary } from '@/domain/spot/spot';

export const homeStrings = {
  loading: 'Carregando picos...',
  error: 'Não foi possível carregar os picos. Verifique sua conexão.',
  retry: 'Tentar novamente',
  emptyTitle: 'Nenhum pico por aqui ainda',
  emptyDescription: 'Seja o primeiro a cadastrar um pico nesta região.',
  emptyAction: 'Cadastrar o primeiro pico',
  newSpot: 'Novo pico',
  filteredEmptyTitle: 'Nenhum pico com esses filtros.',
  filteredEmptyDescription: 'Tente mudar ou limpar os filtros.',
  filteredEmptyAction: 'Limpar filtros',
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
