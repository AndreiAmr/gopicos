import { apolloClient } from '@/config/apollo-client';

import { createSpotMutation } from './createSpotQueries';
import { ICreateSpot } from './createSpotTypes';

type CreateSpotResponse = {
  createSpot: {
    name: string;
  };
};

type CreateSpotInputPayload = ICreateSpot & {
  equipamentRequired?: boolean;
  images?: File[];
};

const fetchCreateSpot = async (
  spotInfos: CreateSpotInputPayload,
): Promise<boolean | null> => {
  try {
    const openingHours =
      spotInfos.openingTime && spotInfos.closingTime
        ? `${spotInfos.openingTime}-${spotInfos.closingTime}`
        : undefined;

    const input = {
      name: spotInfos.name,
      description: spotInfos.description,
      modality: spotInfos.modality,
      isPaid: spotInfos.isPaid,
      alwaysOpen: spotInfos.alwaysOpen,
      hasCoverage: spotInfos.hasCoverage,
      images: spotInfos.images,
      equipmentRequired:
        spotInfos.equipmentRequired ?? spotInfos.equipamentRequired,
      entryAmount: spotInfos.entryAmount,
      coordinates: spotInfos.coordinates,
      openingHours,
      markingType: spotInfos.markingType,
    };

    const { data } = await apolloClient.mutate<CreateSpotResponse>({
      mutation: createSpotMutation,
      variables: {
        input,
      },
    });

    return Boolean(data?.createSpot);
  } catch (error) {
    console.error('Error creating spot:', error);
    return false;
  }
};

export const createSpotRepository = {
  fetchCreateSpot,
};
