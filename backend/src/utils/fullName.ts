/** Nome completo para exibição (sobrenome pode ser vazio em usuários migrados). */
export const fullName = (user: { firstName: string; lastName: string }): string =>
  `${user.firstName} ${user.lastName}`.trim();
