import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
