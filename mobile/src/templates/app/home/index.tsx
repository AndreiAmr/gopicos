import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as S from './styles';
import { Map } from '../../../components/Map';
import {
  AlertBanner,
  BottomSheet,
  SpotPreview,
  Text,
  useToast,
} from '../../../atomic/ds';
import {
  elevation,
  radius,
  space,
  zIndex,
} from '../../../config/tamagui/tokens';
import { isMapboxConfigured } from '../../../config/mapbox';
import { FilterBar } from './components/Filters/FilterBar';
import { FilterSheet } from './components/Filters/FilterSheet';
import { filterStrings } from '../../../domain/spot/filters';
import { homeStrings, useHome } from './useHome';

export const HomeTemplate = () => {
  const theme = useTheme();
  const home = useHome();
  const emptySheetRef = useRef<BottomSheetModal>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const toast = useToast();

  // Falha ao aplicar: o filtro anterior permanece e a pessoa pode tentar de novo.
  useEffect(() => {
    if (!home.applyFailed) return;
    toast.show({
      type: 'error',
      message: filterStrings.applyError,
      actionLabel: filterStrings.retry,
      onActionPress: () => filterSheetRef.current?.present(),
    });
    home.dismissApplyFailed();
  }, [home, toast]);

  // O vazio é um estado persistente da Home, não um evento: abre ao aparecer
  // e volta a abrir se o vazio reaparecer depois de fechado por gesto.
  useEffect(() => {
    if (home.isEmpty && !home.selected && home.emptySheetOpen) {
      emptySheetRef.current?.present();
    }
  }, [home.isEmpty, home.selected, home.emptySheetOpen]);

  // Ao sair do vazio (ex.: "Limpar filtros"), o sheet do vazio se fecha.
  useEffect(() => {
    if (!home.isEmpty) {
      emptySheetRef.current?.dismiss();
    }
  }, [home.isEmpty]);

  // Sem pico selecionado o resumo some; o sheet do vazio não deve reaparecer
  // por cima do detalhe enquanto ele estiver aberto.
  useEffect(() => {
    if (home.selected) {
      emptySheetRef.current?.dismiss();
    }
  }, [home.selected]);

  return (
    <S.Container>
      {isMapboxConfigured ? (
        <Map
          spots={home.spots}
          selectedId={home.selectedId}
          onSelectSpot={home.select}
          onMapPress={home.clearSelection}
          onUserLocation={home.setUserPosition}
        />
      ) : null}

      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <View
          paddingHorizontal={space[4]}
          paddingTop={space[2]}
          gap={space[2]}
          zIndex={zIndex.header}
          pointerEvents="box-none"
        >
          <FilterBar
            filters={home.filters}
            onOpen={() => filterSheetRef.current?.present()}
            onChange={home.applyFilters}
          />
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
          {!isMapboxConfigured ? (
            <AlertBanner
              type="error"
              message={homeStrings.mapError}
              testID="home-map-error"
            />
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

      <BottomSheet
        ref={emptySheetRef}
        withBackdrop={false}
        title={
          home.filtersActive
            ? homeStrings.filteredEmptyTitle
            : homeStrings.emptyTitle
        }
        description={
          home.filtersActive
            ? homeStrings.filteredEmptyDescription
            : homeStrings.emptyDescription
        }
        primaryLabel={
          home.filtersActive
            ? homeStrings.filteredEmptyAction
            : homeStrings.emptyAction
        }
        onPrimaryPress={
          home.filtersActive ? home.clearFilters : home.createSpot
        }
        onClose={home.dismissEmptySheet}
      />

      <FilterSheet
        ref={filterSheetRef}
        filters={home.filters}
        applying={home.applying}
        onApply={home.applyFilters}
      />
    </S.Container>
  );
};
