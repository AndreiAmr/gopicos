import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, View } from 'tamagui';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/constants/theme';
import { Navigation } from './src/routes';
import { navigationRef } from './src/routes/navigationRef';
import { ApolloClientProvider } from './src/providers/ApolloClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet, useColorScheme } from 'react-native';
import { config } from './src/config/tamagui/tamagui.config';
import { Loader, ToastProvider } from './src/atomic/ds';
import { initMapbox } from './src/config/mapbox';
import { useSessionBootstrap } from './src/services/session/useSessionBootstrap';
import { expireSession } from './src/services/session/expiration';
import { apolloClient, setUnauthenticatedHandler } from './src/config/apollo';

// Antes de qualquer MapView.
initMapbox();

// Guard de rotas (GP-024): sessão recusada em qualquer tela protegida apaga o
// token do Keychain e volta ao Login.
setUnauthenticatedHandler(() => {
  expireSession(() => apolloClient.clearStore()).catch(() => undefined);
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

// Sessão válida no Keychain: abre direto na Home, sem passar pelo Login.
const AUTHENTICATED_STATE = { routes: [{ name: 'Home' as const }] };

/** Navegação só depois de ler a sessão, para não piscar o Login. */
const AppNavigation = () => {
  const session = useSessionBootstrap();

  if (session.status === 'loading') {
    return (
      <View flex={1} backgroundColor="$bg" justifyContent="center">
        <Loader testID="session-bootstrap-loader" />
      </View>
    );
  }

  return (
    <Navigation
      ref={navigationRef}
      initialState={session.authenticated ? AUTHENTICATED_STATE : undefined}
    />
  );
};

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
                  <AppNavigation />
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
