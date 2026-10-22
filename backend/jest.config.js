/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  globalSetup: '<rootDir>/src/test/globalSetup.ts',
  setupFiles: ['<rootDir>/src/test/setupEnv.ts'],
  // Todos os arquivos compartilham o mesmo banco: execução serial evita corrida na limpeza.
  maxWorkers: 1,
  testTimeout: 15000,
};
