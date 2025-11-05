import { ICreateSpotState } from './modules/createSpot/createSpotTypes';
import { IListSpotsState } from './modules/listSpots/listSpotsTypes';

export type ISpotsState = {
  ListSpots: IListSpotsState;
  CreateSpot: ICreateSpotState;
};

export type ISpot = {
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
