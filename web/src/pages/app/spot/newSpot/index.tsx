import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { useNewSpot } from './useNewSpot';

import { NewSpotMapTemplate } from '@/templates/spot/newSpot/NewSpotMap';
import { NewSpotDetailsTemplate } from '@/templates/spot/newSpot/NewSpotDetails';

export const NewSpot = () => {
  const { currentStep } = useNewSpot();

  if (currentStep) {
    return <NewSpotDetailsTemplate />;
  }
  return <NewSpotMapTemplate />;
};
