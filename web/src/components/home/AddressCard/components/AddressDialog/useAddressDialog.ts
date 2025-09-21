import { useFormContext } from 'react-hook-form';

export const useAddressDialog = () => {
  const { setValue } = useFormContext<NewSpotProps>();

  const handleSelectPlace = ({
    name,
    lat,
    lng,
    country,
    state,
    postcode,
  }: PlaceProps) => {
    // setValue('address.lat', coordinates.lat);
    // setValue('address.lng', coordinates.lng);
    // setValue('address.street', name);
    // setValue('address.country', country);
    // setValue('address.state', state);

    setValue('address', {
      country,
      state,
      street: name,
      coordinates: [],
      lat,
      lng,
      postcode,
    });
  };

  return { handleSelectPlace };
};
