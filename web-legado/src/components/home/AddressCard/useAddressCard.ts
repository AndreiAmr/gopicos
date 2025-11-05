import { useCallback, useState } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';

export const useAddressCard = () => {
  const [places, setPlaces] = useState<PlaceProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAddressDialogOpen, setIsAddressDialogOpen] =
    useState<boolean>(false);

  const { getValues, watch } = useFormContext<NewSpotProps>();

  const addressValues = watch('address');

  // const debouncedSearchRef = useRef(
  //   _.debounce(async (placeValue: string) => {
  //     try {
  //       const result = await fetch(
  //         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
  //           placeValue
  //         )}&accept-language=pt-BR`
  //       );
  //       const data = await result.json();
  //       console.log('🚀 ~ _.debounce ~ data:', data);

  //       const placesResults = data.map((item) => {
  //         const nameSplited = item.display_name.split(',');
  //         const name = `${nameSplited[0]}${
  //           nameSplited[1] ? ', ' + nameSplited[1] : ''
  //         }`;

  //         const coordinates = {
  //           lat: Number(item.lat),
  //           long: Number(item.lon),
  //         };

  //         return {
  //           name,
  //           coordinates,
  //         };
  //       });

  //       setPlaces(placesResults);
  //     } catch (err) {
  //       return err;
  //     }
  //   }, 1000)
  // );

  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `https://nominatim.openstreetmap.org/search?&format=json&addressdetails=1&q=${encodeURIComponent(
          getValues().streetSearch
        )}&accept-language=pt-BR`
      );

      const data = (await result.json()) as NominatimResultProps[];

      const newList = data.map((item) => {
        const name = item.name;
        const country = item.address.country;
        const state = item.address.state;
        const displayName = `${name}, ${state}, ${country}`;
        const uniqDisplayName = item.display_name;
        const postcode = item.address.postcode;

        const coordinates = {
          lat: Number(item.lat),
          lng: Number(item.lon),
        };

        return {
          displayName,
          name,
          country,
          state,
          coordinates,
          uniqDisplayName,
          postcode,
          lat: Number(item.lat),
          lng: Number(item.lon),
        };
      });

      setPlaces(_.uniqBy(newList, 'name'));

      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, [getValues]);

  return {
    addressValues,
    places,
    isAddressDialogOpen,
    setIsAddressDialogOpen,
    handleSearch,
    isLoading,
  };
};
