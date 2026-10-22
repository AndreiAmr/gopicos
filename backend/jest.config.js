/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // .ts antes de .js: há .js legados versionados ao lado dos .ts em database/repositories.
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  setupFiles: ['<rootDir>/src/test/setupEnv.ts'],
  // Todos os arquivos compartilham o mesmo banco: execução serial evita corrida na limpeza.
  maxWorkers: 1,
  testTimeout: 15000,
};
