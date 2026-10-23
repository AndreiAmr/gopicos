import { createRef } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../../test-utils/renderWithTheme';
import { NO_FILTERS } from '../../../../../domain/spot/filters';
import { FilterBar } from './FilterBar';
import { FilterSheet } from './FilterSheet';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheetModal: React.forwardRef(({ children }: any, _ref: any) => (
      <View>{children}</View>
    )),
    BottomSheetView: View,
    BottomSheetBackdrop: () => null,
  };
});

describe('FilterBar', () => {
  it('mostra "Filtros" sem filtros ativos', async () => {
    await renderWithTheme(
      <FilterBar filters={NO_FILTERS} onOpen={jest.fn()} onChange={jest.fn()} />,
    );
    expect(screen.getByText('Filtros')).toBeTruthy();
    expect(screen.queryByTestId(/filter-chip/)).toBeNull();
  });

  it('mostra a contagem e os chips; remover um reaplica', async () => {
    const onChange = jest.fn();
    const filters = {
      ...NO_FILTERS,
      modalities: ['street'],
      coveredOnly: true,
    };
    await renderWithTheme(
      <FilterBar filters={filters} onOpen={jest.fn()} onChange={onChange} />,
    );

    expect(screen.getByText('Filtros (2)')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('filter-chip-modality:street'));
    expect(onChange).toHaveBeenCalledWith({ ...filters, modalities: [] });
  });

  it('o botão abre o sheet', async () => {
    const onOpen = jest.fn();
    await renderWithTheme(
      <FilterBar filters={NO_FILTERS} onOpen={onOpen} onChange={jest.fn()} />,
    );
    await fireEvent.press(screen.getByTestId('filter-button'));
    expect(onOpen).toHaveBeenCalled();
  });
});

describe('FilterSheet', () => {
  const setup = async (applying = false) => {
    const onApply = jest.fn();
    await renderWithTheme(
      <FilterSheet
        ref={createRef()}
        filters={NO_FILTERS}
        applying={applying}
        onApply={onApply}
      />,
    );
    return { onApply };
  };

  it('aplica o conjunto escolhido: modalidades (multi), entrada, cobertura e nota', async () => {
    const { onApply } = await setup();

    await fireEvent.press(screen.getByTestId('filter-modality-street'));
    await fireEvent.press(screen.getByTestId('filter-modality-park'));
    await fireEvent.press(screen.getByLabelText('Gratuito'));
    await fireEvent.press(screen.getByLabelText('4+'));
    await fireEvent.press(screen.getByTestId('filter-apply'));

    expect(onApply).toHaveBeenCalledWith({
      modalities: ['street', 'park'],
      entry: 'free',
      coveredOnly: false,
      minRating: 4,
    });
  });

  it('"Limpar filtros" zera o rascunho', async () => {
    const { onApply } = await setup();

    await fireEvent.press(screen.getByTestId('filter-modality-street'));
    await fireEvent.press(screen.getByTestId('filter-clear'));
    await fireEvent.press(screen.getByTestId('filter-apply'));

    expect(onApply).toHaveBeenCalledWith(NO_FILTERS);
  });

  it('mostra o botão em loading enquanto aplica', async () => {
    await setup(true);
    expect(screen.getByTestId('ds-button-spinner')).toBeTruthy();
  });
});
