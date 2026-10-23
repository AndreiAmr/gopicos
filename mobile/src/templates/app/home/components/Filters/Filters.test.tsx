import { createRef } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../../test-utils/renderWithTheme';
import { NO_FILTERS } from '../../../../../domain/spot/filters';
import { ActiveChips, FilterButton } from './FilterBar';
import { FilterSheet } from './FilterSheet';

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheetModal: React.forwardRef(
      ({ children, footerComponent }: any, _ref: any) => (
        <View>
          {children}
          {footerComponent ? footerComponent({}) : null}
        </View>
      ),
    ),
    BottomSheetView: View,
    BottomSheetBackdrop: () => null,
    BottomSheetScrollView: View,
    BottomSheetFooter: View,
  };
});

describe('FilterButton', () => {
  it('sem filtros mostra "Filtros" sem selo e abre o sheet', async () => {
    const onOpen = jest.fn();
    await renderWithTheme(<FilterButton filters={NO_FILTERS} onOpen={onOpen} />);
    expect(screen.getByText('Filtros')).toBeTruthy();
    expect(screen.queryByTestId('filter-badge')).toBeNull();
    await fireEvent.press(screen.getByTestId('filter-button'));
    expect(onOpen).toHaveBeenCalled();
  });

  it('com filtros mostra o selo com o número e o rótulo acessível', async () => {
    const filters = { ...NO_FILTERS, modalities: ['street'], coveredOnly: true };
    await renderWithTheme(<FilterButton filters={filters} onOpen={jest.fn()} />);
    expect(screen.getByTestId('filter-badge')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByLabelText('Filtros, 2 aplicados')).toBeTruthy();
  });
});

describe('ActiveChips', () => {
  it('sem filtro não renderiza nada', async () => {
    await renderWithTheme(<ActiveChips filters={NO_FILTERS} onChange={jest.fn()} />);
    expect(screen.queryByTestId('filter-chips')).toBeNull();
  });

  it('remover um chip reaplica na hora', async () => {
    const onChange = jest.fn();
    const filters = { ...NO_FILTERS, modalities: ['street'], coveredOnly: true };
    await renderWithTheme(<ActiveChips filters={filters} onChange={onChange} />);
    await fireEvent.press(screen.getByTestId('filter-chip-modality:street'));
    expect(onChange).toHaveBeenCalledWith({ ...filters, modalities: [] });
  });
});

describe('FilterSheet', () => {
  const setup = async (applying = false) => {
    const onApply = jest.fn();
    const onDraftChange = jest.fn();
    await renderWithTheme(
      <FilterSheet
        ref={createRef()}
        filters={NO_FILTERS}
        applying={applying}
        onApply={onApply}
        onDraftChange={onDraftChange}
        previewCount={3}
      />,
    );
    return { onApply, onDraftChange };
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

  it('prévia ao vivo: cada toque avisa o rascunho e o botão vira "Ver N picos"', async () => {
    const { onDraftChange } = await setup();
    expect(screen.getByText('Aplicar filtros')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('filter-modality-street'));

    expect(onDraftChange).toHaveBeenLastCalledWith({ ...NO_FILTERS, modalities: ['street'] });
    expect(screen.getByText('Ver 3 picos')).toBeTruthy();
  });

  it('"Limpar" zera o rascunho', async () => {
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
