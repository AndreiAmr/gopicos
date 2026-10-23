/** E-mail é comparado sem diferenciar maiúsculas/minúsculas: guardamos e buscamos sempre normalizado. */
export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();
