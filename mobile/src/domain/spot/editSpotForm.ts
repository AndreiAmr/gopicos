import type { SpotDetails } from './details';
import {
  NewSpotFormData,
  PickedPhoto,
  toCreateSpotInput,
} from './newSpotForm';

export type Polygon = { type: 'Polygon'; coordinates: number[][][] };

/** Foto da edição: as já salvas (`remote`, uri = URL) e as novas a enviar. */
export type EditablePhoto = PickedPhoto & { remote?: boolean };

export const spotToFormData = (spot: SpotDetails): NewSpotFormData => ({
  name: spot.name,
  description: spot.description,
  modality: spot.modality,
  isPaid: spot.isPaid,
  entryAmount: spot.entryAmount ?? '',
  alwaysOpen: spot.alwaysOpen,
  openingHours: spot.openingHours ?? '',
  hasCoverage: spot.hasCoverage,
  equipmentRequired: spot.equipmentRequired,
});

export const spotPhotos = (
  spot: Pick<SpotDetails, 'images'>,
): EditablePhoto[] =>
  spot.images.map((url, index) => ({
    uri: url,
    name: `foto-${index + 1}.jpg`,
    type: 'image/jpeg',
    remote: true,
  }));

/** Fotos novas, na ordem em que serão enviadas. */
export const newPhotos = (photos: EditablePhoto[]): PickedPhoto[] =>
  photos.filter(photo => !photo.remote);

/** Input da mutation `updateSpot`; as fotos novas vão no multipart. */
export const toUpdateSpotInput = (
  data: NewSpotFormData,
  coordinates: Polygon,
  photos: EditablePhoto[],
) => ({
  ...toCreateSpotInput(data, coordinates),
  keepImages: photos.filter(photo => photo.remote).map(photo => photo.uri),
});

/** Nada mudou: salvar só volta ao detalhe (spec 7). */
export const isUnchanged = (
  spot: SpotDetails,
  data: NewSpotFormData,
  coordinates: Polygon,
  photos: EditablePhoto[],
): boolean =>
  JSON.stringify(
    toUpdateSpotInput(
      spotToFormData(spot),
      spot.coordinates as Polygon,
      spotPhotos(spot),
    ),
  ) === JSON.stringify(toUpdateSpotInput(data, coordinates, photos)) &&
  newPhotos(photos).length === 0;
