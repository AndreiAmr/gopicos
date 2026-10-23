import http from '@/config/http';
import { getToken } from '@/utils/session';

const CREATE_SPOT = `mutation CreateSpot($input: NewSpotInput!) {
  createSpot(input: $input) { id }
}`;

/** Falha de envio: `type`/`field` vêm do servidor; sem `type` é erro de rede. */
export class CreateSpotError extends Error {
  constructor(
    message: string,
    readonly type: string | null = null,
    readonly field: string | null = null,
  ) {
    super(message);
    this.name = 'CreateSpotError';
  }

  get isNetwork() {
    return this.type === null;
  }
}

/**
 * Corpo multipart do GraphQL multipart request spec (o que o graphql-upload lê
 * no backend): `operations`, `map` e um arquivo por foto.
 */
export const buildCreateSpotBody = (
  input: Record<string, unknown>,
  photos: File[],
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
  photos.forEach((photo, index) => body.append(String(index), photo));
  return body;
};

type GraphQLResponse = {
  data?: { createSpot?: { id: string } | null } | null;
  errors?: {
    message: string;
    extensions?: { type?: string; field?: string };
  }[];
};

/** Cria o pico com as fotos numa única chamada e devolve o id criado. */
export const createSpotRequest = async (
  input: Record<string, unknown>,
  photos: File[],
): Promise<string> => {
  const token = getToken();

  let body: GraphQLResponse;
  try {
    const response = await http.post<GraphQLResponse>(
      '/graphql',
      buildCreateSpotBody(input, photos),
      {
        headers: {
          // Exigido pelo Apollo contra CSRF em requisições multipart.
          'apollo-require-preflight': 'true',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        validateStatus: () => true,
      },
    );
    body = response.data;
  } catch {
    throw new CreateSpotError('Falha de rede');
  }

  const error = body?.errors?.[0];
  if (error) {
    throw new CreateSpotError(
      error.message,
      error.extensions?.type ?? 'INTERNAL_ERROR',
      error.extensions?.field ?? null,
    );
  }

  const id = body?.data?.createSpot?.id;
  if (!id) throw new CreateSpotError('Falha de rede');
  return id;
};
