import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTamagui, TamaguiProvider, View } from 'tamagui';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/constants/theme';
import { Navigation } from './src/routes';
import { ApolloClientProvider } from './src/providers/ApolloClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { defaultConfig } from '@tamagui/config/v5';
import { config } from './src/config/tamagui/tamagui.config';

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
        <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
          <ThemeProvider theme={theme}>
            <BottomSheetModalProvider>
              <ApolloClientProvider>
                <Navigation />
              </ApolloClientProvider>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
