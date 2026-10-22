import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTamagui, TamaguiProvider } from 'tamagui';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/constants/theme';
import { Navigation } from './src/routes';
import { ApolloClientProvider } from './src/providers/ApolloClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { config } from './src/config/tamagui/tamagui.config';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { navigationRef } from './src/routes/navigationRef';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const tamaguiConfig = createTamagui(config);

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
            <ThemeProvider theme={theme}>
              <BottomSheetModalProvider>
                <ApolloClientProvider>
                  <Navigation ref={navigationRef} />
                </ApolloClientProvider>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </TamaguiProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
