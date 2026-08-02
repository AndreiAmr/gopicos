import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../../../prisma/prisma';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

async function main() {
  const sqlFilePath = path.join(__dirname, 'data.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');

  const commands = sql
    .split(';')
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  let lastTableName = '';

  for (const command of commands) {
    const tableName = command.split(' ')[2].split('.')[1];

    if (lastTableName !== tableName && tableName) {
      console.log(`🚀 Inserting in table: ${tableName}`);
    }
    await prisma.$executeRawUnsafe(command);
    if (tableName) {
      lastTableName = tableName;
    }
  }
}

(async () => {
  try {
    await main();
    await prisma.$disconnect();
    console.debug('✅ Populated database successfully');
  } catch (err) {
    console.error('❌ Error occurred while populating database', err);
  }
})();
