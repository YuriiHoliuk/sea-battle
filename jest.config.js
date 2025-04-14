export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^uuid$': 'uuid',
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'shared/src/**/*.ts',
    'server/src/**/*.ts',
    'client/*/src/**/*.ts?(x)',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
