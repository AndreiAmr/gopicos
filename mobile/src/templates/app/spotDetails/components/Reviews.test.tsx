import { createRef } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { Review } from '../../../../domain/spot/reviews';
import { ReviewFormSheet } from './ReviewFormSheet';
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

const review = (id: string, over: Partial<Review> = {}): Review => ({
  id,
  rating: 4,
  description: 'Chão liso',
  createdAt: new Date().toISOString(),
  author: { id: 'u', displayName: 'Marina S.' },
  isMine: false,
  ...over,
});

const baseProps = {
  status: 'ready' as const,
  items: [] as Review[],
  myReview: null,
  totalCount: 0,
  ratingAverage: null,
  isOwner: false,
  loadingMore: false,
  moreError: false,
  onRetry: jest.fn(),
  onRetryMore: jest.fn(),
};

describe('ReviewsSection', () => {
  it('mostra skeletons ao carregar', async () => {
    await renderWithTheme(<ReviewsSection {...baseProps} status="loading" />);
    expect(screen.getByTestId('reviews-loading')).toBeTruthy();
  });

  it('mostra o vazio convidando a avaliar', async () => {
    await renderWithTheme(<ReviewsSection {...baseProps} />);
    expect(screen.getByText('Seja o primeiro a avaliar')).toBeTruthy();
  });

  it('para o autor do pico mostra só "Ainda sem avaliações."', async () => {
    await renderWithTheme(<ReviewsSection {...baseProps} isOwner />);
    expect(screen.getByText('Ainda sem avaliações.')).toBeTruthy();
    expect(screen.queryByText('Seja o primeiro a avaliar')).toBeNull();
  });

  it('mostra erro com tentar novamente', async () => {
    const onRetry = jest.fn();
    await renderWithTheme(
      <ReviewsSection {...baseProps} status="error" onRetry={onRetry} />,
    );
    await fireEvent.press(screen.getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('mostra resumo, minha avaliação no topo e a lista', async () => {
    await renderWithTheme(
      <ReviewsSection
        {...baseProps}
        totalCount={3}
        ratingAverage={4.5}
        myReview={review('m', { isMine: true, description: 'Meu texto' })}
        items={[
          review('a'),
          review('b', { author: null, description: null }),
        ]}
      />,
    );

    expect(screen.getByText('4,5')).toBeTruthy();
    expect(screen.getByText('3 avaliações')).toBeTruthy();
    expect(screen.getByText('Sua avaliação')).toBeTruthy();
    expect(screen.getByText('Meu texto')).toBeTruthy();
    expect(screen.getByText('Usuário Desativado')).toBeTruthy();
    expect(screen.getByText('?')).toBeTruthy();
    expect(screen.getAllByTestId('review-item')).toHaveLength(2);
  });

  it('mostra carregando mais e erro ao paginar', async () => {
    await renderWithTheme(
      <ReviewsSection
        {...baseProps}
        totalCount={1}
        ratingAverage={4}
        items={[review('a')]}
        loadingMore
        moreError
      />,
    );
    expect(screen.getByText('Carregando mais...')).toBeTruthy();
    expect(screen.getByText('Não foi possível carregar mais.')).toBeTruthy();
  });
});

describe('ReviewFormSheet', () => {
  const setup = async (props: Partial<React.ComponentProps<typeof ReviewFormSheet>> = {}) => {
    const onSubmit = jest.fn();
    await renderWithTheme(
      <ReviewFormSheet
        ref={createRef()}
        submitting={false}
        onSubmit={onSubmit}
        onClose={jest.fn()}
        {...props}
      />,
    );
    return { onSubmit };
  };

  it('envio fica desabilitado sem estrelas e mostra a dica', async () => {
    const { onSubmit } = await setup();

    expect(screen.getByText('Escolha de 1 a 5 estrelas')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('review-submit'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('com estrelas e comentário envia nota e texto aparado', async () => {
    const { onSubmit } = await setup();

    await fireEvent.press(screen.getByTestId('ds-star-4'));
    expect(screen.getByText('Muito bom')).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId('review-comment'), '  Ótimo pico  ');
    expect(screen.getByText('14/500')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('review-submit'));

    expect(onSubmit).toHaveBeenCalledWith(4, 'Ótimo pico');
  });

  it('comentário acima de 500 caracteres bloqueia o envio', async () => {
    const { onSubmit } = await setup();

    await fireEvent.press(screen.getByTestId('ds-star-5'));
    await fireEvent.changeText(screen.getByTestId('review-comment'), 'a'.repeat(501));
    await fireEvent.press(screen.getByTestId('review-submit'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('501/500')).toBeTruthy();
  });

  it('erro de rede aparece no formulário e preserva nota e texto', async () => {
    await setup({ error: 'Não foi possível enviar sua avaliação. Tente novamente.' });

    expect(screen.getByTestId('review-error')).toBeTruthy();
  });

  it('modo edição usa o título e o botão de salvar e parte dos valores atuais', async () => {
    const { onSubmit } = await setup({
      initial: { rating: 3, description: 'Ok' },
    });

    expect(screen.getByText('Editar sua avaliação')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('review-submit'));
    expect(onSubmit).toHaveBeenCalledWith(3, 'Ok');
    expect(screen.getByText('Salvar')).toBeTruthy();
  });
});
