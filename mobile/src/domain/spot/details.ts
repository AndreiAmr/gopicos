import { SpotSummary } from './spot';

/** Pico como `getSpotById` devolve. */
export type SpotDetails = SpotSummary & {
  description: string;
  isPaid: boolean;
  entryAmount: string | null;
  alwaysOpen: boolean;
  openingHours: string | null;
  hasCoverage: boolean;
  equipmentRequired: boolean;
  images: string[];
  author: { id: string; displayName: string } | null;
  isOwner: boolean;
};

export type InfoRowData = { label: string; value: string };

/** Valor de entrada: "Gratuita" ou o valor informado ("R$ 20"). */
export const entryText = (spot: Pick<SpotDetails, 'isPaid' | 'entryAmount'>) =>
  spot.isPaid ? spot.entryAmount?.trim() || 'Paga' : 'Gratuita';

/** Linhas de informação do detalhe (microcopy da spec 5.3a). */
export const infoRows = (spot: SpotDetails): InfoRowData[] => [
  { label: 'Entrada', value: entryText(spot) },
  {
    label: 'Horário',
    value: spot.alwaysOpen
      ? 'Aberto 24 horas'
      : spot.openingHours?.trim() || 'Não informado',
  },
  { label: 'Cobertura', value: spot.hasCoverage ? 'Coberto' : 'Descoberto' },
  {
    label: 'Equipamento',
    value: spot.equipmentRequired ? 'Exige proteção' : 'Não exige',
  },
];

/** Chips do topo: modalidade é exibida à parte; aqui entrada e cobertura. */
export const detailChips = (spot: SpotDetails): string[] => [
  spot.isPaid ? entryText(spot) : 'Gratuito',
  ...(spot.hasCoverage ? ['Coberto'] : []),
];

/** "1 avaliação" / "23 avaliações" / "Sem avaliações ainda". */
export const reviewsCountText = (count: number): string => {
  if (count <= 0) return 'Sem avaliações ainda';
  return count === 1 ? '1 avaliação' : `${count} avaliações`;
};

/** "Criado por Marina S." (o backend já devolve "Usuário Desativado"). */
export const createdByText = (spot: Pick<SpotDetails, 'author'>): string =>
  `Criado por ${spot.author?.displayName || 'Usuário Desativado'}`;

/** Contador da galeria: "1 / 4". */
export const galleryCounter = (index: number, total: number): string =>
  `${index + 1} / ${total}`;
