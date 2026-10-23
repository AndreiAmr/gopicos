import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { SpotDetails } from '../../../domain/spot/details';
import { SpotDetailsContent } from './components/SpotDetailsContent';

jest.mock('./components/MiniMap', () => ({ MiniMap: () => null }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const spot: SpotDetails = {
  id: 's1',
  name: 'Pico da Praça',
  description: 'Corrimão e escadas.',
  modality: 'street',
  isPaid: true,
  entryAmount: 'R$ 20',
  alwaysOpen: false,
  openingHours: '8h às 22h',
  hasCoverage: true,
  equipmentRequired: true,
  images: [],
  coordinates: null,
  ratingAverage: 4.6,
  reviewsCount: 23,
  isOwner: false,
  author: { id: 'u1', displayName: 'Marina S.' },
};

const renderContent = (over: Partial<SpotDetails> = {}) => {
  const handlers = { onBack: jest.fn(), onEdit: jest.fn(), onDelete: jest.fn() };
  return renderWithTheme(
    <SpotDetailsContent spot={{ ...spot, ...over }} {...handlers} />,
  ).then(() => handlers);
};

describe('SpotDetailsContent', () => {
  it('mostra nome, chips, nota, descrição, InfoRows e autor', async () => {
    await renderContent();

    expect(screen.getByText('Pico da Praça')).toBeTruthy();
    expect(screen.getByText('Street')).toBeTruthy();
    expect(screen.getAllByText('R$ 20').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Coberto').length).toBeGreaterThan(0);
    expect(screen.getByText('4,6')).toBeTruthy();
    expect(screen.getByText('23 avaliações')).toBeTruthy();
    // Com avaliações, "Sem avaliações" nunca aparece (GP-133).
    expect(screen.queryByText(/Sem avaliações/)).toBeNull();
    expect(screen.getByText('Corrimão e escadas.')).toBeTruthy();
    expect(screen.getByLabelText('Horário: 8h às 22h')).toBeTruthy();
    expect(screen.getByLabelText('Equipamento: Exige proteção')).toBeTruthy();
    expect(screen.getByText('Criado por Marina S.')).toBeTruthy();
    expect(screen.getByTestId('gallery-empty')).toBeTruthy();
  });

  it('não autor: Editar e Excluir ausentes', async () => {
    await renderContent();

    expect(screen.queryByTestId('spot-owner-actions')).toBeNull();
  });

  it('autor: vê Editar e Excluir', async () => {
    const handlers = await renderContent({ isOwner: true });

    await fireEvent.press(screen.getByRole('button', { name: 'Editar' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Excluir' }));
    expect(handlers.onEdit).toHaveBeenCalledTimes(1);
    expect(handlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('sem avaliações e voltar', async () => {
    const handlers = await renderContent({ reviewsCount: 0, ratingAverage: null });

    expect(screen.getByText('Sem avaliações ainda')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    expect(handlers.onBack).toHaveBeenCalledTimes(1);
  });
});
