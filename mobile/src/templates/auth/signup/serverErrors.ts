import type { SignupFormData, SignupStep } from './schemas';

export const NETWORK_ERROR_MESSAGE =
  'Sem conexão. Verifique sua internet e tente de novo.';
export const SERVER_ERROR_MESSAGE =
  'Algo deu errado do nosso lado. Tente de novo em instantes.';
export const EMAIL_TAKEN_MESSAGE = 'Este e-mail já tem cadastro.';

export type ServerErrorAction =
  | { kind: 'emailTaken'; step: 2 }
  | {
      kind: 'field';
      step: SignupStep;
      field: keyof SignupFormData;
      message: string;
    }
  | { kind: 'banner'; message: string };

type GraphQLErrorLike = {
  message?: string;
  type?: string;
  extensions?: { type?: string; field?: string };
};

const FIELD_STEP: Record<string, [SignupStep, keyof SignupFormData]> = {
  firstName: [1, 'firstName'],
  lastName: [1, 'lastName'],
  // Compatibilidade com o backend anterior ao #105 (campo único `name`).
  name: [1, 'firstName'],
  email: [2, 'email'],
  password: [3, 'password'],
};

/** Converte o erro do Apollo na ação de UI da spec (seção 5.4). */
export const mapSignupError = (error: unknown): ServerErrorAction => {
  const graphQLErrors = (error as { errors?: GraphQLErrorLike[] })?.errors;
  const first = graphQLErrors?.[0];

  if (!first) {
    const isNetwork = Boolean(
      (error as { networkError?: unknown })?.networkError ||
        /network|fetch|timeout/i.test((error as Error)?.message ?? ''),
    );
    return {
      kind: 'banner',
      message: isNetwork ? NETWORK_ERROR_MESSAGE : SERVER_ERROR_MESSAGE,
    };
  }

  const type = first.type ?? first.extensions?.type;

  if (type === 'EMAIL_ALREADY_EXISTS') {
    return { kind: 'emailTaken', step: 2 };
  }

  if (type === 'VALIDATION_ERROR' && first.message) {
    const mapped = first.extensions?.field
      ? FIELD_STEP[first.extensions.field]
      : undefined;
    if (mapped) {
      return {
        kind: 'field',
        step: mapped[0],
        field: mapped[1],
        message: first.message,
      };
    }
    return { kind: 'banner', message: first.message };
  }

  return { kind: 'banner', message: SERVER_ERROR_MESSAGE };
};
