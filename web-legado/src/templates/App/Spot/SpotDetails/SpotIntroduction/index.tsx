import { ChevronDown, Star } from 'lucide-react';
import React from 'react';

type SpotIntroductionProps = {
  name: string;
  description: string;
  imgUrl: string;
};

const SpotIntroduction = ({
  name,
  description,
  imgUrl,
}: SpotIntroductionProps) => {
  return (
    <div
      className="bg-fixed z-0 h-full w-full bg-cover  bg-top border border-black"
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <div className="relative bg-black/75 w-full h-full flex flex-col justify-center ">
        <div className="flex ml-11">
          {new Array(5).fill('').map((_, index) => (
            <Star key={index} className=" fill-amber-300" />
          ))}
        </div>
        <h1 className="text-muted text-4xl font-bold ml-12">{name}</h1>
        <p className="text-muted text-md max-w-4xl mt-3 ml-12">{description}</p>
        <div className="absolute bottom-0 w-full flex items-center justify-center ">
          <ChevronDown className="text-white left-auto " size="50px" />
        </div>
      </div>
    </div>
  );
};

export default SpotIntroduction;
