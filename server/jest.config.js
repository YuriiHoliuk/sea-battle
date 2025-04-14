export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@sea-battle/shared/(.*)$': '<rootDir>/../shared/$1',
    '^@sea-battle/server/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.ts', '<rootDir>/src/**/*.{spec,test}.ts'],
};
