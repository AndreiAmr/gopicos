import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { StarRating } from './index';

describe('StarRating (DS)', () => {
  it('modo leitura: mostra a média formatada e rótulo de acessibilidade', async () => {
    await renderWithTheme(<StarRating value={4.25} count={12} />);

    expect(screen.getByText('4,3 (12)')).toBeTruthy();
    expect(
      screen.getByLabelText('4,3 de 5 estrelas, 12 avaliações'),
    ).toBeTruthy();
  });

  it('modo leitura sem avaliações: mostra o texto de vazio', async () => {
    await renderWithTheme(<StarRating value={0} count={0} />);
    expect(screen.getByText('Sem avaliações')).toBeTruthy();
  });

  it('modo entrada: toque na estrela chama onChange com a nota', async () => {
    const onChange = jest.fn();
    await renderWithTheme(<StarRating value={0} onChange={onChange} />);

    await fireEvent.press(screen.getByLabelText('4 de 5 estrelas'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('modo entrada: marca a estrela escolhida como checked', async () => {
    await renderWithTheme(<StarRating value={3} onChange={jest.fn()} />);

    expect(
      screen.getByRole('radio', { name: '3 de 5 estrelas' }),
    ).toBeChecked();
    expect(
      screen.getByRole('radio', { name: '2 de 5 estrelas' }),
    ).not.toBeChecked();
  });

  it('estado desabilitado: não dispara onChange', async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <StarRating value={0} onChange={onChange} disabled />,
    );

    await fireEvent.press(screen.getByLabelText('2 de 5 estrelas'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('estado erro: exibe a mensagem', async () => {
    await renderWithTheme(
      <StarRating value={0} onChange={jest.fn()} error="Escolha uma nota" />,
    );
    expect(screen.getByText('Escolha uma nota')).toBeTruthy();
  });

  it('estado loading: troca as estrelas por skeleton', async () => {
    await renderWithTheme(<StarRating value={3} loading />);
    expect(screen.getByTestId('ds-star-rating')).toBeTruthy();
    expect(screen.queryByText(/\(/)).toBeNull();
  });
});
