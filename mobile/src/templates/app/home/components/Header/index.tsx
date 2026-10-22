import { View } from 'tamagui';
import { FilterInfo } from './FilterInfo';
import { Filter, Mountain } from 'lucide-react-native';
import { useSelector } from 'react-redux';

import { allSpotsSelectors } from '../../../../../store/spots/allSpots/allSpotsSlice';

export const Header = () => {
  const spotsAmount = useSelector(allSpotsSelectors.getSpotsAmount);

  return (
    <View
      bg="$backgroundHover"
      flexDirection="row"
      borderColor="#f00"
      height={90}
      marginEnd={200}
      marginInline={17}
      borderRadius={10}
      boxShadow="0 8px 10px -1px $shadowColor"
      alignItems="center"
      justifyContent="space-evenly"
      paddingLeft={6}
      paddingRight={6}
    >
      <FilterInfo
        numberHighlight={spotsAmount}
        description="picos encontrados"
        Icon={Mountain}
        variant="orange"
        fillIcon
      />
      <View borderWidth={0.5} height="35%" borderColor="$accent11" />
      <FilterInfo
        numberHighlight={0}
        description="filtros aplicados"
        Icon={Filter}
        variant="green"
      />
    </View>
  );
};
