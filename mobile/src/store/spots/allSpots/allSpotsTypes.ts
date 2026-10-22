export enum EAllSpotsCustomActionTypes {
  GET_ALL_SPOTS_ASYNC = 'allSpots/GET_ALL_SPOTS_ASYNC',
}

export type Spot = {
  id: string;
  name: string;
  description: string;
  modality: string;
  isPaid: boolean;
  alwaysOpen: boolean;
  hasCoverage: boolean;
  images: [string?];
  equipmentRequired: boolean;
  entryAmount: string;
  coordinates: number[][][];
  markingType: string;
};

export type IAllSpotsState = {
  data: Spot[] | null;
  isLoading: boolean;
  isError: boolean;
};
