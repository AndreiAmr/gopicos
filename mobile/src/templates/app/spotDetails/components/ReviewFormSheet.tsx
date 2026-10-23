import { forwardRef, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { View, useTheme } from 'tamagui';
import {
  MAX_FONT_SCALE,
  fontFamily,
  radius,
  space,
  typography,
} from '../../../../config/tamagui/tokens';
import { Button } from '../../../../atomic/ds/atoms/Button';
import { StarRating } from '../../../../atomic/ds/atoms/StarRating';
import { Text } from '../../../../atomic/ds/atoms/Text';
import { AlertBanner } from '../../../../atomic/ds/auth/AlertBanner';
import { BottomSheet } from '../../../../atomic/ds/molecules/BottomSheet';
import {
  COMMENT_MAX,
  canSubmitReview,
  commentCounter,
  hasDraft,
  isCommentTooLong,
  ratingLabel,
  reviewStrings,
} from '../../../../domain/spot/reviews';

type ReviewFormSheetProps = {
  /** Avaliação existente (modo edição). */
  initial?: { rating: number; description: string | null } | null;
  submitting: boolean;
  /** Erro de rede/servidor mostrado dentro do formulário (nota e texto preservados). */
  error?: string | null;
  /** Erro de validação do servidor junto ao comentário. */
  commentError?: string | null;
  onSubmit: (rating: number, description: string) => void;
  onClose: () => void;
};

/** Formulário de avaliação (nova e edição) em bottom sheet, com StarInput e comentário. */
export const ReviewFormSheet = forwardRef<BottomSheetModal, ReviewFormSheetProps>(
  ({ initial, submitting, error, commentError, onSubmit, onClose }, ref) => {
    const theme = useTheme();
    const [rating, setRating] = useState(initial?.rating ?? 0);
    const [comment, setComment] = useState(initial?.description ?? '');

    // Reabrir em outro modo (nova x edição) recomeça do valor inicial.
    useEffect(() => {
      setRating(initial?.rating ?? 0);
      setComment(initial?.description ?? '');
    }, [initial]);

    const tooLong = isCommentTooLong(comment);

    const dismiss = () => {
      if (ref && typeof ref !== 'function') {
        ref.current?.dismiss();
      }
    };

    const cancel = () => {
      if (!hasDraft(rating, comment, initial)) {
        dismiss();
        return;
      }
      Alert.alert(reviewStrings.discardTitle, undefined, [
        { text: reviewStrings.keepEditing, style: 'cancel' },
        { text: reviewStrings.discard, style: 'destructive', onPress: dismiss },
      ]);
    };

    return (
      <BottomSheet
        ref={ref}
        title={initial ? reviewStrings.editTitle : reviewStrings.formTitle}
        onClose={onClose}
      >
        <View gap={space[3]} testID="review-form">
          <View gap={space[1]}>
            <StarRating
              value={rating}
              onChange={submitting ? undefined : setRating}
              disabled={submitting}
              testID="review-stars"
            />
            <Text variant="bodySm" tone="muted" testID="review-rating-label">
              {rating > 0 ? ratingLabel(rating) : reviewStrings.starsHint}
            </Text>
          </View>

          <View gap={space[1]}>
            <Text variant="label">{reviewStrings.comment}</Text>
            <BottomSheetTextInput
              value={comment}
              onChangeText={setComment}
              editable={!submitting}
              multiline
              textAlignVertical="top"
              accessibilityLabel={reviewStrings.comment}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              placeholderTextColor={theme.textSubtle.val}
              selectionColor={theme.primary.val}
              testID="review-comment"
              style={{
                minHeight: 96,
                padding: space[3],
                borderRadius: radius.md,
                borderWidth: tooLong || commentError ? 2 : 1,
                borderColor:
                  tooLong || commentError ? theme.error.val : theme.border.val,
                backgroundColor: theme.surface.val,
                color: theme.text.val,
                fontSize: typography.body.fontSize,
                fontFamily: fontFamily.regular,
              }}
            />
            <Text
              variant="caption"
              tone={tooLong ? 'error' : 'muted'}
              align="right"
              testID="review-counter"
              accessibilityLabel={`${comment.length} de ${COMMENT_MAX} caracteres`}
            >
              {commentCounter(comment)}
            </Text>
            {commentError ? (
              <Text variant="bodySm" tone="error">
                {commentError}
              </Text>
            ) : null}
          </View>

          {error ? (
            <AlertBanner type="error" message={error} testID="review-error" />
          ) : null}

          <View gap={space[2]}>
            <Button
              label={initial ? reviewStrings.save : reviewStrings.submit}
              loading={submitting}
              disabled={!canSubmitReview(rating, comment)}
              onPress={() => onSubmit(rating, comment.trim())}
              fullWidth
              testID="review-submit"
            />
            <Button
              label={reviewStrings.cancel}
              variant="ghost"
              disabled={submitting}
              onPress={cancel}
              fullWidth
              testID="review-cancel"
            />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

ReviewFormSheet.displayName = 'ReviewFormSheet';
