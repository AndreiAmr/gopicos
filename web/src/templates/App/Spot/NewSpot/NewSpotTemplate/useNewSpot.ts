import { useForm } from 'react-hook-form';

const defaultValues: NewSpotProps = {
  streetSearch: '',
  name: '',
  description: '',
  markingType: 'POLYGON',
  step: 1,
  address: {
    country: '',
    state: '',
    street: '',
    coordinates: [],
    lat: undefined,
    lng: undefined,
  },
  images: [],
  alwaysOpen: false,
  equipmentRequired: false,
  isPaid: false,
  modality: undefined,
  entryAmount: undefined,
  hasCoverage: undefined,
  openingHours: undefined,
};

export const useNewSpot = () => {
  const formMethods = useForm<NewSpotProps>({
    defaultValues,
  });
  const step = formMethods.watch('step');

  return {
    formMethods,

    step,
  };
};
