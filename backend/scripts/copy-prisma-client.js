// O tsc não emite os arquivos .js/.node do Prisma Client (gerados em src/prisma/generated).
// Copiamos para dist/ para que `node dist/graphql/graphql.js` encontre `./generated`.
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../src/prisma/generated');
const target = path.resolve(__dirname, '../dist/prisma/generated');

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log(`Prisma Client copiado para ${target}`);
