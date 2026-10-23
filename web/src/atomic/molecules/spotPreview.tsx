import { Link } from 'react-router';

import { cn } from '@/lib/utils';
import { Text } from '@/atomic/atoms/text';
import { buttonVariants } from '@/atomic/atoms/button.variants';
import { SpotCard } from '@/atomic/molecules/spotCard';
import type { SpotSummary } from '@/domain/spot/spot';

type SpotPreviewProps = {
  spot: SpotSummary;
  /** "A 1,2 km de você", quando há localização. */
  distanceLabel?: string;
  className?: string;
};

/** Resumo do pico no mapa (DS: SpotPreview): o SpotCard compacto + distância + "Ver detalhes". */
function SpotPreview({ spot, distanceLabel, className }: SpotPreviewProps) {
  return (
    <SpotCard
      spot={spot}
      className={cn('w-full shadow-2', className)}
      footer={
        <div className="flex items-center justify-between gap-3">
          {distanceLabel ? (
            <Text variant="caption" tone="muted">
              {distanceLabel}
            </Text>
          ) : (
            <span />
          )}
          <Link
            to={`/spot/${spot.id}`}
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
          >
            Ver detalhes
          </Link>
        </div>
      }
    />
  );
}

export { SpotPreview };
