import { Plus } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as S from './styles';
import { Map } from '../../../components/Map';
import {
  AlertBanner,
  EmptyState,
  SpotPreview,
  Text,
} from '../../../atomic/ds';
import {
  elevation,
  radius,
  space,
  zIndex,
} from '../../../config/tamagui/tokens';
import { homeStrings, useHome } from './useHome';

export const HomeTemplate = () => {
  const theme = useTheme();
  const home = useHome();

  return (
    <S.Container>
      <Map
        spots={home.spots}
        selectedId={home.selectedId}
        onSelectSpot={home.select}
        onMapPress={home.clearSelection}
        onUserLocation={home.setUserPosition}
      />

      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <View
          paddingHorizontal={space[4]}
          paddingTop={space[2]}
          gap={space[2]}
          zIndex={zIndex.header}
          pointerEvents="box-none"
        >
          {home.loading ? (
            <View
              alignSelf="flex-start"
              paddingHorizontal={space[3]}
              paddingVertical={space[2]}
              borderRadius={radius.full}
              backgroundColor="$surface"
              {...elevation[1]}
              accessibilityLiveRegion="polite"
              testID="home-loading"
            >
              <Text variant="caption">{homeStrings.loading}</Text>
            </View>
          ) : null}
          {home.hasError ? (
            <AlertBanner
              type="error"
              message={homeStrings.error}
              actionLabel="Tentar novamente"
              onActionPress={home.retry}
              testID="home-error"
            />
          ) : null}
        </View>
      </SafeAreaView>

      <View
        position="absolute"
        right={space[4]}
        bottom={home.selected ? 220 : space[6]}
        width={56}
        height={56}
        borderRadius={radius.full}
        backgroundColor="$primary"
        alignItems="center"
        justifyContent="center"
        zIndex={zIndex.mapControls}
        pressStyle={{ backgroundColor: '$primaryHover', scale: 0.96 }}
        onPress={home.createSpot}
        accessible
        accessibilityRole="button"
        accessibilityLabel={homeStrings.createSpot}
        testID="home-fab"
        {...elevation[2]}
      >
        <Plus size={28} color={theme.onPrimary.val} />
      </View>

      {home.selected ? (
        <View
          position="absolute"
          left={space[4]}
          right={space[4]}
          bottom={space[4]}
          zIndex={zIndex.sheet}
        >
          <SpotPreview
            spot={home.selected}
            distanceLabel={home.distanceLabel}
            onViewDetails={home.openDetails}
          />
        </View>
      ) : null}

      {home.isEmpty && !home.selected ? (
        <View
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$surface"
          borderTopLeftRadius={radius.xl}
          borderTopRightRadius={radius.xl}
          zIndex={zIndex.sheet}
          {...elevation[3]}
          testID="home-empty"
        >
          <EmptyState
            title={homeStrings.emptyTitle}
            description={homeStrings.emptyDescription}
            actionLabel={homeStrings.emptyAction}
            onActionPress={home.createSpot}
          />
        </View>
      ) : null}
    </S.Container>
  );
};
