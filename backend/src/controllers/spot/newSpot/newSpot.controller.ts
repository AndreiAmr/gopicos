import { IAuthentication } from '../../../models/authentication/authenticationModel';
import { newSpotServices } from '../../../services/spot/newSpot/newSpot.service';

export type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
};

export type NewSpotInput = {
  name: string;
  description: string;
  /** Uploads do graphql-upload (com `.promise`). */
  images?: unknown[] | null;
  modality: string;
  isPaid: boolean;
  alwaysOpen: boolean;
  hasCoverage: boolean;
  equipmentRequired: boolean;
  entryAmount?: string | null;
  /** GeoJSON Polygon em ordem [lng, lat]. */
  coordinates: unknown;
  openingHours?: string | null;
  markingType?: string | null;
};

export const newSpotController = async (
  data: NewSpotInput,
  auth: IAuthentication,
) => newSpotServices.createSpotService({ data, auth });
