import { ApiError, graphqlEndpoint } from '../../config/apollo';
import { getToken } from '../session';
import { PickedPhoto } from '../../domain/spot/newSpotForm';

const CREATE_SPOT = `mutation CreateSpot($input: NewSpotInput!) {
  createSpot(input: $input) { id }
}`;

/** Falha de envio: `apiError` vem do servidor; sem ele, é erro de rede. */
export class CreateSpotError extends Error {
  constructor(readonly apiError: (ApiError & { field?: string }) | null) {
    super(apiError?.message ?? 'Falha de rede');
    this.name = 'CreateSpotError';
  }
}

/**
 * Monta o corpo multipart do GraphQL multipart request spec (o mesmo que o
 * graphql-upload lê no backend): `operations`, `map` e um arquivo por foto.
 */
export const buildCreateSpotBody = (
  input: Record<string, unknown>,
  photos: PickedPhoto[],
): FormData => {
  const body = new FormData();

  body.append(
    'operations',
    JSON.stringify({
      query: CREATE_SPOT,
      variables: { input: { ...input, images: photos.map(() => null) } },
    }),
  );

  const map: Record<string, string[]> = {};
  photos.forEach((_, index) => {
    map[String(index)] = [`variables.input.images.${index}`];
  });
  body.append('map', JSON.stringify(map));

  photos.forEach((photo, index) => {
    // React Native aceita { uri, name, type } como arquivo no FormData.
    body.append(String(index), {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    } as unknown as Blob);
  });

  return body;
};

/** Cria o pico com as fotos numa única chamada. Devolve o id criado. */
export const createSpotRequest = async (
  input: Record<string, unknown>,
  photos: PickedPhoto[],
): Promise<string> => {
  const token = await getToken();

  let response: Response;
  try {
    response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        // Exigido pelo graphql-upload/Apollo contra CSRF em multipart.
        'apollo-require-preflight': 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: buildCreateSpotBody(input, photos),
    });
  } catch {
    throw new CreateSpotError(null);
  }

  let json: {
    data?: { createSpot?: { id: string } | null } | null;
    errors?: (ApiError & { extensions?: { field?: string } })[];
  };
  try {
    json = await response.json();
  } catch {
    throw new CreateSpotError(null);
  }

  const error = json.errors?.[0];
  if (error) {
    throw new CreateSpotError({
      type: error.type ?? 'INTERNAL_ERROR',
      message: error.message,
      statusCode: error.statusCode ?? response.status,
      field: error.extensions?.field,
    });
  }

  const id = json.data?.createSpot?.id;
  if (!id) throw new CreateSpotError(null);

  return id;
};
