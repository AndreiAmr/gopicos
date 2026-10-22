import React from 'react';
import { LocateFixed } from 'lucide-react-native';
import { Button } from 'tamagui';

type LocateButtonProps = {
  onPress: () => void;
};

export const LocateButton = ({ onPress }: LocateButtonProps) => {
  return (
    <Button
      icon={<LocateFixed size={20} color="#000" />}
      width={48}
      height={48}
      circular
      backgroundColor="#ffffff"
      position="absolute"
      bottom={184}
      right={16}
      onPress={onPress}
    />
  );
};
