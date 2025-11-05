import {
  ImageProps,
  Orientation,
} from '@/store/spot/modules/createSpot/createSpotTypes';

import { ChangeEvent, useCallback, useState } from 'react';

const MAX_IMAGES_AMOUNT = 8;

export const useImagesSelect = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleSelectImages = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files: selectedFiles } = event.target;

      if (images?.length === 8 || !selectedFiles) return;

      const previews: ImageProps[] = [];
      const newFiles: File[] = [];

      Array.from(selectedFiles).forEach((item) => {
        const url = URL.createObjectURL(item);
        const image = new Image();

        image.onload = () => {
          const orientation: Orientation =
            image.naturalWidth > image.naturalHeight
              ? 'landscape'
              : image.naturalWidth < image.naturalHeight
                ? 'portrait'
                : 'square';

          previews.push({
            url,
            orientation,
            fileName: item.name,
            type: item.type,
          });

          newFiles.push(item);

          if (previews.length !== selectedFiles.length) return;

          if (images?.length) {
            const amountRemaning = MAX_IMAGES_AMOUNT - images.length;
            const imagesToAdd = previews.slice(0, amountRemaning);
            const filesToAdd = newFiles.slice(0, amountRemaning);

            setImages([...images, ...imagesToAdd]);
            setFiles([...files, ...filesToAdd]);
            return;
          }

          setImages(previews);
          setFiles(newFiles);
        };
        image.src = url;
      });
    },
    [images, files],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const filteredImages = images?.filter(
        (_, imgIndex) => imgIndex !== index,
      );
      const filteredFiles = files.filter((_, imgIndex) => imgIndex !== index);
      setImages(filteredImages);
      setFiles(filteredFiles);
    },
    [images, files],
  );

  return {
    images,
    files,
    handleSelectImages,
    handleRemoveImage,
  };
};
