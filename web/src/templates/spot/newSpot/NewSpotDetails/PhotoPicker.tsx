import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlusIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PHOTO_LIMITS, photoCounter } from '@/domain/spot/newSpotForm';

type PhotoPickerProps = {
  photos: File[];
  error?: string;
  disabled?: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

/** Seletor de fotos com arrastar-e-soltar; a primeira miniatura é a capa. */
export const PhotoPicker = ({
  photos,
  error,
  disabled,
  onAdd,
  onRemove,
}: PhotoPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const previews = useMemo(
    () => photos.map((photo) => URL.createObjectURL(photo)),
    [photos],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  return (
    <div className="flex flex-col gap-2">
      <span id="spot-photos-label" className="text-body-sm font-semibold text-gp-text">
        Fotos (1 a 5, até 5 MB cada)
      </span>

      <button
        type="button"
        id="spot-photos"
        aria-labelledby="spot-photos-label"
        aria-describedby={error ? 'spot-photos-error' : undefined}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) onAdd(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          'flex h-30 w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-gp-border bg-gp-surface px-4 text-center outline-none transition-colors',
          'hover:bg-gp-sunken focus-visible:ring-2 focus-visible:ring-gp-focus disabled:opacity-40',
          dragging && 'border-gp-primary bg-gp-sunken',
          error && 'border-gp-error',
        )}
      >
        <ImagePlusIcon className="size-6 text-gp-text-muted" aria-hidden="true" />
        <span className="text-body-sm text-gp-text">
          Arraste as fotos aqui ou escolha no computador
        </span>
        <span className="text-caption text-gp-text-muted">
          {photoCounter(photos.length)}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        data-testid="photo-input"
        onChange={(event) => {
          onAdd(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />

      {error ? (
        <p id="spot-photos-error" role="alert" className="text-caption text-gp-error">
          {error}
        </p>
      ) : null}

      {photos.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <li
              key={`${photo.name}-${photo.lastModified}-${index}`}
              className="relative aspect-square overflow-hidden rounded-md border border-gp-divider"
            >
              <img
                src={previews[index]}
                alt={`Foto ${index + 1}: ${photo.name}`}
                className="size-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute bottom-1 left-1 rounded-sm bg-gp-primary px-1.5 py-0.5 text-caption font-semibold text-gp-on-primary">
                  Capa
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remover foto ${index + 1}`}
                disabled={disabled}
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 inline-flex size-8 items-center justify-center rounded-full bg-gp-surface text-gp-text shadow-1 outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {photos.length >= PHOTO_LIMITS.max ? (
        <p className="text-caption text-gp-text-muted">Limite de fotos atingido.</p>
      ) : null}
    </div>
  );
};
