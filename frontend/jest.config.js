module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/__tests__/**/?(*.)+(spec|test).{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      }
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^jspdf$': '<rootDir>/__mocks__/jspdf.js'
  },
  testEnvironment: 'jsdom'
};
