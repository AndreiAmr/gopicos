import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import React from 'react';

type SpotReviewsProps = {
  reviews: ReviewProps[];
};

const SpotReviews = ({ reviews }: SpotReviewsProps) => {
  return (
    <Card className="mx-10">
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-8 ">
        {reviews.map((review) => {
          return (
            <div className="flex flex-1 gap-5" key={review.title}>
              <div className="flex flex-col">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage
                    src={
                      'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1759677281/a996c0af-96aa-4fc8-bb6a-dae4280904ea/fd4950be-7679-456a-9db1-8b99132d599d/file_ssxelf.jpg'
                    }
                  />
                </Avatar>
                <h2 className="font-medium">{review.author.name}</h2>
              </div>

              <div className="flex flex-col ">
                <h1 className="font-bold text-lg m-0">{review.title}</h1>
                <p className="font-normal text-sm m-0">{review.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SpotReviews;
