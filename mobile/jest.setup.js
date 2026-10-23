/* eslint-env jest */
// Mocks globais para libs nativas usadas pelos componentes do DS.
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock'),
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// lucide-react-native publica ESM (.mjs) que o Jest não transforma; qualquer
// ícone vira um <View testID="icon-<Nome>" />.
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return new Proxy(
    {},
    {
      get: (_target, name) => {
        if (name === '__esModule') {
          return true;
        }
        const Icon = props =>
          React.createElement(View, {
            testID: `icon-${String(name)}`,
            ...props,
          });
        Icon.displayName = String(name);
        return Icon;
      },
    },
  );
});

// Persistência da camada do mapa (AsyncStorage) e permissão de localização.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
