export type ICoordinates = number[][][] | number[];

export interface ICreateSpot {
  coordinates: ICoordinates;
  name?: string;
  description?: string;
  road?: string;
  suburb?: string;
  number?: string;
  complement?: string;
  reference?: string;
  modality?: string;
  equipmentRequired?: boolean;
  isPaid?: boolean;
  entryAmount?: string;
  alwaysOpen?: boolean;
  openingHours?: string;
  hasCoverage?: boolean;
  markingType?: string;
  openingTime?: string;
  closingTime?: string;
  images?: File[];
}
