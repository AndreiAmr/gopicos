import * as React from 'react';
import { ImageOffIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Text } from '@/atomic/atoms/text';
import { Skeleton } from '@/atomic/atoms/skeleton';
import { StarRating } from '@/atomic/molecules/starRating';
import {
  cardA11yLabel,
  modalityLabel,
  ratingText,
  type SpotSummary,
} from '@/domain/spot/spot';

type SpotCardProps = {
  spot: SpotSummary;
  className?: string;
  /** Conteúdo extra abaixo das informações (ex.: distância e botão). */
  footer?: React.ReactNode;
};

/** Card compacto de pico (DS: SpotCard): foto, nome, modalidade e nota. */
function SpotCard({ spot, className, footer }: SpotCardProps) {
  const photo = spot.images?.find(Boolean) ?? null;
  const hasRating = spot.reviewsCount > 0 && spot.ratingAverage != null;

  return (
    <div
      data-slot="spot-card"
      role="group"
      aria-label={cardA11yLabel(spot)}
      className={cn(
        'flex min-h-24 flex-col gap-3 rounded-lg border border-gp-divider bg-gp-surface p-3',
        className,
      )}
    >
      <div className="flex gap-3">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="size-18 shrink-0 rounded-md bg-gp-sunken object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-18 shrink-0 items-center justify-center rounded-md bg-gp-sunken text-gp-text-subtle"
          >
            <ImageOffIcon className="size-6" />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <Text variant="h3" as="h3" className="line-clamp-2">
            {spot.name}
          </Text>
          <span className="inline-flex h-7 items-center rounded-full border border-gp-text bg-gp-brand-yellow px-3 text-caption font-semibold text-gp-text">
            {modalityLabel(spot.modality)}
          </span>
          {hasRating ? (
            <StarRating
              mode="read"
              value={spot.ratingAverage as number}
              count={spot.reviewsCount}
              text={ratingText(spot)}
            />
          ) : (
            <Text variant="caption" tone="muted">
              Sem avaliações
            </Text>
          )}
        </div>
      </div>
      {footer}
    </div>
  );
}

function SpotCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="spot-card-skeleton"
      className={cn(
        'flex min-h-24 gap-3 rounded-lg border border-gp-divider bg-gp-surface p-3',
        className,
      )}
    >
      <Skeleton className="size-18 rounded-md" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export { SpotCard, SpotCardSkeleton };
