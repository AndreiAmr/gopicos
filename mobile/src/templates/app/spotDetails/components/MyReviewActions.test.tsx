import { createRef } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { Review } from '../../../../domain/spot/reviews';
import { DeleteReviewSheet } from './DeleteReviewSheet';
import { ReviewsSection } from './ReviewsSection';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  return {
    BottomSheetModal: React.forwardRef(({ children }: any, _ref: any) => (
      <View>{children}</View>
    )),
    BottomSheetView: View,
    BottomSheetBackdrop: () => null,
    BottomSheetTextInput: TextInput,
  };
});

const mine: Review = {
  id: 'r1',
  rating: 3,
  description: 'Meu comentário',
  createdAt: new Date().toISOString(),
  author: { id: 'u', displayName: 'Eu M.' },
  isMine: true,
};

const baseProps = {
  status: 'ready' as const,
  items: [] as Review[],
  myReview: mine,
  totalCount: 1,
  ratingAverage: 3,
  isOwner: false,
  loadingMore: false,
  moreError: false,
  onRetry: jest.fn(),
  onRetryMore: jest.fn(),
};

describe('Minha avaliação: Editar e Excluir', () => {
  it('mostra as ações na minha avaliação e repassa a avaliação', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await renderWithTheme(
      <ReviewsSection
        {...baseProps}
        onEditMine={onEdit}
        onDeleteMine={onDelete}
      />,
    );

    await fireEvent.press(screen.getByTestId('my-review-edit'));
    expect(onEdit).toHaveBeenCalledWith(mine);
    await fireEvent.press(screen.getByTestId('my-review-delete'));
    expect(onDelete).toHaveBeenCalledWith(mine);
  });

  it('sem handlers (ou em avaliações de outros) não há ações', async () => {
    await renderWithTheme(
      <ReviewsSection
        {...baseProps}
        myReview={null}
        items={[{ ...mine, id: 'r2', isMine: false }]}
        onEditMine={jest.fn()}
        onDeleteMine={jest.fn()}
      />,
    );
    expect(screen.queryByTestId('my-review-actions')).toBeNull();
  });
});

describe('DeleteReviewSheet', () => {
  it('confirma, cancela e mostra o erro dentro da confirmação', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await renderWithTheme(
      <DeleteReviewSheet
        ref={createRef<BottomSheetModal>()}
        deleting={false}
        error="Não foi possível excluir. Tente novamente."
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByTestId('delete-review-sheet')).toBeTruthy();
    expect(screen.getByTestId('delete-review-error')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('delete-review-confirm'));
    expect(onConfirm).toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId('delete-review-cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
