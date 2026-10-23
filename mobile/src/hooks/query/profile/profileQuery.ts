import { gql, TypedDocumentNode } from '@apollo/client';

export type Profile = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  spotsCount: number;
  reviewsCount: number;
};

export type ProfileQueryResult = {
  me: Profile | null;
};

export const profileQuery: TypedDocumentNode<ProfileQueryResult> = gql`
  query Profile {
    me {
      id
      name
      firstName
      lastName
      email
      createdAt
      spotsCount
      reviewsCount
    }
  }
`;
