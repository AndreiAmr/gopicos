import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/constants/theme';
import { Navigation } from './src/routes';
import { navigationRef } from './src/routes/navigationRef';
import { ApolloClientProvider } from './src/providers/ApolloClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet, useColorScheme } from 'react-native';
import { config } from './src/config/tamagui/tamagui.config';
import { ToastProvider } from './src/atomic/ds';
import { initMapbox } from './src/config/mapbox';

// Antes de qualquer MapView.
initMapbox();

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function App() {
  // Tema claro/escuro segue o sistema (DS decisão D1).
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
        >
          <ThemeProvider theme={theme}>
            {/* Toast fora do provider dos sheets: aparece acima do véu dos modais. */}
            <ToastProvider>
              <BottomSheetModalProvider>
                <ApolloClientProvider>
                  <Navigation ref={navigationRef} />
                </ApolloClientProvider>
              </BottomSheetModalProvider>
            </ToastProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
