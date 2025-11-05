import { ImagePlus, PlusIcon, Trash } from 'lucide-react';
import { useImagesSelect } from './useImagesSelect';
import { ChangeEvent, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Button } from '@/atomic/atoms/button';

type ErrorProp = {
  error?: string;
};

type PlaceholderProps = ErrorProp & {
  handleSelect(event: ChangeEvent<HTMLInputElement>): void;
};

type ImagesSelectProps = ErrorProp & {
  onFilesChange?: (files: File[]) => void;
};

export const Placeholder = ({ handleSelect, error }: PlaceholderProps) => {
  return (
    <div
      className={cn(
        'relative w-full flex flex-col items-center justify-center bg-white py-22 rounded-xl shadow text-gray-600',
        error && 'border border-destructive',
      )}
    >
      <ImagePlus />
      <h4 className="font-bold text-base">Adicionar Imagem</h4>
      <p className="text-xs">
        Clique aqui para adicionar até 8 imagens do local
      </p>
      <input
        type="file"
        className="absolute h-full w-full opacity-0 cursor-pointer"
        onChange={handleSelect}
        multiple
        accept="image/*"
        id="image-upload"
      />
    </div>
  );
};

export const ImagesSelect = ({ error, onFilesChange }: ImagesSelectProps) => {
  const { handleSelectImages, images, handleRemoveImage, files } =
    useImagesSelect();

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  return (
    <div className="mt-8 gap-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <label
          htmlFor="image-upload"
          className={cn('text-sm text-gray-700', error && 'text-red-500')}
        >
          Fotos ({images?.length || 0}/8)*
        </label>

        {images?.length && images.length < 8 && (
          <Button className="relative">
            <input
              type="file"
              className="absolute h-full w-full opacity-0 cursor-pointer"
              onChange={handleSelectImages}
              multiple
              accept="image/*"
              id="image-upload"
            />
            <PlusIcon /> Adicionar foto
          </Button>
        )}
      </div>

      {!images?.length && (
        <Placeholder handleSelect={handleSelectImages} error={error} />
      )}

      {!!images?.length && (
        <Carousel>
          <CarouselContent className="p-0 m-0 -ml-2">
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  ' group max-w-60 pl-2 flex justify-center items-center ',
                  index && '  ',
                )}
              >
                <div
                  className={` relative rounded-2xl overflow-hidden  ' ${
                    img.orientation === 'landscape'
                      ? 'aspect-video'
                      : 'aspect-[3/4] max-h-80'
                  }`}
                >
                  <img
                    style={{
                      imageOrientation: 'from-image',
                    }}
                    src={img.url}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <button
                    className="absolute p-2 top-0 right-0 opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-md text-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
