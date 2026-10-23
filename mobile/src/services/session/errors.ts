type GraphQLErrorLike = {
  type?: string;
  extensions?: { type?: unknown };
};

/** Algum erro GraphQL da resposta é `UNAUTHENTICATED`? */
export const isUnauthenticatedError = (error: unknown): boolean => {
  const errors = (error as { errors?: GraphQLErrorLike[] } | null)?.errors;
  if (!Array.isArray(errors)) return false;

  return errors.some(
    item =>
      item?.type === 'UNAUTHENTICATED' ||
      item?.extensions?.type === 'UNAUTHENTICATED',
  );
};
