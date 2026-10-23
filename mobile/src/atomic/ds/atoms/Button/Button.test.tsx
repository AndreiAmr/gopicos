import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { Button } from './index';

describe('Button (DS)', () => {
  it('estado default: renderiza o rótulo e dispara onPress', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Salvar" onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(screen.getByText('Salvar')).toBeTruthy();

    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('estado pressed: aceita pressIn/pressOut sem disparar o clique', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Salvar" onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Salvar' });
    await fireEvent(button, 'pressIn');
    await fireEvent(button, 'pressOut');

    expect(onPress).not.toHaveBeenCalled();
  });

  it('estado desabilitado: não dispara onPress e expõe disabled na a11y', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Salvar" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Salvar' });
    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('estado loading: mostra spinner, bloqueia o toque e marca busy', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button label="Salvar" onPress={onPress} loading />);

    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(screen.getByTestId('ds-button-spinner')).toBeTruthy();
    expect(button).toBeBusy();

    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('sem loading não renderiza o spinner', async () => {
    await renderWithTheme(<Button label="Salvar" />);
    expect(screen.queryByTestId('ds-button-spinner')).toBeNull();
  });

  it.each(['primary', 'secondary', 'ghost', 'destructive'] as const)(
    'renderiza a variante %s nos dois temas',
    async variant => {
      await renderWithTheme(
        <Button label={variant} variant={variant} />,
        'dark',
      );
      expect(screen.getByText(variant)).toBeTruthy();
    },
  );
});
