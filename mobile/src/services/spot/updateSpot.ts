import { ApiError, graphqlEndpoint } from '../../config/apollo';
import { getToken } from '../session';
import { PickedPhoto } from '../../domain/spot/newSpotForm';

const UPDATE_SPOT = `mutation UpdateSpot($id: String!, $input: UpdateSpotInput!) {
  updateSpot(id: $id, input: $input) { id }
}`;

/** Falha de envio: `apiError` vem do servidor; sem ele, é erro de rede. */
export class UpdateSpotError extends Error {
  constructor(readonly apiError: (ApiError & { field?: string }) | null) {
    super(apiError?.message ?? 'Falha de rede');
    this.name = 'UpdateSpotError';
  }
}

/** Multipart do GraphQL (operations, map e um arquivo por foto nova). */
export const buildUpdateSpotBody = (
  id: string,
  input: Record<string, unknown>,
  photos: PickedPhoto[],
): FormData => {
  const body = new FormData();

  body.append(
    'operations',
    JSON.stringify({
      query: UPDATE_SPOT,
      variables: { id, input: { ...input, newImages: photos.map(() => null) } },
    }),
  );

  const map: Record<string, string[]> = {};
  photos.forEach((_, index) => {
    map[String(index)] = [`variables.input.newImages.${index}`];
  });
  body.append('map', JSON.stringify(map));

  photos.forEach((photo, index) => {
    body.append(String(index), {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    } as unknown as Blob);
  });

  return body;
};

/** Atualiza o pico (e envia as fotos novas) numa única chamada. */
export const updateSpotRequest = async (
  id: string,
  input: Record<string, unknown>,
  photos: PickedPhoto[],
): Promise<string> => {
  const token = await getToken();

  let response: Response;
  try {
    response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'apollo-require-preflight': 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: buildUpdateSpotBody(id, input, photos),
    });
  } catch {
    throw new UpdateSpotError(null);
  }

  let json: {
    data?: { updateSpot?: { id: string } | null } | null;
    errors?: (ApiError & { extensions?: { field?: string } })[];
  };
  try {
    json = await response.json();
  } catch {
    throw new UpdateSpotError(null);
  }

  const error = json.errors?.[0];
  if (error) {
    throw new UpdateSpotError({
      type: error.type ?? 'INTERNAL_ERROR',
      message: error.message,
      statusCode: error.statusCode ?? response.status,
      field: error.extensions?.field,
    });
  }

  const savedId = json.data?.updateSpot?.id;
  if (!savedId) throw new UpdateSpotError(null);

  return savedId;
};
