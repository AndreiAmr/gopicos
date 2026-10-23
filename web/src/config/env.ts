/**
 * Endereço do backend, resolvido em tempo de build pelo Vite.
 *
 * `VITE_*` é embutido no bundle durante o `vite build`, então trocar a URL exige
 * um novo build — não dá para alterar em runtime. O fallback aponta para o
 * backend local do docker-compose para não quebrar o desenvolvimento.
 */
const DEFAULT_API_URL = 'http://localhost:4000';

/** Base da API REST (ex.: `http://host:4000`). Sem barra no final. */
export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '');

/** Endpoint GraphQL, derivado da mesma base para não haver duas fontes. */
export const GRAPHQL_URL = `${API_URL}/graphql`;
