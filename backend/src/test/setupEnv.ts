import { getTestDatabaseUrl, TEST_JWT_SECRET } from './config';

// Roda antes de cada arquivo de teste, antes de qualquer import do Prisma Client.
process.env.DATABASE_URL = getTestDatabaseUrl();
process.env.JWT_SECRET = TEST_JWT_SECRET;
