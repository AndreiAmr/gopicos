import * as yup from 'yup';
import { ApiError } from '../../../config/apollo';
import { ELoginErrors } from '../../../hooks/mutation/login/useLoginMutation';

export const loginStrings = {
  title: 'Entrar',
  tagline: 'Localize o pico perfeito para andar de skate',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@exemplo.com',
  passwordLabel: 'Senha',
  submit: 'Entrar',
  forgotPassword: 'Esqueci minha senha',
  noAccount: 'Não tem conta?',
  signUp: 'Cadastre-se',
  invalidCredentials: 'E-mail ou senha inválidos',
  network: 'Sem conexão. Verifique sua internet e tente de novo.',
  server: 'Algo deu errado do nosso lado. Tente de novo em instantes.',
  retry: 'Tentar novamente',
  signingIn: 'Entrando',
  reactivated: 'Bem-vindo de volta! Sua conta foi reativada.',
  notices: {
    registered: 'Conta criada! Entre com seu e-mail e senha.',
    passwordChanged: 'Senha alterada. Entre com a nova senha.',
    sessionExpired: 'Sua sessão expirou. Entre de novo para continuar.',
    accountDeleted:
      'Conta excluída. Se quiser voltar, entre com seu e-mail e senha e ela será reativada.',
  },
} as const;

export type LoginNotice = keyof typeof loginStrings.notices;

/** Login valida só "vazio" e formato do e-mail (sem regra de tamanho de senha). */
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Informe seu e-mail.')
    .email('Informe um e-mail válido.'),
  password: yup.string().required('Informe sua senha.'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export type LoginFailure = 'credentials' | 'network' | 'server';

/**
 * Classifica a falha: INVALID_CREDENTIALS tem mensagem própria; erro sem
 * `ApiError` (timeout, offline) é rede; qualquer outro erro do servidor é
 * genérico. Nunca expõe o `type` técnico ao usuário.
 */
export const classifyLoginError = (apiError: ApiError | null): LoginFailure => {
  if (!apiError) {
    return 'network';
  }

  return apiError.type === ELoginErrors.INVALID_CREDENTIALS
    ? 'credentials'
    : 'server';
};

export const failureMessage = (failure: LoginFailure): string =>
  ({
    credentials: loginStrings.invalidCredentials,
    network: loginStrings.network,
    server: loginStrings.server,
  }[failure]);
