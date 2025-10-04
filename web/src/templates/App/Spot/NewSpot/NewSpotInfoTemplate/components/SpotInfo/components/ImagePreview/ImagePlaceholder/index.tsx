import { Card } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { ChangeEvent } from 'react';

type ImagePlaceholderProps = {
  onAdd(event: ChangeEvent<HTMLInputElement>): void;
};

export const ImagePlaceholder = ({ onAdd }: ImagePlaceholderProps) => {
  return (
    <Card className="relative w-full h-full flex flex-col justify-center items-center gap-0 py-15 my-7 not-dark:bg-white dark:bg-input/30">
      <Image className="mb-5" size={30} />
      <h1 className="text-md text-muted-foreground">Selecione uma imagem</h1>
      <p className="text-foreground text-lg">
        Clique ou solte aqui a imagem desejada
      </p>
      <input
        type="file"
        className="absolute h-full w-full opacity-0"
        onChange={onAdd}
        multiple
        accept="image/*"
      />
    </Card>
  );
};
