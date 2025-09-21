import mixpanel from 'mixpanel-browser';
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const useNewSpotMapControls = () => {
  const formMethods = useFormContext<NewSpotProps>();

  const markingType = formMethods.watch('markingType');

  const address = formMethods.watch('address');

  const currentCoordinates = useMemo(() => address.coordinates, [address]);

  const handleTrash = useCallback(() => {
    formMethods.setValue('address.coordinates', []);
  }, [formMethods]);

  const handleRedo = useCallback(() => {
    mixpanel.track(`Clicked Redo polygon step`);

    if (markingType !== 'POLYGON') return;

    const arrayToSort = currentCoordinates[0] as number[][];

    if (arrayToSort) {
      const allWhitoutLastOne = arrayToSort.filter((_, index, array) => {
        const isLastIndex = index === array.length - 1;

        return !isLastIndex;
      });

      formMethods.setValue('address.coordinates', [allWhitoutLastOne]);
    }
  }, [currentCoordinates, formMethods, markingType]);

  const handleChangeMarkingType = useCallback(
    (type: MarkingType) => {
      formMethods.setValue('markingType', type);

      formMethods.setValue('address.coordinates', []);
      mixpanel.track(`New spot -> Changed marking type for: ${type}`);
    },
    [formMethods]
  );

  return {
    markingType,
    handleRedo,
    handleTrash,
    handleChangeMarkingType,
  };
};
