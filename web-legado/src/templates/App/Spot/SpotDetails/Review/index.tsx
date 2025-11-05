'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import React, { useState } from 'react';

const Review = () => {
  const [stars, setStars] = useState<number>(0);

  return (
    <Card className="mx-10">
      <CardHeader>
        <CardTitle>Deixe sua avalição</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-8 md:flex-row">
        <div className="flex flex-col justify-start items-center">
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarImage src={''} className="object-contain rounded-full" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <h2 className="font-medium">Andrei Amaral</h2>
          <div className="flex">
            {new Array(5).fill('').map((_, index) => (
              <Star
                key={index}
                className={cn(
                  'text-white',
                  stars >= index + 1 ? 'fill-amber-300' : 'fill-amber-200'
                )}
                onClick={() => setStars(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Input placeholder="Título" className="shadow-md" />
          <Textarea
            placeholder="Registre aqui sua avaliação"
            className="resize-none shadow-md h-30"
          />
          <Button className="w-30 mt-3">Enviar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Review;
