import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { SpotSummary } from '../../../../domain/spot/spot';
import { SpotPin } from '../SpotPin';
import { SpotPreview } from '../SpotPreview';
import { SpotCard, SpotCardSkeleton } from './index';

const spot: SpotSummary = {
  id: 's1',
  name: 'Pico da Paulista',
  modality: 'street',
  images: null,
  coordinates: null,
  ratingAverage: 4.6,
  reviewsCount: 23,
};

describe('SpotCard (DS)', () => {
  it('mostra nome, modalidade e nota, com rótulo de acessibilidade', async () => {
    await renderWithTheme(<SpotCard spot={spot} />);

    expect(screen.getByText('Pico da Paulista')).toBeTruthy();
    expect(screen.getByText('Street')).toBeTruthy();
    expect(screen.getByText('4,6 (23)')).toBeTruthy();
    expect(
      screen.getByLabelText(
        'Pico da Paulista, Street, nota 4,6, 23 avaliações',
      ),
    ).toBeTruthy();
  });

  it('sem avaliações mostra "Sem avaliações"', async () => {
    await renderWithTheme(
      <SpotCard spot={{ ...spot, ratingAverage: null, reviewsCount: 0 }} />,
    );

    expect(screen.getByText('Sem avaliações')).toBeTruthy();
  });

  it('o card inteiro é o alvo de toque', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<SpotCard spot={spot} onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('spot-card-s1'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza o skeleton', async () => {
    await renderWithTheme(<SpotCardSkeleton />);

    expect(screen.getByTestId('spot-card-skeleton')).toBeTruthy();
  });
});

describe('SpotPin (DS)', () => {
  it('mostra a nota ou "Novo" e dispara o toque', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<SpotPin spot={spot} onPress={onPress} />);
    expect(screen.getByText('★ 4,6')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('spot-pin-s1'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('sem avaliações mostra "Novo"', async () => {
    await renderWithTheme(
      <SpotPin spot={{ ...spot, ratingAverage: null, reviewsCount: 0 }} />,
    );
    expect(screen.getByText('Novo')).toBeTruthy();
  });
});

describe('SpotPreview (DS)', () => {
  it('mostra distância e abre o detalhe', async () => {
    const onViewDetails = jest.fn();
    await renderWithTheme(
      <SpotPreview
        spot={spot}
        distanceLabel="A 1,2 km de você"
        onViewDetails={onViewDetails}
      />,
    );

    expect(screen.getByText('A 1,2 km de você')).toBeTruthy();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Ver detalhes' }),
    );
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('omite a distância sem localização', async () => {
    await renderWithTheme(<SpotPreview spot={spot} onViewDetails={jest.fn()} />);

    expect(screen.queryByText(/de você/)).toBeNull();
  });
});
