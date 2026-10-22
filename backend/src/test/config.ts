// Banco de teste isolado. Nunca usa o DATABASE_URL do .env local.
export const DEFAULT_TEST_DATABASE_URL =
  'postgresql://gp_test:gp_test@localhost:54329/gopicos_test?schema=public';

export const TEST_JWT_SECRET = 'test-secret';

export const getTestDatabaseUrl = (): string => {
  const url = process.env.TEST_DATABASE_URL || DEFAULT_TEST_DATABASE_URL;

  // Trava de segurança: só roda contra um database cujo nome termina em "_test".
  const dbName = new URL(url).pathname.replace(/^\//, '');
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `TEST_DATABASE_URL deve apontar para um database terminado em "_test" (recebido: "${dbName}")`,
    );
  }

  return url;
};
