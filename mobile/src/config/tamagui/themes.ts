import { defaultConfig } from '@tamagui/config/v5';
import { gpColors } from './tokens';

/**
 * Temas `light` e `dark` do GoPicos. Mantemos os temas padrão do
 * `@tamagui/config/v5` (as telas atuais usam `$orange10`, `$backgroundHover`...)
 * e acrescentamos as chaves semânticas do DS (`$bg`, `$surface`, `$primary`...)
 * em todos os temas e subtemas, escolhendo o modo pelo prefixo do nome.
 */
const defaultThemes = defaultConfig.themes as Record<
  string,
  Record<string, unknown>
>;

const withGoPicos = Object.fromEntries(
  Object.entries(defaultThemes).map(([name, theme]) => [
    name,
    { ...theme, ...(name.startsWith('dark') ? gpColors.dark : gpColors.light) },
  ]),
);

export const themes = withGoPicos as unknown as typeof defaultConfig.themes &
  Record<'light' | 'dark', typeof gpColors.light>;
