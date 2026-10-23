import { gql } from '@apollo/client';

const PROFILE_FIELDS = `
  id
  name
  firstName
  lastName
  email
  createdAt
  spotsCount
  reviewsCount
`;

export const meQuery = gql`
  query Me {
    me {
      ${PROFILE_FIELDS}
    }
  }
`;

export const changePasswordMutation = gql`
  mutation ChangePassword($props: ChangePasswordInput!) {
    changePassword(props: $props) {
      message
    }
  }
`;

export const updateProfileMutation = gql`
  mutation UpdateProfile($props: UpdateProfileInput!) {
    updateProfile(props: $props) {
      ${PROFILE_FIELDS}
    }
  }
`;
