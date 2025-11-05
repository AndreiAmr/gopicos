type ReviewProps = {
  title: string;
  description: string;
  author: {
    name: string;
  };
};

type SpotProps = {
  id: string;
  name: string;
  description: string;
  coordinates: number[] | number[][][];
  markingType: MarkingType;
  images: string[];
  modality?: EModality;
  equipmentRequired: boolean;
  isPaid: boolean;
  entryAmount?: string;
  alwaysOpen: boolean;
  openingHours?: string;
  hasCoverage?: string;
  boundingBox?: number[];
  reviews: ReviewProps[];
};
