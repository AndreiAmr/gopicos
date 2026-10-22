import { View } from 'tamagui';
import { EmptyState } from '../../../../atomic/ds/molecules/EmptyState';

/** Placeholder do passo 2 (detalhes e fotos); a tela real vem na issue #42. */
export const NewSpotDetailsTemplate = () => (
  <View flex={1} justifyContent="center" backgroundColor="$bg">
    <EmptyState title="Detalhes do pico" description="Em breve." />
  </View>
);
