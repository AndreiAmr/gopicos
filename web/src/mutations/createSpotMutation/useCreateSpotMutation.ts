import { useMutation } from '@tanstack/react-query';

import { ICreateSpot } from './createSpotTypes';
import http from '@/config/http';

export const fetchCreateSpot = async (params: ICreateSpot) => {
  const formData = new FormData();
  const files = params.images || [];

  const input = {
    name: params.name,
    description: params.description,
    modality: params.modality,
    isPaid: params.isPaid,
    alwaysOpen: params.alwaysOpen,
    hasCoverage: params.hasCoverage,
    equipmentRequired: params.equipmentRequired,
    entryAmount: params.entryAmount,
    coordinates: params.coordinates,
    openingHours: params.openingHours,
    markingType: params.markingType,
    images: files.map(() => null),
  };

  const operations = {
    query: `
      mutation CreateSpot($input: NewSpotInput!) {
        createSpot(input: $input) {
          name
        }
      }
    `,
    variables: { input },
  };

  const map: Record<string, string[]> = {};
  files.forEach((_, index) => {
    map[index] = [`variables.input.images.${index}`];
  });

  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify(map));
  files.forEach((file, index) => {
    formData.append(String(index), file);
  });

  const result = await http.post('/graphql', formData, {
    headers: {
      'x-apollo-operation-name': 'CreateSpot',
      'apollo-require-preflight': 'true',
    },
  });
  return result;
};

export const useCreateSpotMutation = () => {
  return useMutation({
    mutationFn: async (params: ICreateSpot) => {
      const result = await fetchCreateSpot(params);
      if (!result) {
        throw new Error('Falha ao criar spot');
      }
      if (result.data?.errors?.length > 0) {
        throw new Error(result.data.errors[0].message || 'Falha ao criar spot');
      }
      return result;
    },
  });
};
