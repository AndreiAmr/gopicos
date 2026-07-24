import { View } from 'tamagui';
import { FilterInfo } from './FilterInfo';
import { Filter, Mountain } from 'lucide-react-native';

export const Header = () => {
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
      // gap={12}
      paddingLeft={6}
      paddingRight={6}
    >
      <FilterInfo
        numberHighlight={82}
        description="picos encontrados"
        Icon={Mountain}
        variant="orange"
        fillIcon
      />
      <View borderWidth={0.5} height="35%" borderColor="$accent11" />
      <FilterInfo
        numberHighlight={5}
        description="filtros aplicados"
        Icon={Filter}
        variant="green"
      />
    </View>
  );
};
