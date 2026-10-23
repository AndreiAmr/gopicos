import * as yup from 'yup';

import { MODALITY_LABELS } from './spot';

export const PHOTO_LIMITS = { min: 1, max: 5, maxBytes: 5 * 1024 * 1024 } as const;
export const NAME_MAX = 80;
export const DESCRIPTION_MAX = 1000;
export const MIN_POINTS = 3;

export const MODALITY_OPTIONS = Object.entries(MODALITY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export type Position = [number, number];

export type NewSpotFormData = {
  name: string;
  description: string;
  modality: string;
  isPaid: boolean;
  entryAmount: string;
  alwaysOpen: boolean;
  openingHours: string;
  hasCoverage: boolean;
  equipmentRequired: boolean;
};

export const newSpotDefaults: NewSpotFormData = {
  name: '',
  description: '',
  modality: '',
  isPaid: false,
  entryAmount: '',
  alwaysOpen: true,
  openingHours: '',
  hasCoverage: false,
  equipmentRequired: false,
};

/** Ordem dos campos na tela (foco no primeiro inválido). */
export const FIELD_ORDER: (keyof NewSpotFormData)[] = [
  'name',
  'description',
  'modality',
  'entryAmount',
  'openingHours',
];

export const newSpotSchema: yup.ObjectSchema<NewSpotFormData> = yup.object({
  name: yup
    .string()
    .trim()
    .required('Informe o nome do pico.')
    .max(NAME_MAX, 'O nome deve ter no máximo 80 caracteres.'),
  description: yup
    .string()
    .trim()
    .required('Descreva o pico.')
    .max(DESCRIPTION_MAX, 'A descrição deve ter no máximo 1000 caracteres.'),
  modality: yup.string().required('Escolha a modalidade.'),
  isPaid: yup.boolean().required(),
  entryAmount: yup
    .string()
    .trim()
    .defined()
    .when('isPaid', {
      is: true,
      then: (schema) => schema.required('Informe o valor da entrada.'),
    }),
  alwaysOpen: yup.boolean().required(),
  openingHours: yup
    .string()
    .trim()
    .defined()
    .when('alwaysOpen', {
      is: false,
      then: (schema) =>
        schema.required('Informe o horário de funcionamento.'),
    }),
  hasCoverage: yup.boolean().required(),
  equipmentRequired: yup.boolean().required(),
});

/**
 * Acrescenta fotos respeitando o limite de 5 e recusando as acima de 5 MB.
 * Devolve a lista nova e as mensagens de recusa (spec 6.3).
 */
export const addPhotos = (
  current: File[],
  picked: File[],
): { photos: File[]; errors: string[] } => {
  const errors: string[] = [];
  const photos = [...current];

  for (const photo of picked) {
    if (!photo.type.startsWith('image/')) {
      errors.push(
        `O arquivo ${photo.name} não é uma imagem e não foi adicionado.`,
      );
      continue;
    }
    if (photo.size > PHOTO_LIMITS.maxBytes) {
      errors.push(`A foto ${photo.name} passa de 5 MB e não foi adicionada.`);
      continue;
    }
    if (photos.length >= PHOTO_LIMITS.max) {
      errors.push('Você pode enviar no máximo 5 fotos.');
      break;
    }
    photos.push(photo);
  }

  return { photos, errors };
};

export const photosError = (photos: File[]): string | undefined =>
  photos.length < PHOTO_LIMITS.min ? 'Adicione ao menos 1 foto.' : undefined;

export const photoCounter = (count: number): string =>
  `${count} de ${PHOTO_LIMITS.max} fotos`;

/** Polígono GeoJSON [lng, lat] com o anel fechado (primeiro ponto repetido no fim). */
export const pointsToPolygon = (
  points: Position[],
): { type: 'Polygon'; coordinates: number[][][] } => ({
  type: 'Polygon',
  coordinates: [[...points, points[0]]],
});

/** Contador do painel do passo 1. */
export const pointsCounter = (count: number): string =>
  count < MIN_POINTS ? 'Marque pelo menos 3 pontos' : `${count} pontos`;

/** Input da mutation `createSpot` (sem as fotos, que vão no multipart). */
export const toCreateSpotInput = (
  data: NewSpotFormData,
  points: Position[],
) => ({
  name: data.name.trim(),
  description: data.description.trim(),
  modality: data.modality,
  isPaid: data.isPaid,
  entryAmount: data.isPaid ? data.entryAmount.trim() : null,
  alwaysOpen: data.alwaysOpen,
  openingHours: data.alwaysOpen ? null : data.openingHours.trim(),
  hasCoverage: data.hasCoverage,
  equipmentRequired: data.equipmentRequired,
  coordinates: pointsToPolygon(points),
});
