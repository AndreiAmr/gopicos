import { useMemo } from 'react';
import { useLocation } from 'react-router';

const placeSearchValidPaths = ['/spot/new-spot', '/home'];

export const useHeader = () => {
  const navigation = useLocation();

  const showPlaceSearch = useMemo(() => {
    return placeSearchValidPaths.includes(navigation.pathname);
  }, [navigation.pathname]);

  return {
    showPlaceSearch,
  };
};
