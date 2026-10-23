import * as yup from 'yup';

export const profileStrings = {
  title: 'Perfil',
  editTitle: 'Editar dados',
  account: 'Conta',
  editRow: 'Editar dados',
  passwordRow: 'Alterar senha',
  deleteRow: 'Excluir conta',
  logout: 'Sair',
  logoutTitle: 'Sair do GoPicos?',
  logoutMessage: 'Você precisará entrar de novo com seu e-mail e senha.',
  cancel: 'Cancelar',
  loadError: 'Não foi possível carregar seu perfil.',
  retry: 'Tentar novamente',
  back: 'Voltar',
  firstName: 'Nome',
  lastName: 'Sobrenome',
  email: 'E-mail',
  emailHint: 'O e-mail é o seu login e não pode ser alterado.',
  save: 'Salvar alterações',
  saving: 'Salvando',
  saved: 'Perfil atualizado.',
  discardTitle: 'Descartar alterações?',
  discardMessage: 'Você alterou seus dados e ainda não salvou.',
  keepEditing: 'Continuar editando',
  discard: 'Descartar',
  network: 'Sem conexão. Verifique sua internet e tente de novo.',
  server: 'Algo deu errado do nosso lado. Tente de novo em instantes.',
} as const;

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** "Membro desde outubro de 2026". Data inválida: devolve string vazia. */
export const memberSince = (createdAt?: string | null): string => {
  const date = createdAt ? new Date(createdAt) : null;

  if (!date || Number.isNaN(date.getTime())) return '';

  return `Membro desde ${MONTHS[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
};

export const fullName = (firstName: string, lastName: string): string =>
  `${firstName} ${lastName}`.trim();

export const editProfileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required('Informe seu nome.')
    .min(2, 'O nome precisa ter ao menos 2 caracteres.')
    .max(40, 'O nome pode ter no máximo 40 caracteres.'),
  lastName: yup
    .string()
    .trim()
    .required('Informe seu sobrenome.')
    .min(2, 'O sobrenome precisa ter ao menos 2 caracteres.')
    .max(40, 'O sobrenome pode ter no máximo 40 caracteres.'),
});

export type EditProfileFormData = yup.InferType<typeof editProfileSchema>;

/** Houve mudança real (ignora espaços nas pontas)? */
export const hasProfileChanges = (
  saved: { firstName: string; lastName: string },
  current: { firstName?: string; lastName?: string },
): boolean =>
  (current.firstName ?? '').trim() !== saved.firstName.trim() ||
  (current.lastName ?? '').trim() !== saved.lastName.trim();

export type ProfileErrorAction =
  | { kind: 'field'; field: 'firstName' | 'lastName'; message: string }
  | { kind: 'sessionExpired' }
  | { kind: 'banner'; message: string };

type GraphQLErrorLike = {
  message?: string;
  type?: string;
  extensions?: { type?: string; field?: string };
};

/** Converte o erro do Apollo na ação de UI (campo, sessão expirada ou banner). */
export const mapProfileError = (error: unknown): ProfileErrorAction => {
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

  const field = first.extensions?.field;
  if (
    type === 'VALIDATION_ERROR' &&
    first.message &&
    (field === 'firstName' || field === 'lastName')
  ) {
    return { kind: 'field', field, message: first.message };
  }

  if (type === 'VALIDATION_ERROR' && first.message) {
    return { kind: 'banner', message: first.message };
  }

  return { kind: 'banner', message: profileStrings.server };
};
