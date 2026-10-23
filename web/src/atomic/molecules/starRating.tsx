import * as React from 'react';
import { AlertCircleIcon, StarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/atomic/atoms/skeleton';
import {
  MAX_STARS,
  clampRating,
  nextRating,
  starLabel,
  summaryText,
} from './starRating.utils';

type CommonProps = {
  className?: string;
  /** Estado de carregamento: mostra skeleton no lugar das estrelas. */
  isLoading?: boolean;
};

type InputProps = CommonProps & {
  mode?: 'input';
  /** Nota selecionada (0 = nenhuma). */
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
};

type ReadProps = CommonProps & {
  mode: 'read';
  /** Media (0 a 5, aceita decimais). */
  value: number;
  count?: number;
  /** Texto ao lado das estrelas, quando diferente do padrão ("4,6 (23)"). */
  text?: string;
};

type StarRatingProps = InputProps | ReadProps;

const starPath = (fillPercent: number, size: 'input' | 'read') => {
  const dim = size === 'input' ? 'size-8' : 'size-4';

  return (
    <span className={cn('relative inline-block', dim)} aria-hidden="true">
      <StarIcon className={cn('absolute inset-0 text-gp-border', dim)} />
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <StarIcon className={cn('fill-gp-star text-gp-star', dim)} />
      </span>
    </span>
  );
};

function StarRating(props: StarRatingProps) {
  if (props.isLoading) {
    return (
      <Skeleton
        data-slot="star-rating-loading"
        className={cn(
          props.mode === 'read' ? 'h-4 w-24' : 'h-12 w-56',
          props.className,
        )}
      />
    );
  }

  if (props.mode === 'read') {
    const average = clampRating(props.value);

    return (
      <span
        data-slot="star-rating"
        role="img"
        aria-label={`Nota ${summaryText(average)} de ${MAX_STARS}${
          props.count === undefined ? '' : `, ${props.count} avaliações`
        }`}
        className={cn('inline-flex items-center gap-1', props.className)}
      >
        <span className="inline-flex">
          {Array.from({ length: MAX_STARS }, (_, index) => {
            const fill = Math.round(
              Math.min(1, Math.max(0, average - index)) * 100,
            );
            return <React.Fragment key={index}>{starPath(fill, 'read')}</React.Fragment>;
          })}
        </span>
        <span className="text-caption font-medium text-gp-text-muted">
          {props.text ?? summaryText(average, props.count)}
        </span>
      </span>
    );
  }

  return <StarRatingInput {...props} />;
}

function StarRatingInput({
  value,
  onChange,
  disabled = false,
  error,
  label = 'Nota de 1 a 5 estrelas',
  className,
}: InputProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const errorId = React.useId();
  const current = clampRating(Math.round(value));
  const preview = hover ?? current;
  // Roving tabindex: so uma estrela entra na ordem de foco.
  const tabbable = current > 0 ? current : 1;

  const select = (position: number, focus = false) => {
    onChange(position);
    if (focus) refs.current[position - 1]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, position: number) => {
    if (disabled) return;
    const next = nextRating(current || position, event.key);
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div data-slot="star-rating" className={cn('flex flex-col gap-1', className)}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('flex items-center', disabled && 'opacity-40')}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const position = index + 1;
          return (
            <button
              key={position}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={current === position}
              aria-label={starLabel(position)}
              tabIndex={position === tabbable ? 0 : -1}
              disabled={disabled}
              onClick={() => select(position)}
              onKeyDown={(event) => onKeyDown(event, position)}
              onMouseEnter={() => !disabled && setHover(position)}
              className="inline-flex size-12 items-center justify-center rounded-md outline-none transition-colors hover:bg-gp-sunken focus-visible:ring-2 focus-visible:ring-gp-focus disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {starPath(position <= preview ? 100 : 0, 'input')}
            </button>
          );
        })}
      </div>
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1 text-caption text-gp-error"
        >
          <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export { StarRating };
