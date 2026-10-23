import { AppError } from '../../../utils/AppError';

export const SPOT_LIMITS = {
  nameMax: 80,
  descriptionMax: 1000,
  imagesMin: 1,
  imagesMax: 5,
  /** 5 MB por foto. */
  imageMaxBytes: 5 * 1024 * 1024,
  polygonMinPoints: 3,
} as const;

export const MODALITIES = [
  'street',
  'park',
  'bowl_pool',
  'vertical',
  'downhill',
  'mixed',
] as const;

export type SpotFieldsInput = {
  name?: string | null;
  description?: string | null;
  modality?: string | null;
  isPaid?: boolean | null;
  entryAmount?: string | null;
  alwaysOpen?: boolean | null;
  openingHours?: string | null;
  hasCoverage?: boolean | null;
  equipmentRequired?: boolean | null;
  coordinates?: unknown;
};

/** Campos já validados e normalizados (trim; vazios viram null). */
export type ValidSpotFields = {
  name: string;
  description: string;
  modality: (typeof MODALITIES)[number];
  isPaid: boolean;
  entryAmount: string | null;
  alwaysOpen: boolean;
  openingHours: string | null;
  hasCoverage: boolean;
  equipmentRequired: boolean;
  coordinates: { type: 'Polygon'; coordinates: number[][][] };
};

const invalid = (field: string, message: string) =>
  new AppError({ type: 'VALIDATION_ERROR', message, field });

const isPosition = (value: unknown): value is [number, number] =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number' &&
  Number.isFinite(value[0]) &&
  Number.isFinite(value[1]) &&
  value[0] >= -180 &&
  value[0] <= 180 &&
  value[1] >= -90 &&
  value[1] <= 90;

/**
 * Polígono GeoJSON em ordem [lng, lat], anel externo fechado (primeiro ponto
 * igual ao último) e com pelo menos 3 pontos distintos.
 */
export const validatePolygon = (
  value: unknown,
): ValidSpotFields['coordinates'] => {
  const message =
    'Marque a área do pico com pelo menos 3 pontos formando um polígono fechado.';
  const polygon = value as { type?: unknown; coordinates?: unknown } | null;

  if (
    !polygon ||
    polygon.type !== 'Polygon' ||
    !Array.isArray(polygon.coordinates) ||
    polygon.coordinates.length === 0
  ) {
    throw invalid('coordinates', message);
  }

  const ring = polygon.coordinates[0] as unknown[];

  if (!Array.isArray(ring) || !ring.every(isPosition)) {
    throw invalid('coordinates', message);
  }

  const first = ring[0];
  const last = ring[ring.length - 1];
  const closed =
    ring.length >= SPOT_LIMITS.polygonMinPoints + 1 &&
    first[0] === last[0] &&
    first[1] === last[1];
  const distinct = new Set(ring.slice(0, -1).map((p) => `${p[0]},${p[1]}`));

  if (!closed || distinct.size < SPOT_LIMITS.polygonMinPoints) {
    throw invalid('coordinates', message);
  }

  return {
    type: 'Polygon',
    coordinates: [ring.map((p) => [p[0], p[1]])],
  };
};

const text = (value?: string | null) => value?.trim() || null;

/** Valida os campos do pico (sem as fotos). Lança VALIDATION_ERROR com `field`. */
export const validateSpotFields = (input: SpotFieldsInput): ValidSpotFields => {
  const name = text(input.name);
  if (!name) throw invalid('name', 'Informe o nome do pico.');
  if (name.length > SPOT_LIMITS.nameMax) {
    throw invalid('name', 'O nome deve ter no máximo 80 caracteres.');
  }

  const description = text(input.description);
  if (!description) throw invalid('description', 'Informe a descrição do pico.');
  if (description.length > SPOT_LIMITS.descriptionMax) {
    throw invalid(
      'description',
      'A descrição deve ter no máximo 1000 caracteres.',
    );
  }

  const modality = input.modality as ValidSpotFields['modality'];
  if (!modality || !MODALITIES.includes(modality)) {
    throw invalid('modality', 'Escolha a modalidade do pico.');
  }

  const isPaid = Boolean(input.isPaid);
  const entryAmount = isPaid ? text(input.entryAmount) : null;
  if (isPaid && !entryAmount) {
    throw invalid('entryAmount', 'Informe o valor da entrada.');
  }

  const alwaysOpen = input.alwaysOpen ?? true;
  const openingHours = alwaysOpen ? null : text(input.openingHours);
  if (!alwaysOpen && !openingHours) {
    throw invalid('openingHours', 'Informe o horário de funcionamento.');
  }

  return {
    name,
    description,
    modality,
    isPaid,
    entryAmount,
    alwaysOpen,
    openingHours,
    hasCoverage: Boolean(input.hasCoverage),
    equipmentRequired: Boolean(input.equipmentRequired),
    coordinates: validatePolygon(input.coordinates),
  };
};

/** Quantidade de fotos: de 1 a 5. */
export const validateImageCount = (count: number) => {
  if (count < SPOT_LIMITS.imagesMin) {
    throw invalid('images', 'Adicione pelo menos 1 foto.');
  }
  if (count > SPOT_LIMITS.imagesMax) {
    throw invalid('images', 'Envie no máximo 5 fotos.');
  }
};

/** Tipo de arquivo: só imagens. */
export const validateImageType = (mimetype?: string | null) => {
  if (!mimetype || !mimetype.startsWith('image/')) {
    throw invalid('images', 'Envie apenas arquivos de imagem.');
  }
};

export const imageTooLarge = () =>
  invalid('images', 'Cada foto deve ter no máximo 5 MB.');
