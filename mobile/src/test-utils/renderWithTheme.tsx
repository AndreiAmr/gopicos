import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import { config } from '../config/tamagui/tamagui.config';

/**
 * Renderiza um componente dentro do TamaguiProvider com o tema do GoPicos.
 * No RNTL v14 o `render` é assíncrono: use `await renderWithTheme(...)` e
 * consulte via `screen`.
 */
export const renderWithTheme = (
  ui: ReactElement,
  theme: 'light' | 'dark' = 'light',
) =>
  render(
    <TamaguiProvider config={config} defaultTheme={theme}>
      {ui}
    </TamaguiProvider>,
  );
