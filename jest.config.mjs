import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Load tsconfig.jest.json manually (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsconfigJest = JSON.parse(
  readFileSync(new URL('./tsconfig.jest.json', import.meta.url))
);

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.jest.json' }],
  },
  roots: ['<rootDir>/tests', '<rootDir>/prisma/generated/prisma'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfigJest.compilerOptions.paths ?? {}, {
    prefix: '<rootDir>/',
  }),
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.ts',
    '<rootDir>/tests/setupTextEncoder.ts',
  ],
  clearMocks: true,
  restoreMocks: true,
};
