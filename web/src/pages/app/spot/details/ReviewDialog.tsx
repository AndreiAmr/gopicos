import { useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/atomic/atoms/button';
import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { StarRating } from '@/atomic/molecules/starRating';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  COMMENT_MAX,
  canSubmitReview,
  commentCounter,
  hasDraft,
  isCommentTooLong,
  ratingLabel,
  reviewStrings,
} from '@/domain/spot/reviews';

type ReviewDialogProps = {
  open: boolean;
  /** Avaliação existente (modo edição, #59). */
  initial?: { rating: number; description: string | null } | null;
  submitting: boolean;
  error?: string | null;
  commentError?: string | null;
  onSubmit: (rating: number, description: string) => void;
  onClose: () => void;
};

/** Dialog de 480 para avaliar: StarInput, comentário 0/500, foco inicial na 1ª estrela. */
export const ReviewDialog = ({
  open,
  initial,
  submitting,
  error,
  commentError,
  onSubmit,
  onClose,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.description ?? '');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const stars = useRef<HTMLDivElement>(null);
  const commentId = useId();

  useEffect(() => {
    if (open) {
      setRating(initial?.rating ?? 0);
      setComment(initial?.description ?? '');
      setConfirmDiscard(false);
    }
  }, [open, initial]);

  const tooLong = isCommentTooLong(comment);

  // Fechar com algo digitado pede confirmação (Esc, X, fora ou Cancelar).
  const requestClose = () => {
    if (submitting) return;
    if (hasDraft(rating, comment, initial)) {
      setConfirmDiscard(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
        <DialogContent
          className="sm:max-w-120"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            stars.current?.querySelector<HTMLElement>('[role="radio"]')?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {initial ? reviewStrings.editTitle : reviewStrings.formTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Escolha de 1 a 5 estrelas e, se quiser, deixe um comentário.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmitReview(rating, comment) && !submitting) {
                onSubmit(rating, comment.trim());
              }
            }}
          >
            <div ref={stars} className="flex flex-col gap-1">
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={submitting}
                label="Nota"
              />
              <p className="text-body-sm text-gp-text-muted" aria-live="polite">
                {rating > 0 ? ratingLabel(rating) : reviewStrings.starsHint}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={commentId} className="text-body-sm font-semibold">
                {reviewStrings.comment}
              </label>
              <textarea
                id={commentId}
                value={comment}
                readOnly={submitting}
                onChange={(event) => setComment(event.target.value)}
                aria-invalid={tooLong || Boolean(commentError) || undefined}
                className={cn(
                  'h-24 w-full resize-none rounded-md border bg-gp-surface px-3 py-2 text-body outline-none focus-visible:ring-2 focus-visible:ring-gp-focus',
                  tooLong || commentError ? 'border-gp-error border-2' : 'border-gp-border',
                )}
              />
              <p
                className={cn(
                  'text-right text-caption',
                  tooLong ? 'text-gp-error' : 'text-gp-text-muted',
                )}
                aria-label={`${comment.length} de ${COMMENT_MAX} caracteres`}
              >
                {commentCounter(comment)}
              </p>
              {commentError ? (
                <p className="text-body-sm text-gp-error">{commentError}</p>
              ) : null}
            </div>

            {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={submitting}
                onClick={requestClose}
              >
                {reviewStrings.cancel}
              </Button>
              <Button
                type="submit"
                disabled={!canSubmitReview(rating, comment) || submitting}
                aria-busy={submitting || undefined}
              >
                {submitting
                  ? 'Enviando...'
                  : initial
                    ? reviewStrings.save
                    : reviewStrings.submit}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <DialogContent className="sm:max-w-100" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{reviewStrings.discardTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              O que você escreveu será perdido.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              autoFocus
              onClick={() => setConfirmDiscard(false)}
            >
              {reviewStrings.keepEditing}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDiscard(false);
                onClose();
              }}
            >
              {reviewStrings.discard}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
