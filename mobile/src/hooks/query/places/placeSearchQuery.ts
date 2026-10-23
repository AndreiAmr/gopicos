import { gql, TypedDocumentNode } from '@apollo/client';
import type { Place } from '../../../domain/place/place';

export type PlaceSearchResult = { getFowardGeocoding: Array<Place | null> | null };

export const placeSearchQuery: TypedDocumentNode<
  PlaceSearchResult,
  { search: string }
> = gql`
  query GetFowardGeocoding($search: String!) {
    getFowardGeocoding(search: $search) {
      name
      lat
      lng
      road
      district
      suburb
      city
      state
      boundingBox
    }
  }
`;
