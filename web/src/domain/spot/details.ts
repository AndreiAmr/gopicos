import type { SpotCoordinates } from './spot';

/** Pico como `getSpotById` devolve. */
export type SpotDetails = {
  id: string;
  name: string;
  description: string | null;
  modality: string;
  isPaid: boolean;
  entryAmount: string | null;
  alwaysOpen: boolean;
  openingHours: string | null;
  hasCoverage: boolean;
  equipmentRequired: boolean;
  images: (string | null)[] | null;
  coordinates: SpotCoordinates;
  ratingAverage: number | null;
  reviewsCount: number;
  isOwner: boolean;
  author: { id: string; displayName: string | null } | null;
};

export type InfoRowData = { label: string; value: string };

export const spotDetailsStrings = {
  backToMap: 'Voltar ao mapa',
  notFoundTitle: 'Pico não encontrado',
  notFoundDescription: 'Ele pode ter sido excluído ou o link está errado.',
  error: 'Não foi possível carregar o pico. Verifique sua conexão.',
  retry: 'Tentar novamente',
  edit: 'Editar',
  remove: 'Excluir',
  seeReviews: 'Ver avaliações',
  photoFailed: 'Não foi possível carregar a foto',
  noPhotos: 'Sem fotos',
  noDescription: 'Este pico ainda não tem descrição.',
} as const;

/** `<title>` da aba: "{Nome do pico} - GoPicos". */
export const spotPageTitle = (name?: string | null): string =>
  name ? `${name} - GoPicos` : 'GoPicos';

/** Valor de entrada: "Gratuita" ou o valor informado ("R$ 20"). */
export const entryText = (
  spot: Pick<SpotDetails, 'isPaid' | 'entryAmount'>,
): string => (spot.isPaid ? spot.entryAmount?.trim() || 'Paga' : 'Gratuita');

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

/** Chips além da modalidade: entrada e cobertura. */
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

/** Contador da galeria/lightbox: "2 / 4". */
export const galleryCounter = (index: number, total: number): string =>
  `${index + 1} / ${total}`;

/** Próximo índice circular da galeria. */
export const stepIndex = (index: number, total: number, step: 1 | -1): number =>
  total <= 0 ? 0 : (index + step + total) % total;

/** Fotos válidas (o backend pode devolver itens nulos). */
export const validImages = (images: SpotDetails['images']): string[] =>
  (images ?? []).filter((url): url is string => Boolean(url));
