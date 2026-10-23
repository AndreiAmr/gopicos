const preset = require('@react-native/jest-preset');

// Pacotes ESM que precisam ser transformados pelo Babel no Jest.
const esmPackages = [
  '(jest-)?react-native',
  '@react-native(-community)?',
  'tamagui',
  '@tamagui',
  '@gorhom',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  'react-native-svg',
  'react-native-safe-area-context',
];

module.exports = {
  preset: '@react-native/jest-preset',
  // O preset define `setupFiles`; manter o dele e acrescentar o do projeto.
  setupFiles: [...preset.setupFiles, '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [`node_modules/(?!(${esmPackages.join('|')})/)`],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
