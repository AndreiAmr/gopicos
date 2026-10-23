import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { NewSpotLocationTemplate } from '../../newSpot/location';
import type { RootStackParamList } from '../../../../routes/types';

/** "Alterar local" da edição: o mesmo editor de polígono, já com o local atual. */
export const EditSpotLocationTemplate = () => {
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'EditSpotLocation'>>();

  return (
    <NewSpotLocationTemplate
      edit={{ id: params.id, coordinates: params.coordinates }}
    />
  );
};
