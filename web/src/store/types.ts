import { AuthenticationState } from './authentication/authenticationTypes';
import { IProfileState } from './profile/profileTypes';
import { IReverseGeocodingState } from './reverseGeocoding/reverseGeocodingTypes';
import { ISearchPlaceState } from './searchPlace/searchPlaceTypes';
import { ISpotsState } from './spot/spotTypes';

export type ApplicationState = {
  Authentication: AuthenticationState;
  Profile: IProfileState;
  Spots: ISpotsState;
  SearchPlace: ISearchPlaceState;
  ReverseGeocoding: IReverseGeocodingState;
};
