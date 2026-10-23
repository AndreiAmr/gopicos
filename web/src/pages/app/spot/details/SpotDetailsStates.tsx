import { Link } from 'react-router';

import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { Skeleton } from '@/atomic/atoms/skeleton';
import { buttonVariants } from '@/atomic/atoms/button.variants';
import { spotDetailsStrings } from '@/domain/spot/details';
import { URL } from '@/routes/url';

export const SpotDetailsLoading = () => (
  <div
    data-testid="spot-details-loading"
    aria-busy="true"
    className="mx-auto grid w-full max-w-280 gap-8 px-4 py-6 lg:grid-cols-[680px_408px] lg:justify-center"
  >
    <Skeleton className="h-64 w-full rounded-lg sm:h-105" />
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-18 w-full" />
      <Skeleton className="h-18 w-full" />
      <Skeleton className="h-45 w-full" />
    </div>
  </div>
);

export const SpotNotFound = () => (
  <div
    data-testid="spot-not-found"
    className="mx-auto flex w-full max-w-120 flex-col items-center gap-4 px-4 py-20 text-center"
  >
    <h1 className="font-display text-display text-gp-text">
      {spotDetailsStrings.notFoundTitle}
    </h1>
    <p className="text-body text-gp-text-muted">
      {spotDetailsStrings.notFoundDescription}
    </p>
    <Link to={URL.HOME} className={buttonVariants({ size: 'lg' })}>
      {spotDetailsStrings.backToMap}
    </Link>
  </div>
);

export const SpotDetailsError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="mx-auto w-full max-w-120 px-4 py-20">
    <AlertBanner
      variant="error"
      action={{ label: spotDetailsStrings.retry, onClick: onRetry }}
    >
      {spotDetailsStrings.error}
    </AlertBanner>
  </div>
);
