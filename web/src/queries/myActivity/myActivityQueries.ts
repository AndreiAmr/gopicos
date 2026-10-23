import { gql, useQuery } from '@apollo/client';

import type { SpotSummary } from '@/domain/spot/spot';
import type { MyReview } from '@/pages/app/profile/activity/activityLogic';

export const MY_SPOTS_QUERY = gql`
  query MySpots {
    mySpots {
      id
      name
      modality
      images
      coordinates
      ratingAverage
      reviewsCount
    }
  }
`;

export const MY_REVIEWS_QUERY = gql`
  query MyReviews {
    myReviews {
      id
      rating
      description
      createdAt
      spot {
        id
        name
        modality
      }
    }
  }
`;

/** Lista completa (sem paginação no MVP, D31), da mais recente para a mais antiga. */
export const useMySpots = () => {
  const { data, loading, error, refetch } = useQuery<{
    mySpots: SpotSummary[] | null;
  }>(MY_SPOTS_QUERY, { fetchPolicy: 'cache-and-network' });

  return {
    spots: data?.mySpots ?? [],
    isLoading: loading && !data,
    isError: Boolean(error) && !data,
    retry: () => {
      refetch().catch(() => undefined);
    },
  };
};

export const useMyReviews = () => {
  const { data, loading, error, refetch } = useQuery<{
    myReviews: MyReview[] | null;
  }>(MY_REVIEWS_QUERY, { fetchPolicy: 'cache-and-network' });

  return {
    reviews: data?.myReviews ?? [],
    isLoading: loading && !data,
    isError: Boolean(error) && !data,
    retry: () => {
      refetch().catch(() => undefined);
    },
  };
};
