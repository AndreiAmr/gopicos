import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useImagePreview } from './useImagePreview';
import { Plus } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

export const ImagePreview = () => {
  const { handleSelectImage, images, handleRemoveImage, hasReachedLimit } =
    useImagePreview();

  if (!images.length) {
    return <ImagePlaceholder onAdd={handleSelectImage} />;
  }

  return (
    <div className="flex-1  mt-6 max-w-[97%]">
      <div className="pl-9">
        <Carousel>
          <CarouselContent>
            {images.map((item) => (
              <CarouselItem
                className=" sm:basis-1/2 md:basis-1/3  relative h-80"
                key={item.url}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={item.url}
                    layout
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    exit={{ opacity: 0 }}
                    className="aspect-square"
                  >
                    xm
                    <Image
                      src={item.url}
                      alt="image"
                      width={300}
                      height={300}
                      className="object-contain rounded-xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext variant="ghost" />
          <CarouselPrevious />
        </Carousel>
      </div>

      <div className="my-6">
        <span className="">{images.length}/8 images selecionadas</span>
        <div className="flex gap-3 ">
          {images.map((image) => (
            <div
              className="relative h-10 w-15 rounded-sm overflow-hidden hover:bg-red-100/20"
              key={image.name}
              onClick={() => handleRemoveImage(image.name)}
            >
              <Image fill src={image.url} alt="imagem" />
              <div className="absolute top-0 left-0 right-0 bottom-0 hover:bg-red-50/50"></div>
            </div>
          ))}

          <Button
            className="relative h-10 cursor-pointer"
            disabled={hasReachedLimit}
            variant="outline"
          >
            <Plus />
            <input
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 h-full w-full bg-red-100 opacity-0 cursor-pointer"
              onChange={handleSelectImage}
              multiple
              placeholder=""
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
