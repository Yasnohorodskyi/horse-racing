module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  testMatch: ['<rootDir>/tests/unit/**/*.spec.js'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
};
