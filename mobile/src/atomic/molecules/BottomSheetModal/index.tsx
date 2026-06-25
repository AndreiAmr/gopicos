import React from 'react';

import * as S from './styles';

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

type BottomSheetModalProps = {
  title: string;
  description: string;
  icon?: string;
  onClose?: () => void;
};

export const BottomSheetModal = React.forwardRef<
  GorhomBottomSheetModal,
  BottomSheetModalProps
>(({ title, description, icon: _icon, onClose }, ref) => {
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
      // snapPoints={snapPoints}
      onDismiss={onClose}
      enableDismissOnClose
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView>
        <S.Container>
          <Text family="bold" size="lg" mb="sm">
            {title}
          </Text>
          <Text family="regular" size="md" mb="lg">
            {description}
          </Text>
          <Button label="Entendi!" onPress={onClose} />
        </S.Container>
      </BottomSheetView>
    </GorhomBottomSheetModal>
  );
});

BottomSheetModal.displayName = 'BottomSheetModal';
