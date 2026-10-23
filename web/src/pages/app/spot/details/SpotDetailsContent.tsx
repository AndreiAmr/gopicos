import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import { Text } from '@/atomic/atoms/text';
import { StarRating } from '@/atomic/molecules/starRating';
import {
  createdByText,
  detailChips,
  infoRows,
  reviewsCountText,
  spotDetailsStrings,
  validImages,
  type SpotDetails,
} from '@/domain/spot/details';
import { modalityLabel, ratingText } from '@/domain/spot/spot';
import { URL } from '@/routes/url';
import { Gallery } from './Gallery';
import { MiniMap } from './MiniMap';

const chipClass =
  'inline-flex h-7 items-center rounded-full border border-gp-text px-3 text-caption font-semibold text-gp-text';

type SpotDetailsContentProps = {
  spot: SpotDetails;
  onEdit: () => void;
  onDelete: () => void;
  /** Botão "Avaliar este pico" (coluna direita, ausente para o autor). */
  reviewAction?: ReactNode;
  /** Seção "Avaliações" (coluna esquerda, abaixo da descrição). */
  reviewsSection?: ReactNode;
};

const scrollToReviews = (event: React.MouseEvent) => {
  const target = document.getElementById('avaliacoes');
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.focus({ preventScroll: true });
};

export const SpotDetailsContent = ({
  spot,
  onEdit,
  onDelete,
  reviewAction,
  reviewsSection,
}: SpotDetailsContentProps) => {
  const hasRating = spot.reviewsCount > 0 && spot.ratingAverage != null;

  return (
    <main className="mx-auto w-full max-w-280 px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-[680px_408px] lg:grid-rows-[auto_auto_1fr] lg:justify-center lg:gap-x-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <Gallery images={validImages(spot.images)} name={spot.name} />
        </div>

        <aside className="flex flex-col gap-4 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <Link
            to={URL.HOME}
            className="flex min-h-12 w-fit items-center gap-2 rounded-md text-body-strong text-gp-primary-text outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
          >
            <ArrowLeftIcon className="size-5" aria-hidden="true" />
            {spotDetailsStrings.backToMap}
          </Link>

          <h1 className="font-display text-display text-gp-text">{spot.name}</h1>

          <ul className="flex flex-wrap gap-2" aria-label="Características">
            <li className={`${chipClass} bg-gp-brand-yellow`}>
              {modalityLabel(spot.modality)}
            </li>
            {detailChips(spot).map((chip) => (
              <li key={chip} className={`${chipClass} bg-gp-surface`}>
                {chip}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {hasRating ? (
              <StarRating
                mode="read"
                value={spot.ratingAverage as number}
                count={spot.reviewsCount}
                text={ratingText(spot)}
              />
            ) : null}
            <Text variant="body-sm" tone="muted">
              {reviewsCountText(spot.reviewsCount)}
            </Text>
            {spot.reviewsCount > 0 ? (
              <a
                href="#avaliacoes"
                onClick={scrollToReviews}
                className="text-body-sm font-semibold text-gp-primary-text underline-offset-4 hover:underline"
              >
                {spotDetailsStrings.seeReviews}
              </a>
            ) : null}
          </div>

          <dl className="divide-y divide-gp-divider">
            {infoRows(spot).map((row) => (
              <div
                key={row.label}
                className="flex min-h-11 items-center justify-between gap-4"
              >
                <dt className="text-body-sm text-gp-text-muted">{row.label}</dt>
                <dd className="text-body-sm font-semibold text-gp-text">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <MiniMap coordinates={spot.coordinates} name={spot.name} />

          <Text variant="caption" tone="muted">
            {createdByText(spot)}
          </Text>

          {reviewAction}

          {spot.isOwner ? (
            <div className="flex gap-2" data-testid="owner-actions">
              <Button variant="secondary" className="flex-1" onClick={onEdit}>
                {spotDetailsStrings.edit}
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-gp-error"
                onClick={onDelete}
              >
                {spotDetailsStrings.remove}
              </Button>
            </div>
          ) : null}
        </aside>

        <section
          aria-labelledby="descricao"
          className="lg:col-start-1 lg:row-start-2"
        >
          <Text variant="h2" as="h2" id="descricao" className="mb-2">
            Descrição
          </Text>
          <Text variant="body">
            {spot.description?.trim() || spotDetailsStrings.noDescription}
          </Text>
        </section>

        {reviewsSection ? (
          <div className="lg:col-start-1 lg:row-start-3">{reviewsSection}</div>
        ) : null}
      </div>
    </main>
  );
};
