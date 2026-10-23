import * as yup from 'yup';
import { profileStrings } from '../logic';

export const deleteStrings = {
  title: 'Excluir conta',
  headline: 'Sua conta será desativada.',
  hiddenProfile:
    'Seu perfil deixa de aparecer. Seu nome e e-mail ficam ocultos para outras pessoas.',
  averages: 'As notas das suas avaliações continuam contando na média dos picos.',
  reactivate:
    'Você pode reativar a conta quando quiser: é só entrar de novo com seu e-mail e senha.',
  passwordLabel: 'Senha',
  passwordHint: 'Digite sua senha para confirmar.',
  submit: 'Excluir conta',
  submitting: 'Excluindo',
  announceSubmitting: 'Excluindo conta',
  cancel: 'Cancelar',
  wrongPassword: 'Senha incorreta.',
} as const;

export const deleteSchema = yup.object({
  password: yup.string().required('Informe sua senha para continuar.'),
});

export type DeleteFormData = yup.InferType<typeof deleteSchema>;

/**
 * Item "picos e avaliações continuam..." (spec 7.2). Com contagens: cita só o
 * que existe (singular correto); ambas zero: omitido (null). Sem contagens:
 * texto genérico.
 */
export const keepsActivityText = (
  spotsCount?: number | null,
  reviewsCount?: number | null,
): string | null => {
  const suffix =
    'continuam no GoPicos, com o autor mostrado como "Usuário Desativado".';

  if (typeof spotsCount !== 'number' || typeof reviewsCount !== 'number') {
    return `Seus picos e avaliações ${suffix}`;
  }

  if (spotsCount === 0 && reviewsCount === 0) return null;

  const spots =
    spotsCount === 1 ? '1 pico' : spotsCount > 1 ? `${spotsCount} picos` : '';
  const reviews =
    reviewsCount === 1
      ? '1 avaliação'
      : reviewsCount > 1
        ? `${reviewsCount} avaliações`
        : '';
  const items = [spots, reviews].filter(Boolean).join(' e ');
  const single = spotsCount + reviewsCount === 1;
  let possessive = 'Seus';
  if (single) possessive = spotsCount === 1 ? 'Seu' : 'Sua';
  const rest = single ? suffix.replace('continuam', 'continua') : suffix;

  return `${possessive} ${items} ${rest}`;
};

export type DeleteErrorAction =
  | { kind: 'field'; message: string }
  | { kind: 'sessionExpired' }
  | { kind: 'banner'; message: string };

type GraphQLErrorLike = {
  message?: string;
  type?: string;
  extensions?: { type?: string; field?: string };
};

export const mapDeleteError = (error: unknown): DeleteErrorAction => {
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
    return { kind: 'field', message: deleteStrings.wrongPassword };
  }
  if (type === 'VALIDATION_ERROR' && first.message) {
    return { kind: 'field', message: first.message };
  }

  return { kind: 'banner', message: profileStrings.server };
};
