import createSpotSagas from './modules/createSpot/createSpotSagas';
import listSpotsSagas from './modules/listSpots/listSpotsSagas';

export const spotCombinedSagas = [...listSpotsSagas, ...createSpotSagas];
