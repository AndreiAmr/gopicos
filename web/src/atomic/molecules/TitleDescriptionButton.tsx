import { Button } from '@/components/ui/button';
import { ChevronRightCircle } from 'lucide-react';
import React from 'react';

type TitleDescriptionButtonProps = {
  title: string;
  description?: string;
  onClick(): void;
};

const TitleDescriptionButton = ({
  title,
  description,
  onClick,
}: TitleDescriptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-md flex justify-between  rounded-sm p-7"
      variant="ghost"
    >
      <div className="flex flex-col items-start gap-0 ">
        <h2 className="text-sm font-bold">{title}</h2>
        <p className="text-xs"> {description}</p>
      </div>
      <ChevronRightCircle />
    </Button>
  );
};

export default TitleDescriptionButton;
