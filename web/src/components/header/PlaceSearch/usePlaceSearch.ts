import { PlaceSearchValues } from '@/@types/placeSerach';
import { searchPlaceActions } from '@/store/searchPlace/searchPlaceActions';
import { searchPlaceSelectors } from '@/store/searchPlace/searchPlaceSelectors';
import { ISearchPlace } from '@/store/searchPlace/searchPlaceTypes';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

export const usePlaceSearch = () => {
  const [value, setValue] = useState<string>('');
  const { setValue: fcSetValue } = useFormContext<PlaceSearchValues>();

  const dispatch = useDispatch();
  const isLoading = useSelector(searchPlaceSelectors.getIsLoadingSearchPlace);
  const places = useSelector(searchPlaceSelectors.getSearchPlace);

  const handleSearch = useCallback(() => {
    dispatch(searchPlaceActions.getSearchPlaceAsync(value));
  }, [value, dispatch]);

  const handleClickPlaceItem = useCallback(
    (item: ISearchPlace) => {
      fcSetValue('currentPlace', item);
    },
    [fcSetValue]
  );

  return {
    value,
    setValue,
    handleSearch,
    isLoading,
    places,
    handleClickPlaceItem,
  };
};
