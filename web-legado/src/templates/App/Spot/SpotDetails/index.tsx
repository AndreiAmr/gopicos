import { ImagePreview } from '@/atomic/atoms/ImagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import SpotIntroduction from './SpotIntroduction';
import SpotLocation from './SpotLocation';
import Review from './Review';
import SpotReviews from './SpotReviews';
import { fetchSpotDetails } from '@/repository/spot/spotDetails.respository';

export const SpotDetailsTemplate = async ({ id }: { id: string }) => {
  const test = await fetchSpotDetails(id);

  // const imageUrl = images[0];

  return (
    <div className="h-full w-full overflow-y-scroll overflow-x-hidden">
      {/* <SpotIntroduction
        name={name}
        description={description}
        imgUrl={imageUrl}
      />

      <div className=" z-1 w-full bg-background mt-4 mb-10 flex flex-col gap-2">
        <Card className="mx-10">
          <CardHeader>
            <CardTitle>Galeria de fotos</CardTitle>
          </CardHeader>

          <CardContent className="flex gap-2 flex-wrap">
            {images.map((url) => (
              <ImagePreview url={url} key={url} />
            ))}
          </CardContent>
        </Card>

        <SpotLocation coordinates={coordinates} markingType={markingType} />
        <Review />
        <SpotReviews reviews={reviews} /> */}
      {/* </div> */}
    </div>
  );
};
