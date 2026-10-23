import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../../test-utils/renderWithTheme';
import { Place } from '../../../../../domain/place/place';
import { PlaceSearch } from '.';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockSearch = {
  text: '',
  status: 'idle',
  results: [] as Place[],
  onChangeText: jest.fn(),
  commit: jest.fn(),
  restore: jest.fn(),
  clear: jest.fn(),
  retry: jest.fn(),
};

jest.mock('../../../../../hooks/query/places/usePlaceSearch', () => ({
  usePlaceSearch: () => mockSearch,
}));

const place: Place = {
  name: 'Avenida Paulista, São Paulo',
  lat: -23.56,
  lng: -46.65,
  road: 'Avenida Paulista',
  district: null,
  suburb: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  boundingBox: null,
};

const setup = async (over: Partial<typeof mockSearch> = {}) => {
  Object.assign(mockSearch, {
    text: '',
    status: 'idle',
    results: [],
    ...over,
  });
  const onSelectPlace = jest.fn();
  await renderWithTheme(<PlaceSearch onSelectPlace={onSelectPlace} />);
  return { onSelectPlace };
};

beforeEach(() => jest.clearAllMocks());

describe('PlaceSearch', () => {
  it('mostra o campo com o placeholder e a lista só ao focar', async () => {
    await setup();

    expect(screen.getByPlaceholderText('Buscar cidade ou endereço')).toBeTruthy();
    expect(screen.queryByTestId('place-search-list')).toBeNull();

    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    expect(screen.getByTestId('place-search-list')).toBeTruthy();
    expect(screen.getByTestId('place-search-dim')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('mostra a dica com 1 a 2 letras', async () => {
    await setup({ status: 'hint', text: 'sa' });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    expect(screen.getByText('Digite ao menos 3 letras')).toBeTruthy();
  });

  it('mostra carregando, vazio e erro com tentar novamente', async () => {
    await setup({ status: 'loading', text: 'abc' });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    expect(screen.getByText('Buscando...')).toBeTruthy();
  });

  it('mostra vazio', async () => {
    await setup({ status: 'empty', text: 'abc' });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    expect(
      screen.getByText('Nenhum lugar encontrado. Tente outro nome ou endereço.'),
    ).toBeTruthy();
  });

  it('mostra erro e permite tentar de novo', async () => {
    await setup({ status: 'error', text: 'abc' });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    expect(screen.getByText('Não foi possível buscar agora.')).toBeTruthy();
    await fireEvent.press(screen.getByText('Tentar novamente'));
    expect(mockSearch.retry).toHaveBeenCalled();
  });

  it('escolher um resultado centraliza o mapa e mantém o nome no campo', async () => {
    const { onSelectPlace } = await setup({
      status: 'ready',
      text: 'paulista',
      results: [place],
    });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');

    expect(screen.getByText('Avenida Paulista')).toBeTruthy();
    expect(screen.getByText('Bela Vista, São Paulo, SP')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('place-result'));
    expect(mockSearch.commit).toHaveBeenCalledWith(place);
    expect(onSelectPlace).toHaveBeenCalledWith(place);
  });

  it('o return do teclado escolhe a primeira sugestão', async () => {
    const { onSelectPlace } = await setup({
      status: 'ready',
      text: 'paulista',
      results: [place],
    });
    await fireEvent(screen.getByTestId('place-search-input'), 'submitEditing');
    expect(onSelectPlace).toHaveBeenCalledWith(place);
  });

  it('cancelar restaura o texto de antes de focar', async () => {
    await setup({ text: 'Santos' });
    await fireEvent(screen.getByTestId('place-search-input'), 'focus');
    await fireEvent.press(screen.getByTestId('place-search-cancel'));
    expect(mockSearch.restore).toHaveBeenCalledWith('Santos');
  });

  it('o X limpa o campo', async () => {
    await setup({ text: 'Santos' });
    await fireEvent.press(screen.getByTestId('place-search-clear'));
    expect(mockSearch.clear).toHaveBeenCalled();
  });
});
