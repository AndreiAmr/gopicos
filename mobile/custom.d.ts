import 'styled-components/native';
import { theme } from './src/constants/theme';

type ThemeInterface = typeof theme;

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeInterface {}
}
