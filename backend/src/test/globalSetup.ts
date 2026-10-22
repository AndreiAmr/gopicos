import { execSync } from 'child_process';
import path from 'path';
import { getTestDatabaseUrl } from './config';

// Aplica as migrations no banco de teste uma única vez antes da suíte.
export default async function globalSetup() {
  const url = getTestDatabaseUrl();

  execSync('yarn prisma migrate deploy --schema=./src/prisma/schema.prisma', {
    cwd: path.resolve(__dirname, '../..'),
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'inherit',
  });
}
