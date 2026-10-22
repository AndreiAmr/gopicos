import React, { useRef } from 'react';
import { Layers } from 'lucide-react-native';
import { Button } from 'tamagui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LayerSheet } from './LayerSheet';
import type { MapLayer } from './constants';

type LayerMenuProps = {
  selectedLayer: MapLayer;
  onSelectLayer: (layer: MapLayer) => void;
};

export const LayerMenu = ({ selectedLayer, onSelectLayer }: LayerMenuProps) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Button
        icon={<Layers size={20} color="#000" />}
        width={48}
        height={48}
        circular
        backgroundColor="#ffffff"
        position="absolute"
        bottom={120}
        right={16}
        onPress={() => sheetRef.current?.present()}
      />

      <LayerSheet
        ref={sheetRef}
        selectedLayer={selectedLayer}
        onSelectLayer={layer => {
          onSelectLayer(layer);
          sheetRef.current?.close();
        }}
      />
    </>
  );
};
