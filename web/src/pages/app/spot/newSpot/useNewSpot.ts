import { ICreateSpot } from '@/pages/_layouts/NewSpotLayout';

import { useFormContext } from 'react-hook-form';

export const useNewSpot = () => {
  const { watch } = useFormContext<ICreateSpot>();
  const currentStep = watch('currentStep');

  return {
    currentStep,
  };
};
