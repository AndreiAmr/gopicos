import { View } from 'tamagui';
import { EmptyState } from '../../../atomic/ds';

/** Placeholder do detalhe do pico; a tela real vem na issue #37. */
export const SpotDetailsTemplate = () => (
  <View flex={1} justifyContent="center" backgroundColor="$bg">
    <EmptyState title="Detalhe do pico" description="Em breve." />
  </View>
);
