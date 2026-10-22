import {
  spotRepository,
  SpotListItem,
  SpotsFilter,
} from '../../../database/repositories/Spot';
import { AppError } from '../../../utils/AppError';

const MODALITIES = [
  'street',
  'park',
  'bowl_pool',
  'vertical',
  'downhill',
  'mixed',
];

export const listAllSpotsService = async (
  filter?: SpotsFilter,
): Promise<SpotListItem[]> => {
  if (
    filter?.minRating != null &&
    (filter.minRating < 1 || filter.minRating > 5)
  ) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'A nota mínima deve estar entre 1 e 5.',
      field: 'minRating',
    });
  }

  if (filter?.modality && !MODALITIES.includes(filter.modality)) {
    throw new AppError({
      type: 'VALIDATION_ERROR',
      message: 'Modalidade inválida.',
      field: 'modality',
    });
  }

  return spotRepository.listAll(filter);
};
