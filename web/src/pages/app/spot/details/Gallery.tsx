import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeftIcon, ChevronRightIcon, ImageOffIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Text } from '@/atomic/atoms/text';
import {
  galleryCounter,
  spotDetailsStrings,
  stepIndex,
} from '@/domain/spot/details';

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Foto com falha vira tile `sunken` com ação de recarregar (spec 5.3). */
const GalleryImage = ({ src, alt, className }: GalleryImageProps) => {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <button
        type="button"
        onClick={() => {
          setFailed(false);
          setAttempt((value) => value + 1);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-gp-sunken p-4 text-center text-gp-text-muted outline-none focus-visible:ring-2 focus-visible:ring-gp-focus',
          className,
        )}
      >
        <ImageOffIcon className="size-8" aria-hidden="true" />
        <Text variant="caption" tone="muted">
          {spotDetailsStrings.photoFailed}. Clique para tentar de novo.
        </Text>
      </button>
    );
  }

  return (
    <img
      key={attempt}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn('bg-gp-sunken object-cover', className)}
    />
  );
};

type GalleryProps = {
  images: string[];
  name: string;
};

/** Galeria: foto grande + miniaturas (>= 640), carrossel por swipe abaixo, lightbox no clique. */
export const Gallery = ({ images, name }: GalleryProps) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  if (total === 0) {
    return (
      <div
        data-testid="gallery-empty"
        className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg bg-gp-sunken text-gp-text-muted sm:h-105"
      >
        <ImageOffIcon className="size-8" aria-hidden="true" />
        <Text variant="body-sm" tone="muted">
          {spotDetailsStrings.noPhotos}
        </Text>
      </div>
    );
  }

  const alt = (position: number) => `${name}, foto ${position + 1} de ${total}`;

  return (
    <div className="flex flex-col gap-3" data-testid="gallery">
      {/* < 640: carrossel por swipe */}
      <div
        className="-mx-4 flex snap-x snap-mandatory overflow-x-auto sm:hidden"
        aria-label={`Fotos de ${name}`}
      >
        {images.map((src, position) => (
          <div key={src} className="relative w-full shrink-0 snap-center">
            <GalleryImage src={src} alt={alt(position)} className="h-64 w-full" />
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-caption text-white">
              {galleryCounter(position, total)}
            </span>
          </div>
        ))}
      </div>

      {/* >= 640: foto grande + miniaturas */}
      <div className="hidden sm:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Ampliar foto ${index + 1} de ${total}`}
          className="block w-full overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
        >
          <GalleryImage
            src={images[index]}
            alt={alt(index)}
            className="h-105 w-full"
          />
        </button>
        {total > 1 ? (
          <ul className="mt-3 flex gap-2 overflow-x-auto p-1" aria-label="Miniaturas">
            {images.map((src, position) => (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-label={`Ver foto ${position + 1} de ${total}`}
                  aria-current={position === index}
                  className={cn(
                    'block overflow-hidden rounded-md border-2 border-transparent outline-none focus-visible:ring-2 focus-visible:ring-gp-focus',
                    position === index && 'border-gp-primary',
                  )}
                >
                  <img src={src} alt="" className="h-16 w-22 bg-gp-sunken object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') setIndex((i) => stepIndex(i, total, 1));
              if (event.key === 'ArrowLeft') setIndex((i) => stepIndex(i, total, -1));
            }}
            className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          >
            <DialogPrimitive.Title className="sr-only">
              Fotos de {name}
            </DialogPrimitive.Title>
            <img
              src={images[index]}
              alt={alt(index)}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            <span
              className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-body-sm text-white"
              aria-live="polite"
            >
              {galleryCounter(index, total)}
            </span>
            {total > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => setIndex((i) => stepIndex(i, total, -1))}
                  className="absolute left-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Próxima foto"
                  onClick={() => setIndex((i) => stepIndex(i, total, 1))}
                  className="absolute right-4 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRightIcon aria-hidden="true" />
                </button>
              </>
            ) : null}
            <DialogPrimitive.Close
              aria-label="Fechar"
              className="absolute right-4 top-4 inline-flex size-12 items-center justify-center rounded-full bg-black/60 text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <XIcon aria-hidden="true" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};
