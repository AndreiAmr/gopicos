import { ELoginErrors } from '../../../../src/hooks/mutation/login/useLoginMutation';

export type ErrorContentProps = {
  title: string;
  message: string;
};

const errorMessages: Record<ELoginErrors, ErrorContentProps> = {
  [ELoginErrors.USER_NOT_FOUND]: {
    title: 'Usuário não encontrado',
    message:
      'Não foi possível localizar um usuário com os dados fornecidos. Por favor, verifique seus dados e tente novamente.',
  },
  [ELoginErrors.INVALID_CREDENTIALS]: {
    title: 'Credenciais inválidas',
    message:
      'O email ou a senha fornecidos estão incorretos. Por favor, verifique seus dados e tente novamente.',
  },
};

const defaultErrorContent: ErrorContentProps = {
  title: 'Não foi possível entrar',
  message: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
};

const getErrorContent = (errorType?: string): ErrorContentProps => {
  if (!errorType) return defaultErrorContent;

  return errorMessages[errorType as ELoginErrors] ?? defaultErrorContent;
};

export { errorMessages, getErrorContent };
