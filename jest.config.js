module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest-setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((@react-native|react-native)[^/]*)/)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/example/', '<rootDir>/lib/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
