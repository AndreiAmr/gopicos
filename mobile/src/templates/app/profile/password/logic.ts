import * as yup from 'yup';
import { profileStrings } from '../logic';

export const MIN_PASSWORD_LENGTH = 8;

export const passwordStrings = {
  title: 'Alterar senha',
  intro: 'Escolha uma senha nova com pelo menos 8 caracteres.',
  currentLabel: 'Senha atual',
  newLabel: 'Nova senha',
  newHint: 'Mínimo de 8 caracteres.',
  confirmLabel: 'Confirmar nova senha',
  submit: 'Alterar senha',
  submitting: 'Alterando',
  announceSubmitting: 'Alterando senha',
  success: 'Senha alterada.',
  wrongCurrent: 'Senha atual incorreta.',
} as const;

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Informe sua senha atual.'),
  newPassword: yup
    .string()
    .required('Crie uma nova senha.')
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    )
    .test(
      'different-from-current',
      'A nova senha precisa ser diferente da atual.',
      (value, ctx) => !value || value !== ctx.parent.currentPassword,
    ),
  confirmPassword: yup
    .string()
    .required('Confirme a nova senha.')
    .test(
      'passwords-match',
      'As senhas não coincidem.',
      (value, ctx) => value === ctx.parent.newPassword,
    ),
});

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

export type ChangePasswordErrorAction =
  | { kind: 'field'; field: 'currentPassword' | 'newPassword'; message: string }
  | { kind: 'sessionExpired' }
  | { kind: 'banner'; message: string };

type GraphQLErrorLike = {
  message?: string;
  type?: string;
  extensions?: { type?: string; field?: string };
};

/** Converte o erro do Apollo na ação de UI (spec 6.3). */
export const mapChangePasswordError = (
  error: unknown,
): ChangePasswordErrorAction => {
  const first = (error as { errors?: GraphQLErrorLike[] })?.errors?.[0];

  if (!first) {
    const isNetwork = Boolean(
      (error as { networkError?: unknown })?.networkError ||
        /network|fetch|timeout/i.test((error as Error)?.message ?? ''),
    );
    return {
      kind: 'banner',
      message: isNetwork ? profileStrings.network : profileStrings.server,
    };
  }

  const type = first.type ?? first.extensions?.type;

  if (type === 'UNAUTHENTICATED') return { kind: 'sessionExpired' };

  if (type === 'INVALID_CREDENTIALS') {
    return {
      kind: 'field',
      field: 'currentPassword',
      message: passwordStrings.wrongCurrent,
    };
  }

  if (type === 'VALIDATION_ERROR' && first.message) {
    const field = first.extensions?.field;
    if (field === 'newPassword' || field === 'currentPassword') {
      return { kind: 'field', field, message: first.message };
    }
    return { kind: 'banner', message: first.message };
  }

  return { kind: 'banner', message: profileStrings.server };
};
