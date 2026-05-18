import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};

export default config;
