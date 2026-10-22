import { prisma } from '../prisma/prisma';

/** Remove todos os dados (mantém o schema e a tabela de migrations). */
export const resetDatabase = async () => {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;

  if (tables.length === 0) return;

  const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`,
  );
};

/**
 * Chame no topo de um arquivo de teste de integração: limpa o banco
 * antes de cada teste e fecha a conexão ao final.
 */
export const useTestDatabase = () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
};

export { prisma };
