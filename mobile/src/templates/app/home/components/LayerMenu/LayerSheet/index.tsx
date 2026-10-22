import React from 'react';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Text } from '../../../../../../atomic/atoms/Text';
import * as S from './styles';
import { mapLayers, MapLayer } from '../constants';

type LayerSheetProps = {
  selectedLayer: MapLayer;
  onSelectLayer: (layer: MapLayer) => void;
};

export const LayerSheet = React.forwardRef<
  GorhomBottomSheetModal,
  LayerSheetProps
>(({ selectedLayer, onSelectLayer }, ref) => {
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.65}
      />
    ),
    [],
  );

  return (
    <GorhomBottomSheetModal
      ref={ref}
      enableDismissOnClose
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView>
        <S.Container>
          <Text family="bold" size="lg" mb="md">
            Camadas do mapa
          </Text>

          <S.LayerList>
            {mapLayers.map(layer => (
              <S.LayerOption
                key={layer.id}
                onPress={() => onSelectLayer(layer)}
              >
                <S.LayerThumbnail
                  selected={layer.id === selectedLayer.id}
                  source={layer.image}
                />
                <Text family="regular" size="md">
                  {layer.label}
                </Text>
              </S.LayerOption>
            ))}
          </S.LayerList>
        </S.Container>
      </BottomSheetView>
    </GorhomBottomSheetModal>
  );
});

LayerSheet.displayName = 'LayerSheet';
