import React from 'react';
import { View } from 'tamagui';
import Lottie from 'lottie-react-native';
import LoadingAnimation from '../../assets/animations/skateboarder-loading.json';

export const LoaderScreen = () => {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Lottie
        source={LoadingAnimation}
        autoPlay
        loop
        style={{ width: '100%', height: '30%' }}
      />
    </View>
  );
};
