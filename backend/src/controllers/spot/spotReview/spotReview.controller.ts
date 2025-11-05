import { spotReviewService } from '../../../services/spot/spotReview/spotReview.service';

type SpotReviewControllerProps = {
  title: string;
  description: string;
  authorId: string;
  spotId: string;
};

export const spotReviewController = async (
  props: SpotReviewControllerProps
) => {
  const result = await spotReviewService(props);

  if (!result) {
    throw new Error('Erro ao salvar review');
  }

  return result;
};
