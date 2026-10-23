export const PROFILE_STRINGS = {
  pageTitle: 'Perfil - GoPicos',
  myData: 'Meus dados',
  firstName: 'Nome',
  lastName: 'Sobrenome',
  email: 'E-mail',
  emailHint: 'O e-mail é o seu login e não pode ser alterado.',
  save: 'Salvar alterações',
  loadError: 'Não foi possível carregar seu perfil.',
  retry: 'Tentar novamente',
  logout: 'Sair',
  logoutTitle: 'Sair do GoPicos?',
  logoutText: 'Você precisará entrar de novo com seu e-mail e senha.',
  cancel: 'Cancelar',
} as const;

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 40;

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

/** Iniciais: primeira letra do nome + primeira do sobrenome, maiúsculas. */
export const initialsOf = (firstName?: string, lastName?: string): string =>
  [firstName, lastName]
    .map((part) => part?.trim().charAt(0).toUpperCase() ?? '')
    .join('');

export const fullName = (firstName: string, lastName: string): string =>
  `${firstName} ${lastName}`.trim();

/** "Membro desde outubro de 2026"; data inválida devolve string vazia. */
export const memberSince = (createdAt?: string | null): string => {
  const date = createdAt ? new Date(createdAt) : null;
  if (!date || Number.isNaN(date.getTime())) return '';

  return `Membro desde ${MONTHS[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
};

export type ProfileFormValues = { firstName: string; lastName: string };
export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

const validateName = (value: string, label: 'nome' | 'sobrenome') => {
  const trimmed = value.trim();
  if (!trimmed) return `Informe seu ${label}.`;
  if (trimmed.length < NAME_MIN_LENGTH) {
    return `O ${label} precisa ter ao menos ${NAME_MIN_LENGTH} caracteres.`;
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `O ${label} pode ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
  }
  return undefined;
};

/** Mesmas regras e mensagens do cadastro (spec 5.2). */
export const validateProfileForm = (
  values: ProfileFormValues,
): ProfileFormErrors => {
  const errors: ProfileFormErrors = {};
  const firstName = validateName(values.firstName, 'nome');
  const lastName = validateName(values.lastName, 'sobrenome');
  if (firstName) errors.firstName = firstName;
  if (lastName) errors.lastName = lastName;
  return errors;
};

/** Houve mudança real (ignora espaços nas pontas)? */
export const hasProfileChanges = (
  saved: ProfileFormValues,
  current: ProfileFormValues,
): boolean =>
  current.firstName.trim() !== saved.firstName.trim() ||
  current.lastName.trim() !== saved.lastName.trim();

export const DELETE_STRINGS = {
  title: 'Excluir conta',
  headline: 'Sua conta será desativada.',
  hiddenProfile:
    'Seu perfil deixa de aparecer. Seu nome e e-mail ficam ocultos para outras pessoas.',
  averages: 'As notas das suas avaliações continuam contando na média dos picos.',
  reactivate:
    'Você pode reativar a conta quando quiser: é só entrar de novo com seu e-mail e senha.',
  password: 'Senha',
  passwordHint: 'Digite sua senha para confirmar.',
  emptyPassword: 'Informe sua senha para continuar.',
  submit: 'Excluir conta',
  cancel: 'Cancelar',
  dangerText:
    'Sua conta será desativada. Você pode reativá-la entrando de novo com seu e-mail e senha.',
} as const;

/**
 * Item "picos e avaliações continuam..." (spec 7.2). Com contagens cita só o que
 * existe (singular correto); ambas zero omite (null); sem contagens, texto genérico.
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
