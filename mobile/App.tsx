import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/constants/theme';
import { Navigation } from './src/routes';
import { ApolloClientProvider } from './src/providers/ApolloClient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <BottomSheetModalProvider>
            <ApolloClientProvider>
              <Navigation />
            </ApolloClientProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
