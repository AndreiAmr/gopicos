import { URL } from '@/routes/url';

import { ISignUpFieldError, SignUpField, SignUpStep } from './signUpTypes';

export const NETWORK_ERROR_MESSAGE =
  'Sem conexão. Verifique sua internet e tente de novo.';
export const SERVER_ERROR_MESSAGE =
  'Algo deu errado do nosso lado. Tente de novo em instantes.';
export const EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';

export const STEP_URL: Record<SignUpStep, URL> = {
  1: URL.SIGN_UP,
  2: URL.SIGN_UP_EMAIL,
  3: URL.SIGN_UP_PASSWORD,
};

export const FIELD_STEP: Record<SignUpField, SignUpStep> = {
  firstName: 1,
  lastName: 1,
  email: 2,
  emailConfirm: 2,
  password: 3,
  passwordConfirm: 3,
};

// "name" e o campo unico do backend antes do #105 (firstName/lastName).
const SERVER_FIELD_MAP: Record<string, SignUpField> = {
  name: 'firstName',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  password: 'password',
};

type ApolloLikeError = {
  graphQLErrors?: ReadonlyArray<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
  networkError?: unknown;
};

export type ClassifiedSignUpError =
  | { kind: 'field'; step: SignUpStep; error: ISignUpFieldError }
  | { kind: 'banner'; step?: SignUpStep; message: string; canRetry: boolean };

/** Traduz o erro do servidor para a apresentacao definida na spec (5.4). */
export const classifySignUpError = (err: unknown): ClassifiedSignUpError => {
  const apolloError = err as ApolloLikeError;
  const first = apolloError?.graphQLErrors?.[0];

  if (!first) {
    if (apolloError?.networkError) {
      return {
        kind: 'banner',
        message: NETWORK_ERROR_MESSAGE,
        canRetry: true,
      };
    }
    return { kind: 'banner', message: SERVER_ERROR_MESSAGE, canRetry: false };
  }

  const type = first.extensions?.type;
  const serverField = first.extensions?.field;
  const field =
    typeof serverField === 'string' ? SERVER_FIELD_MAP[serverField] : undefined;

  if (type === EMAIL_ALREADY_EXISTS) {
    return {
      kind: 'field',
      step: 2,
      error: {
        field: 'email',
        message: 'Este e-mail já tem cadastro.',
        type: EMAIL_ALREADY_EXISTS,
      },
    };
  }

  if (type === 'VALIDATION_ERROR') {
    if (field) {
      return {
        kind: 'field',
        step: FIELD_STEP[field],
        error: { field, message: first.message },
      };
    }
    // acceptedTerms (GP-099) e campos desconhecidos: banner no passo 3.
    return {
      kind: 'banner',
      step: 3,
      message: first.message,
      canRetry: false,
    };
  }

  return { kind: 'banner', message: SERVER_ERROR_MESSAGE, canRetry: false };
};
