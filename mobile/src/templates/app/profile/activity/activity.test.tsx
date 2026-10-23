import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import {
  fullDate,
  relativeDate,
  reviewA11yLabel,
  reviewsCountLabel,
  spotsCountLabel,
} from './logic';
import { MySpotsTemplate } from './MySpots';
import { MyReviewsTemplate } from './MyReviews';

let mockSpots: Record<string, unknown>;
let mockReviews: Record<string, unknown>;
const mockOpenSpot = jest.fn();
const mockGoToNewSpot = jest.fn();
const mockGoToMap = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('./useActivityScreens', () => ({
  useMySpotsScreen: () => mockSpots,
  useMyReviewsScreen: () => mockReviews,
}));

const base = {
  refreshing: false,
  refresh: jest.fn(),
  goBack: jest.fn(),
  openSpot: (id: string) => mockOpenSpot(id),
  goToNewSpot: () => mockGoToNewSpot(),
  goToMap: () => mockGoToMap(),
  loading: false,
  error: null,
};

const spot = {
  id: 's1',
  name: 'Pico Central',
  modality: 'street',
  images: [],
  coordinates: null,
  ratingAverage: null,
  reviewsCount: 0,
};

const review = {
  id: 'r1',
  rating: 4,
  description: 'Chão liso',
  createdAt: '2026-10-01T12:00:00.000Z',
  spot: { id: 's9', name: 'Bowl da Praça', modality: 'bowl_pool' },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSpots = { ...base, spots: [spot] };
  mockReviews = { ...base, reviews: [review] };
});

describe('textos e datas', () => {
  it('singular e plural das contagens', () => {
    expect(spotsCountLabel(1)).toBe('1 pico');
    expect(spotsCountLabel(3)).toBe('3 picos');
    expect(reviewsCountLabel(1)).toBe('1 avaliação');
    expect(reviewsCountLabel(2)).toBe('2 avaliações');
  });

  it('data relativa', () => {
    const now = new Date('2026-10-22T12:00:00.000Z').getTime();
    expect(relativeDate('2026-10-22T11:30:00.000Z', now)).toBe('agora há pouco');
    expect(relativeDate('2026-10-22T09:00:00.000Z', now)).toBe('há 3 horas');
    expect(relativeDate('2026-10-21T09:00:00.000Z', now)).toBe('há 1 dia');
    expect(relativeDate('2026-10-08T12:00:00.000Z', now)).toBe('há 2 semanas');
    expect(relativeDate('2026-08-22T12:00:00.000Z', now)).toBe('há 2 meses');
    expect(relativeDate('lixo', now)).toBe('');
  });

  it('data completa e rótulo de acessibilidade', () => {
    expect(fullDate('2026-10-01T12:00:00.000Z')).toBe('01/10/2026');
    expect(reviewA11yLabel(review)).toBe(
      'Bowl da Praça, sua nota 4 de 5, 01/10/2026. Chão liso. Abrir pico.',
    );
  });
});

describe('MySpotsTemplate', () => {
  it('lista os picos, mostra a contagem e abre o detalhe ao tocar', async () => {
    await renderWithTheme(<MySpotsTemplate />);
    expect(screen.getByText('1 pico')).toBeTruthy();
    fireEvent.press(screen.getByTestId('my-spot-s1'));
    expect(mockOpenSpot).toHaveBeenCalledWith('s1');
  });

  it('carregando mostra skeletons', async () => {
    mockSpots = { ...base, spots: null, loading: true };
    await renderWithTheme(<MySpotsTemplate />);
    expect(screen.getByTestId('my-spots-skeleton')).toBeTruthy();
  });

  it('vazio mostra o atalho Cadastrar pico', async () => {
    mockSpots = { ...base, spots: [] };
    await renderWithTheme(<MySpotsTemplate />);
    expect(screen.getByText('Você ainda não cadastrou nenhum pico.')).toBeTruthy();
    fireEvent.press(screen.getByText('Cadastrar pico'));
    expect(mockGoToNewSpot).toHaveBeenCalled();
  });

  it('erro mostra Tentar novamente', async () => {
    mockSpots = { ...base, spots: null, error: new Error('x') };
    await renderWithTheme(<MySpotsTemplate />);
    fireEvent.press(screen.getByText('Tentar novamente'));
    expect(base.refresh).toHaveBeenCalled();
  });
});

describe('MyReviewsTemplate', () => {
  it('lista as avaliações e abre o pico ao tocar', async () => {
    await renderWithTheme(<MyReviewsTemplate />);
    expect(screen.getByText('Bowl da Praça')).toBeTruthy();
    expect(screen.getByText('Chão liso')).toBeTruthy();
    fireEvent.press(screen.getByTestId('my-review-r1'));
    expect(mockOpenSpot).toHaveBeenCalledWith('s9');
  });

  it('avaliação só com estrelas não mostra comentário', async () => {
    mockReviews = { ...base, reviews: [{ ...review, description: null }] };
    await renderWithTheme(<MyReviewsTemplate />);
    expect(screen.queryByText('Chão liso')).toBeNull();
  });

  it('vazio mostra o atalho Explorar o mapa', async () => {
    mockReviews = { ...base, reviews: [] };
    await renderWithTheme(<MyReviewsTemplate />);
    expect(screen.getByText('Você ainda não avaliou nenhum pico.')).toBeTruthy();
    fireEvent.press(screen.getByText('Explorar o mapa'));
    expect(mockGoToMap).toHaveBeenCalled();
  });

  it('carregando e erro', async () => {
    mockReviews = { ...base, reviews: null, loading: true };
    await renderWithTheme(<MyReviewsTemplate />);
    expect(screen.getAllByTestId('my-reviews-skeleton').length).toBe(3);
  });
});
