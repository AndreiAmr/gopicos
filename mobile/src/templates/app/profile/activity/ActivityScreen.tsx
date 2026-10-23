import { ReactNode } from 'react';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { size, space } from '../../../../config/tamagui/tokens';
import { profileStrings } from '../logic';

// Altura da TabBar flutuante (60): a barra fica visível nas telas de lista.
const TAB_BAR_HEIGHT = 60;

type ActivityScreenProps = {
  title: string;
  /** Contagem no caption ("3 picos"); omitida enquanto não há dados. */
  caption?: string;
  refreshing: boolean;
  onRefresh: () => void;
  onBack: () => void;
  children: ReactNode;
};

/** Moldura das listas "Meus picos" e "Minhas avaliações": voltar, título, contagem e pull to refresh. */
export const ActivityScreen = ({
  title,
  caption,
  refreshing,
  onRefresh,
  onBack,
  children,
}: ActivityScreenProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View flex={1} backgroundColor="$bg">
      <View
        flexDirection="row"
        alignItems="center"
        gap={space[2]}
        paddingHorizontal={space[4]}
        paddingTop={insets.top + space[2]}
        paddingBottom={space[2]}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={profileStrings.back}
          hitSlop={8}
          style={{
            width: size.touch,
            height: size.touch,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={24} color={theme.text.val} />
        </Pressable>
        <View>
          <Text variant="h2" accessibilityRole="header">
            {title}
          </Text>
          {caption ? (
            <Text variant="caption" tone="muted">
              {caption}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: space[4],
          paddingTop: space[2],
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + space[6],
          gap: space[3],
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary.val}
          />
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};
